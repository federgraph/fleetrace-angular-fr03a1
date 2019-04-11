import { IScoringModel } from "./scoring-model";
import { TRacePoints } from "./scoring-race-points";
import { TRace } from "./scoring-race";
import { TRacePointsList } from "./scoring-race-points-list";
import { TFinish } from "./scoring-finish";
import { Constants, TRSPenalty } from "./scoring-penalty";
import { TRaceList } from "./scoring-race-list";
import { TEntryList } from "./scoring-entry-list";
import { TSeriesPointsList } from "./scoring-series-points-list";
import { TSeriesPoints } from "./scoring-series-points";
import { TEntry } from "./scoring-entry";

/**ISAF LowPoint scoring system*/
export class TScoringLowPoint implements IScoringModel {

    static readonly TLE_DNF = 0;
    static readonly TLE_FINISHERSPLUS1 = 1;
    static readonly TLE_FINISHERSPLUS2 = 2;
    static readonly TLE_AVERAGE = 3;

    static readonly TIE_RRS_DEFAULT: number = 1;
    static readonly TIE_RRS_A82_ONLY: number = 2;
    
    protected static readonly TIEBREAK_INCREMENT: number = 0.0001;
    
    FirstIs75 = false;
    ReorderRAF = true;
    HasFleets: boolean = false;
    TargetFleetSize: number = 8;
    IsFinalRace: boolean = false;
    TiebreakerMode: number = TScoringLowPoint.TIE_RRS_DEFAULT;

    /**
     * option per RRS2001 A9 for different penalties for "long" series
     * If true, the penalties as per A9 will be applied
    */
    IsLongSeries = false;

    FixedNumberOfThrowouts = 0;

    /**
     * Default percentage penalty for failure to check-in
     */
    CheckinPercent = 20;    
    TimeLimitPenalty: number;

    constructor() {
        this.TimeLimitPenalty = TScoringLowPoint.TLE_DNF;
    }

    getID(): number {
        return 0;
    }
    getName(): string {
        return "Low Point";
    }

    setAttributes(value: IScoringModel) {
        try {
            const that: TScoringLowPoint = value as TScoringLowPoint;
            this.CheckinPercent = that.CheckinPercent;
            this.IsLongSeries = that.IsLongSeries;
            this.TimeLimitPenalty = that.TimeLimitPenalty;
            this.FixedNumberOfThrowouts = that.FixedNumberOfThrowouts;
            this.FirstIs75 = that.FirstIs75;
            this.ReorderRAF = that.ReorderRAF;
        }
        catch
        {
        }
    }

    protected setTiedPoints(value: Array<TRacePoints>): void {
        let pts = 0;
        value.forEach((rp: TRacePoints) => {
            pts += rp.Points;
        });
        pts = pts / value.length;

        value.forEach((rp: TRacePoints) => {
            rp.Points = pts;
        });
    }

    /**
     * trivial implementation, doesn't really sort at all
    */
    compareTo(that: TScoringLowPoint): number {
        return 0; // this.toString().compareTo(obj.toString());
    }

    /**
     * compares two lowpoint systems for equality of their optional settings
     */
    equals(that: TScoringLowPoint): boolean {
        // if (!(obj instanceof TScoringLowPoint))
        //     return false;
        if (! that)
            return false;
        if (this === that)
            return true;

        // let that: TScoringLowPoint = obj as TScoringLowPoint;

        if (!(this.toString() === that.toString()))
            return false;
        if (this.CheckinPercent !== that.CheckinPercent)
            return false;
        if (this.TimeLimitPenalty !== that.TimeLimitPenalty)
            return false;

        return this.FixedNumberOfThrowouts === that.FixedNumberOfThrowouts;
        // return this.Throwouts.equals(that.Throwouts);
    }

    toString(): string {
        return "ScoringLowPoint";
    }

    scoreRace(r: TRace, points: TRacePointsList, positionOnly: boolean) {
        if (r.HasFleets)
            this.scoreRace2(r, points, this.FirstIs75, positionOnly);
        else
            this.scoreRace1(r, points, this.FirstIs75, positionOnly);
    }

    protected scoreRace2(
        race: TRace, points: TRacePointsList, firstIs75: boolean, positionOnly: boolean) {
        this.HasFleets = race.HasFleets;
        this.TargetFleetSize = race.TargetFleetSize;
        this.IsFinalRace = race.IsFinalRace;

        // find the number of fleets in the race
        let fc = 0;
        points.forEach((rp: TRacePoints) => {
            if (rp.Finish != null && rp.Finish.Fleet > fc)
                fc = rp.Finish.Fleet;
        });

        const rpl: TRacePointsList = new TRacePointsList();

        // call scoreRace for each fleet
        for (let j = 0; j <= fc; j++) {
            points.forEach((rp: TRacePoints) => {
                if (rp.Finish != null && rp.Finish.Fleet === j) {
                    rpl.Add(rp);
                }
            });
            if (rpl.length > 0)
                this.scoreRace1(race, rpl, this.FirstIs75, positionOnly);
            rpl.length = 0;
        }
    }

    /**
     * Given a Race, and a list of Entries calculates the RacePoints object
     * he entries should be assumed to represent a single class within the Race
     * alculateRace can assume that an Entries without a finish in the Race is DNC
     * ut should recognize that the Race may well have finishers not in the Entries.
     * 
     * Also assumes that points is pre-populated, just needs to have finish points
     * assigned throws ScoringException if there is a problem with the scoring
     * 
     * @param r race to be scored
     * @param points racepointslist in which to store the results
     * @param firstIs75 true if first place should be .75
     * @param positionOnly 
    */
    protected scoreRace1(
        r: TRace, 
        points: TRacePointsList, 
        firstIs75: boolean, 
        positionOnly: boolean
    ) {
        // sort points on finishposition sorted top to bottom by finish
        points.sortFinishPosition();

        let pts: number = (firstIs75 ? .75 : 1.0);

        // position within the divsion (as opposed to within the fleet)
        let divPosition = 1;

        let valid: boolean;
        let isdsq: boolean;
        let israf: boolean;
        // loop thru the race's finishes, for each finish in the list, set the points			
        points.forEach((rp: TRacePoints) => {
            const f: TFinish = rp.Finish;
            let basePts: number = pts;
            rp.Position = divPosition++;

            valid = f.FinishPosition.isValidFinish();
            isdsq = f.Penalty.isDsqPenalty();
            israf = f.Penalty.hasPenalty(Constants.RAF);

            let isNormalCountup: boolean = (valid) && (!isdsq);

            if (!this.ReorderRAF)
                isNormalCountup = (valid) && (israf || !isdsq);

            if (isNormalCountup) {
                // RAF does not alter finish places

                // increment points to be assigned to next guy if this
                // one is a valid finisher and not disqualified
                if (pts === .75)
                    pts = 1.0;
                pts++;
            }
            else {
                rp.Position = f.FinishPosition.intValue(); // has penalty type ecoded
            }
            if (f.hasPenalty()) {
                basePts = this.getPenaltyPoints(f.Penalty, points, basePts);
            }
            if (!positionOnly) {
                if (rp.IsMedalRace)
                    rp.Points = basePts * 2;
                else if (!rp.Finish.IsRacing)
                    rp.Points = 0.0;
                else
                    rp.Points = basePts;
            }
        });

        if (!positionOnly) {
            // look for ties - must be done with correctedtime
            let lastrp: TRacePoints = null;
            const tied: Array<TRacePoints> = new Array<TRacePoints>();
            points.forEach((rp: TRacePoints) => {
                if (rp.isTied(lastrp)) {
                    // boats are tied if neither has a penalty and the current boat
                    // has a valid corrected time, and its the same as the last corrected time
                    if (tied.length === 0)
                        tied.push(lastrp);
                    tied.push(rp);
                }
                else if (tied.length > 0) {
                    // coming out of set of tied boats, reset their points and clear out
                    this.setTiedPoints(tied);
                    tied.length = 0;
                }
                lastrp = rp;
            });
            // if processing tieds at end of loop
            if (tied.length > 0)
                this.setTiedPoints(tied);
        }
    }

    /**
     * Calculates the overall series points.
     * Assume that each individual race has already been calculated, and that throwouts have already be designated in the points objects
     * 
     * @param races list of races involved in the series
     * @param entries to be considered in this series
     * @param points list of points for all races and entries (and maybe more)
     * @param series map in which (key=entry, value=Double) series points are to be calculated.
     * @exception throws ScoringException if problem
     */
    scoreSeries(
        races: TRaceList,
        entries: TEntryList,
        points: TRacePointsList,
        series: TSeriesPointsList): void {
        series.forEach((sp: TSeriesPoints) => {
            const e: TEntry = sp.Entry;
            const ePoints: TRacePointsList = points.findAllPointsForEntry(e); // list of e's finishes
            let tot = 0;
            ePoints.forEach((p: TRacePoints) => {
                if (!p.IsThrowout)
                    tot += p.Points;
            });
            sp.Points = tot;
        });
    }

    calculateTieBreakers(
        races: TRaceList,
        entries: TEntryList,
        racepoints: TRacePointsList,
        seriespoints: TSeriesPointsList): void {
        let r: TRace;
        let rp: TRacePoints;
        let TiebreakerMode = TScoringLowPoint.TIE_RRS_DEFAULT;

        let i = races.length;
        while (i > 0)
        // for (int i = races.Count-1; i >= 0; i--)
        {
            i--;
            r = races[i];
            if (r.IsFinalRace) {
                entries.forEach((e: TEntry) => {
                    rp = racepoints.findPoints(r, e);
                    if (rp != null) {
                        if (rp.Finish != null) {
                            if (rp.Finish.Fleet === 0)
                                TiebreakerMode = TScoringLowPoint.TIE_RRS_A82_ONLY;
                            else
                                TiebreakerMode = TScoringLowPoint.TIE_RRS_DEFAULT;
                        }
                    }
                });
            }
            break; // only look into last race
        }

        if (TiebreakerMode === TScoringLowPoint.TIE_RRS_DEFAULT)
            this.calculateTieBreakersDefault(races, entries, racepoints, seriespoints);
        else
            this.calculateTieBreakersAlternate(races, entries, racepoints, seriespoints);
    }

    /**
     * Resolve ties among a group of tied boats.  
     * A tie that is breakable should have .01 point increments added as appropriate.
     * Assume that each individual race and series points have calculated, 
     * and that throwouts have already been designated in the points objects.
     * @param races races involved
     * @param entriesIn list of tied entries
     * @param points list of points for all races and entries (and maybe more!)
     * @param series map containing series points for the entries, 
     * prior to handling ties (and maybe more than just those entries)    
     */
    calculateTieBreakersDefault(
        races: TRaceList,
        entriesIn: TEntryList,
        points: TRacePointsList,
        series: TSeriesPointsList): void {
        // EntryList entries = (EntryList) entriesIn.Clone(); //problem
        const entries: TEntryList = entriesIn.CloneEntries();

        if (entries == null)
            return;

        // first create a lists of finishes for each of the tied boats.
        // elist is a list of RacePointLists.
        // each elist item is a sorted list of racepoints that are not throwouts
        // 1 elist item per tied entry, 
        const eLists: Array<TRacePointsList> = new Array<TRacePointsList>();
        entries.forEach((e: TEntry) => {
            const ePoints: TRacePointsList = points.findAllPointsForEntry(e);
            eLists.push(ePoints);
        });

        const tiedWithBest: Array<TRacePointsList> = new Array<TRacePointsList>();
        // pull out best of the bunch one at a time
        // after each scan, best is dropped with no more change
        // in points.  Each remaining gets .01 added to total.
        // continue til no more left to play
        while (eLists.length > 1) {
            let bestPoints: TRacePointsList = eLists[0];
            tiedWithBest.length = 0;

            // loop thru entries, apply tiebreaker method
            // keep the best (winner)
            for (let i = 1; i < eLists.length; i++) {
                const leftPoints: TRacePointsList = eLists[i];

                // compares for ties by A8.1
                const c: number = this.comparePointsBestToWorst(leftPoints, bestPoints);
                if (c < 0) {
                    bestPoints = leftPoints; // remember the best
                    tiedWithBest.length = 0; // start new group
                }
                else if (c === 0) {
                    tiedWithBest.push(leftPoints); // tie found
                }
            }
            if (tiedWithBest.length > 0) {
                // have boats tied after applying A8.1 - so send them into
                // next tiebreakers clauses
                tiedWithBest.push(bestPoints);
                this.compareWhoBeatWhoLast(tiedWithBest, series);
            }
            const inc: number = (tiedWithBest.length + 1) * TScoringLowPoint.TIEBREAK_INCREMENT;
            
            /*eLists.Remove(bestPoints);*/
            const j = eLists.indexOf(bestPoints);
            if (j > -1)
                eLists.splice(j, 1);    
    

            // eLists.removeAll(tiedWithBest); //bestPoint may be part of it, but not always
            tiedWithBest.forEach((o: TRacePointsList) => {
                const i = eLists.indexOf(o);
                if (i > -1) {
                    // eLists.RemoveAt(i);
                    eLists.splice(i, 1);                        
                }
            });

            this.incrementSeriesScores(eLists, inc, series); // prepare for next iteration
        }
        // we be done
    }

    calculateTieBreakersAlternate(
        races: TRaceList,
        entries: TEntryList,
        racepoints: TRacePointsList,
        seriespoints: TSeriesPointsList): void {
        if (entries == null) return;

        const rpLists: Array<TRacePointsList> = new Array<TRacePointsList>();
        entries.forEach((e: TEntry) => {
            const ePoints: TRacePointsList = racepoints.findAllPointsForEntry(e);
            rpLists.push(ePoints);
        });
        this.compareWhoBeatWhoLast(rpLists, seriespoints);
    }

    private prepBestToWorst(rpList: TRacePointsList): TRacePointsList {
        // RacePointsList ePoints = (RacePointsList) rpList.Clone();
        const ePoints: TRacePointsList = rpList.CloneEntries();

        // delete throwouts from the list
        for (let i = ePoints.length - 1; i >= 0; i--) {
            const p: TRacePoints = ePoints[i];
            if (p != null)
                if (p.IsThrowout)
                    ePoints.Remove(p);
        }
        ePoints.sortPoints();
        return ePoints;
    }

    /**
     * Compares two sets of race points for tie breaker resolution.
     * RRS2001 A8.1: "If there is a series score tie between two or more boats,
     * each boat’s race scores shall be listed in order of best to worst,
     * and at the first point(s) where there is a difference the tie 
     * shall be broken in favour of the boat(s) with the best score(s).
     * No excluded scores shall be used."
     * @param races races involved
     * @param inLeft racepointslist of lefty
     * @param inRight racepointslist of righty
     * @returns -1 if "lefty" wins tiebreaker, 1 if righty wins, 0 if tied.
     */
    protected comparePointsBestToWorst(
        inLeft: TRacePointsList, inRight: TRacePointsList): number {
        const left: TRacePointsList = this.prepBestToWorst(inLeft);
        const right: TRacePointsList = this.prepBestToWorst(inRight);

        let lp = 0;
        let rp = 0;

        // we know they are sorted by finish points, look for first non-equal finish
        for (let i = 0; i < left.length; i++) {
            lp = (left[i]).Points;
            rp = (right[i]).Points;
            if (lp < rp)
                return - 1;
            else if (rp < lp)
                return 1;
        }
        return 0;
    }

    /**
    applying the remaining tiebreakers of RRS2001 A8 to set of boats tied after
    comparing their list of scores.  This is the new 2002+ formula after ISAF
    deleted 8.2 and renumbered 8.3 to 8.2
    
    RRS2001 modified A8.2 (old 8.3): "If a tie still remains between two or more 
    boats, they shall be ranked in order of their scores in the last race. 
    Any remaining ties shall be broken by using the tied boats’ scores in the 
    next-to-last race and so on until all ties are broken. 
    These scores shall be used even if some of them are excluded scores."</p>
    
    @param stillTied list of boat scores of the group for which A8.1 does not resolve the tie
    
    @param series list of series scores
    */
    protected compareWhoBeatWhoLast(
        stillTied: Array<TRacePointsList>, series: TSeriesPointsList): void {
        const nRaces: number = (stillTied[0] as TRacePointsList).length;
        const nTied: number = stillTied.length;
        const tiedEntries: TEntryList = new TEntryList();
        const beatenCount: Array<number> = new Array<number>(nTied);
        stillTied.forEach((list: TRacePointsList) => {
            if (list.length > 0) {
                list.sortRace();
                tiedEntries.push((list[0]).Entry);
            }
        });

        let gotoFlag = false;
        // now look to see if anyone is STILL tied, applying A8.3 now
        // now have beatenCount, can increment an entries score TIEBREAK_INCREMENT for each
        // boat in the list with a higher beaten count
        for (let e = 0; e < nTied; e++) {
            // this is otherLoop: 
            for (let o = 0; o < nTied; o++) {
                if ((e !== o) && (beatenCount[e] === beatenCount[o])) {
                    //
                    for (let r = nRaces - 1; r >= 0; r--) {
                        const ePts = stillTied[e][r].Points;
                        const oPts = stillTied[o][r].Points;
                        if (ePts > oPts)
                            this.incrementSeriesScore(tiedEntries[e], TScoringLowPoint.TIEBREAK_INCREMENT, series);
                        if (ePts !== oPts) {
                            // goto otherLoop;
                            gotoFlag = true;
                            break;
                        }
                    }
                }
                if (gotoFlag)
                    break;
            }
            // otherLoop: ; 
            gotoFlag = false;
        }
    }

    protected incrementSeriesScore(
        e: TEntry, amount: number, series: TSeriesPointsList): void {
        // find all series points for e, should be exactly 1
        const eSeries: TSeriesPoints = series.findAllPoints(e)[0];
        // add TIEBREAK_INCREMENT to its score
        eSeries.Points = eSeries.Points + amount;
    }

    protected incrementSeriesScores(
        eLists: Array<TRacePointsList>, amount: number, series: TSeriesPointsList): void {
        // add TIEBREAK_INCREMENT to series points of remaining tied boats
        for (let i = 0; i < eLists.length; i++) {
            const pl: TRacePointsList = eLists[i];
            if (pl.length === 0) {
                console.log("ScoringMessageInvalidSeries");
            }
            else {
                // pull entry from 1st element of the (i'th) eList
                this.incrementSeriesScore(pl[0].Entry, amount, series);
            }
        }
    }

    /**
     * Sorts a points list as on points ascending.
     * @param series pointslist to be sorted
     */
    sortSeries(series: TSeriesPointsList): void {
        series.sortPoints();
    }

    /**
     * Given a penalty, returns the number of points to be assigned (or added)
     * @param p penalty to be calculated, should never be null
     * @param rpList racepointslist for whole race
     * @param basePts starting points level in case penalty is based on non-penalty points
     * @returns points to be assigned for the penalty
     */
    getPenaltyPoints(
        p: TRSPenalty, rpList: TRacePointsList, basePts: number): number {
        let nEntries = 0;
        if (rpList != null) {
            nEntries = rpList.length;
        }

        if (this.HasFleets && this.TargetFleetSize > nEntries && (!this.IsFinalRace))
            nEntries = this.TargetFleetSize;

        // if STP, MAN, RDG, or DIP: return fixed points and be gone
        if (p.hasPenalty(Constants.STP) || p.hasPenalty(Constants.MAN) || p.hasPenalty(Constants.RDG) || p.hasPenalty(Constants.DPI)) {
            return p.Points;
        }

        /**
         * A9 RACE SCORES IN A SERIES LONGER THAN A REGATTA
         * For a series that is held over a period of time longer than a regatta, a boat that
         * came to the starting area but did not start (DNS), did not finish (DNF), retired after finishing (RAF)
         * or was disqualified (allDSQ) shall be scored points for the finishing place one more than
         * the number of boats that came to the starting area. A boat that did not come to
         * the starting area (DNC) shall be scored points for the finishing place one more than the
         * number of boats entered in the series.
         * 
         * if a DSQ penalty, return DSQ points a be gone (DSQ, DNE, OCS, BFD, UFD, RAF)
         */
        if (p.isDsqPenalty()) {
            if (rpList == null)
                return 0;
            return this.IsLongSeries ? (nEntries - rpList.getNumberWithPenalty(Constants.DNC) + 1) : (nEntries + 1);
        }

        // did come to the starting area but did not start
        if (p.hasPenalty(Constants.DNC))
            return nEntries + 1;

        // any non-finish penalty other than TLE, return entries + 1 and be gone
        // dnf, dns, (dnc already dealt with)
        if (p.isFinishPenalty() && !p.hasPenalty(Constants.TLE)) {
            if (rpList == null)
                return 0;
            return this.IsLongSeries ? (nEntries - rpList.getNumberWithPenalty(Constants.DNC) + 1) : (nEntries + 1);
        }

        // time limit expired
        if (p.hasPenalty(Constants.TLE)) {
            const nFinishers = (rpList == null) ? 0 : rpList.NumberFinishers;
            // set the basepts to the appropriate TLE points
            switch (this.TimeLimitPenalty) {
                case TScoringLowPoint.TLE_DNF:
                    basePts = this.getPenaltyPoints(new TRSPenalty(Constants.DNF), rpList, basePts);
                    break;

                case TScoringLowPoint.TLE_FINISHERSPLUS1:
                    basePts = nFinishers + 1;
                    break;

                case TScoringLowPoint.TLE_FINISHERSPLUS2:
                    basePts = nFinishers + 2;
                    break;

                case TScoringLowPoint.TLE_AVERAGE:
                    basePts = nFinishers + ((nEntries - nFinishers) / 2.0);
                    break;

                default:
                    basePts = this.getPenaltyPoints(new TRSPenalty(Constants.DNF), rpList, basePts);
                    break;
            }
        }

        // ADD in other penalties
        const dsqPoints = this.getPenaltyPoints(new TRSPenalty(Constants.DSQ), rpList, basePts);
        if (p.hasPenalty(Constants.CNF)) {
            basePts = Math.round(this.calcPercent(this.CheckinPercent, basePts, nEntries, dsqPoints));
        }
        if (p.hasPenalty(Constants.ZFP)) {
            basePts = Math.round(this.calcPercent(20, basePts, nEntries, dsqPoints));
        }
        if (p.hasPenalty(Constants.SCP))
            basePts = Math.round(this.calcPercent(p.Percent, basePts, nEntries, dsqPoints));

        return basePts;
    }

    /**
    returns percent of number of entries, to nearest 10th, .5 going up
    with a maximum points of those for DNC
    
    @param pct the percent to be assigned
    @param basePts initial number of points
    @param nEntries number of entries in race
    @param maxPoints max points to be awarded
    @returns new points value
    */
    protected calcPercent(
        pct: number, // Integer
        basePts: number,
        nEntries: number,
        maxPoints: number): number {
        // this gives points * 10
        let points = Math.round(nEntries * (pct / 10.0));
        points = points / 10.0;
        return Math.min(basePts + points, maxPoints);
    }

    setFixedNumberOfThrowouts(value: number): void {
        this.FixedNumberOfThrowouts = value;
    }

    /**
     * returns number of throwsout to be calculated in a race
     * @param pointsList racepointslist to be looked into
     * @returns number of throwouts for races
     */
    protected getNumberThrowouts(pointsList: TRacePointsList): number {
        const nRaces = pointsList.length;
        if (this.FixedNumberOfThrowouts < nRaces)
            return this.FixedNumberOfThrowouts;
        else
            return nRaces - 1;
    }

    /**
     * Calculates throwouts...; its also the responsibility of the ScoringSystem to manage the setting of throwout criteria.
     * Assumes that prior throwout flags have been cleared prior to calling this method
     * 
     * NOTE: if a boat has more that one race that is equal to their worse race;
     * this will select their earliest "worst races" as their throwout;
     * THIS CAN, IN RARE CASES, under 97 to 2000 rules, be a problem;
     * But situation is clear in 2001-2004 rule
     * @param pointsList list of race points on which to calc throwouts
     */
    calcThrowouts(pointsList: TRacePointsList): void {
        // look through the fThrowouts array and determine how many throwouts to award
        const nThrows = this.getNumberThrowouts(pointsList);

        for (let i = 0; i < nThrows; i++) {
            let worstRace: TRacePoints = null;
            pointsList.forEach((thisRace: TRacePoints) => {
                const b = thisRace.Finish.Fleet === 0 && thisRace.Race.IsFinalRace;

                // if (b) continue; //do not discard medal race scores

                if (!b) {

                    if (!thisRace.Finish.Penalty.hasPenalty(Constants.DNE)
                        && !thisRace.Finish.Penalty.hasPenalty(Constants.DGM)
                        && !thisRace.Finish.Penalty.hasPenalty(Constants.AVG)) {
                        if (!thisRace.IsThrowout
                            && ((worstRace == null)
                                || (thisRace.Points > worstRace.Points))) {
                            worstRace = thisRace;
                        }
                    }
                }
            });
            if (worstRace != null) {
                worstRace.IsThrowout = true;
            }
        }
    }

}
