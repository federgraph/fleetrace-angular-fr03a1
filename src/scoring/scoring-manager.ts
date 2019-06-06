import { IScoringModel } from './scoring-model';
import { TRacePointsList } from './scoring-race-points-list';
import { TSeriesPointsList } from './scoring-series-points-list';
import { TEntry } from './scoring-entry';
import { TSeriesPoints } from './scoring-series-points';
import { TScoringLowPoint } from './scoring-low-point';
import { TRace } from './scoring-race';
import { TRegatta } from './scoring-regatta';
import { TRaceList } from './scoring-race-list';
import { TEntryList } from './scoring-entry-list';
import { TRacePoints } from './scoring-race-points';
import { TFinish } from './scoring-finish';
import { Constants } from './scoring-penalty';
import { TScoringTiebreaker } from './scoring-tiebreaker';
import { TScoringBonusPoint } from './scoring-bonus-point';
import { TScoringBonusPointDSV } from './scoring-bonus-point-dsv';

/**
 * Parent holder of information about scoring the races in a regatta.
 * Provides all the covering information calculating race and series points for a set of entries (a division or fleet) in a set of races.
 *
 * One instance of this class will exist for every 'series' in a regatta.
 * For now there is only one class in a regatta, so all boats are in all race
 * asnd there will only be one ScoringManager instance.
 *
 * But when multi-classes and possibly overall fleet results come in,
 * then there ill be one of these for each scored class, and each scored fleet.
 */
export class TScoringManager {

    static testing = true;
    static sTraceStatus = false;

    fScoringModel: IScoringModel;

    /**
     * contains RacePoints objects, one for each entry in each race
     */
    protected fPointsList: TRacePointsList;

    /**
     * contains SeriesPoints, one for each entry in the regatta
     */
    protected fSeries: TSeriesPointsList;

    constructor() {
        this.fScoringModel = new TScoringLowPoint();
        this.fPointsList = new TRacePointsList();
        this.fSeries = new TSeriesPointsList();
    }

    /**
     * sets the active scoring model
     * @param value name of model to be added
     */
    set Model(value: number) {

        if (value !== this.fScoringModel.getID()) {
            let newModel: IScoringModel;
            if (value === 1) { // 'Bonus Point'
                newModel = new TScoringBonusPoint();
            } else if (value === 2) { // 'Bonus Point DSV'
                newModel = new TScoringBonusPointDSV();
            } else { // if (value === 0)
                newModel = new TScoringLowPoint();
            }

            if (this.fScoringModel && newModel) {
                newModel.setAttributes(this.fScoringModel);
            }
            this.fScoringModel = newModel;
        }
    }

    /**
     * returns the active scoring model
     * @returns current ScoringModel
     */
    getModel(): IScoringModel {
        return this.fScoringModel;
    }

    /**
     * returns list of all racepoints
     * @returns RacePointsList
     */
    get RacePointsList(): TRacePointsList {
        return this.fPointsList;
    }

    /**
     * returns list of all seriespoints
     * @returns SeriesPointsList
     */
    get SeriesPointsList(): TSeriesPointsList {
        return this.fSeries;
    }

    /**
     * returns the list of series points for an entry
     * @param entry entry whose points are wanted
     * @param div Division
     * @returns list of seriespoints
     */
    getSeriesPoints(entry: TEntry): TSeriesPoints {
        return this.fSeries.findPoints(entry);
    }

    /**
     * Calculates a racepoints array for specified race.
     * NOTE that this instance is automatically scored in the hashmap.
     * @param race race to be scored
     * @param points points list in which race's points are stored
     */
    scoreRace(race: TRace, points: TRacePointsList): void {
        this.ScoreRace(race, points, false);
    }

    /**
     * Calculates a racepoints array for specified race;
     * NOTE that this instance is automatically scored in the hashmap.
     * Does nothing if the scoring system is not defined.
     * @param race race to be scored
     * @param points points list in which race's points are stored
     * @param positionOnly if position only or not
     * @exception ScoringException throws ScoringException if problem occurs
     */
    ScoreRace(race: TRace, points: TRacePointsList, positionOnly: boolean): void {
        if (this.fScoringModel == null || race == null) {
            return;
        }
        this.fScoringModel.scoreRace(race, points, positionOnly);
    }

    /**
     * calculates a racepoints array for the specified race
     * - note that this instance is automatically scored in the hashmap
     * - does nothing if the Scoring system is not defined
     * @param regatta Regatta to be scored
     * @param inRaces races to be included in the scoring
     * @exception ScoringException if a problem is encountered
     */
    scoreRegatta(regatta: TRegatta, inRaces: TRaceList): void {
        // acquireScoringLock();
        try {
            if (TScoringManager.sTraceStatus) {
                console.log('ScoringManager: scoring started...');
            }

            if (
                (!this.fScoringModel) ||
                (!regatta) ||
                inRaces.length === 0 ||
                regatta.Entries.length === 0) {
                if (TScoringManager.sTraceStatus) {
                    console.log('ScoringManager: (empty) done.');
                }
                return;
            }

            // inRaces.Sort(); //by starting time

            this.fPointsList.Clear();
            this.fSeries.Clear();

            this.scoreDivision(regatta);

            if (TScoringManager.sTraceStatus) {
                console.log('ScoringManager: scoring completed.');
            }
        } finally {
            // releaseScoringLock();
        }
    }

    private scoreDivision(regatta: TRegatta): void {
        if (TScoringManager.sTraceStatus) {
            console.log('ScoringManager: scoring races...');
        }

        const entries: TEntryList = regatta.Entries;

        // make up list of races (for this div)
        const divRaces: TRaceList = new TRaceList();
        regatta.Races.forEach( (r: TRace) => {
            if (r.IsRacing) {
                divRaces.push(r);
            }
        });
        // divRaces.Sort(); //by starting time

        const divPointsList: TRacePointsList = new TRacePointsList();

        // calc race points for each race (and each division in a race)
        divRaces.forEach((r: TRace) => {
            const racePoints: TRacePointsList = new TRacePointsList();
            entries.forEach((e: TEntry) => {
                racePoints.Add(new TRacePoints(r, e, Number.NaN, false));
            });
            this.scoreRace(r, racePoints);
            divPointsList.AddRange(racePoints);
        });

        // calc series points
        this.fPointsList.AddRange(divPointsList);
        this.scoreSeries(divRaces, entries, divPointsList);
    }

    private scoreSeries(divRaces: TRaceList, entries: TEntryList, divPointsList: TRacePointsList): void {
        let r: TRace;
        if (divRaces.length > 0) {
            r = divRaces[0];
            if (r.HasFleets && TRegatta.IsInFinalPhase) { // && r.Regatta.IsInFinalPhase
                this.scoreQualiFinalSeries(divRaces, entries, divPointsList);
            } else {
                this.scoreSeries1(divRaces, entries, divPointsList);
            }
        }
    }

    private scoreQualiFinalSeries(divRaces: TRaceList, entries: TEntryList, points: TRacePointsList): void {
        // find the number of fleets in the race
        let fc = 0;
        for (const rp of points) {
            if ((rp.Finish != null) && (rp.Finish.Fleet > fc)) {
                fc = rp.Finish.Fleet;
            }
        }

        let fr: TRace = null;
        if ((divRaces != null) && (divRaces.length > 0)) {
            fr = divRaces[divRaces.length - 1];
        }

        if (fr == null) {
            return;
        }

        if (!fr.IsFinalRace) {
            this.scoreSeries1(divRaces, entries, points);
        } else {
            const rpl: TRacePointsList = new TRacePointsList();
            const el: TEntryList = new TEntryList();

            let posOffset = 0;
            let e: TEntry;

            for (let j = 0; j <= fc; j++) {
                // get the entries for the fleet
                for (const f of fr.FinishList) {
                    e = f.Entry;
                    if (f.Fleet === j) {
                        el.Add(e);
                    }
                }

                // get the racepoints for the fleet
                for (const rp of points) {
                    if (rp.Finish != null) {
                        rpl.Add(rp);
                    }
                }
                if ((el.length > 0) && (rpl.length > 0)) {
                    this.scoreSeries2(divRaces, el, rpl, posOffset);
                    posOffset = posOffset + el.Count;
                }
                // clear the temp lists for the next run of the loop
                rpl.Clear();
                el.Clear();
            }
        }
    }

    private scoreSeries2(
        divRaces: TRaceList,
        entries: TEntryList,
        divPointsList: TRacePointsList,
        posOffset: number): void {
        // calc throwouts,
        entries.forEach((e: TEntry) => {
            this.fScoringModel.calcThrowouts(divPointsList.findAllPointsForEntry(e));
        });

        // run thru looking for average points
        this.calcAveragePoints(divPointsList);

        const divSeriesPoints: TSeriesPointsList = new TSeriesPointsList();
        divSeriesPoints.initPoints(entries);

        // no finishes go to next division
        if (divSeriesPoints.Count === 0) {
            return;
        }

        this.fScoringModel.scoreSeries(divRaces, entries, divPointsList, divSeriesPoints);

        // now run through looking for clumps of tied boats
        // pass the clumps of tied boats on to scoringmodel for resolution
        this.fScoringModel.sortSeries(divSeriesPoints);

        const doties: TScoringTiebreaker = new TScoringTiebreaker(this.fScoringModel, divRaces, divPointsList, divSeriesPoints);
        doties.process();

        // now set series position
        divSeriesPoints.sortPoints();
        let position = 1;
        let lastpoints = 0;
        let tied = false;
        for (let e = 0; e < divSeriesPoints.Count; e++) {
            const sp: TSeriesPoints = divSeriesPoints[e];
            const thispoints: number = sp.Points;
            const nextpoints: number = ((e + 1 < divSeriesPoints.Count) ? (divSeriesPoints[e + 1]).Points : 99999999.0);
            tied = !((thispoints !== lastpoints) && (thispoints !== nextpoints));
            if (!tied) {
                position = e + 1;
            } else {
                // position is same if tied with last
                if (thispoints !== lastpoints) {
                    position = e + 1;
                }
            }
            sp.Position = position + posOffset;
            sp.Tied = tied;
            lastpoints = thispoints;
        }

        this.fSeries.AddRange(divSeriesPoints);
    }

    private scoreSeries1(divRaces: TRaceList, entries: TEntryList, divPointsList: TRacePointsList): void {
        this.scoreSeries2(divRaces, entries, divPointsList, 0);
    }

    /**
     * Calculates average points as per RRS2001 A10 (a), throwouts included:
     *
     * Points equal to the average of her points in all the races in the series,
     * except the races in question,
     * to the nearest tenth of a point (0.05 to be rounded upward).
     *
     * All instances of AVG in all races in all divisions in the regatta will be scanned and AVG points calculated.
     */
    calcAveragePoints(divRacePoints: TRacePointsList): void {
        this.CalcAveragePoints(divRacePoints, true);
    }

    /**
     * Calculates average points as per RRS2001 A10(a)
     * except that including the throwout (or not) is an optional.
     *
     * @param regatta regatta to be scored.
     * All instances of AVG in all races (in all divisions in the regatta)
     * will be scanned and AVG points calculated.
     * @param throwoutIsIncluded true if throwouts are to be included in calculation
     */
    CalcAveragePoints(
        divRacePoints: TRacePointsList,
        throwoutIsIncluded: boolean): void {
        if (TScoringManager.sTraceStatus) {
            console.log('ScoringManager: calculating average points...');
        }

        const eWithAvg: TEntryList = new TEntryList();
        for (let i = 0; i < divRacePoints.Count; i++) {
            const rp: TRacePoints = divRacePoints[i];
            if (rp.Finish.hasPenaltyN(Constants.AVG)) {
                const e: TEntry = rp.Entry;
                if (!eWithAvg.Contains(e)) {
                    eWithAvg.Add(e);
                }
            }
        }

        eWithAvg.forEach((e: TEntry) => {
            const list: TRacePointsList = divRacePoints.findAllPointsForEntry(e);
            let pts = 0;
            let n = 0;
            let hasAvg = false;

            const tempPts: Array<number> = new Array<number>(list.Count);
            const tempPen: Array<number> = new Array<number>(list.Count);
            let t = 0;

            list.forEach((p: TRacePoints) => {
                const finish: TFinish = p.Race.getFinish(p.Entry);

                tempPts[t] = p.Points;
                tempPen[t++] = finish.Penalty.Penalty;

                if ((!p.IsThrowout || throwoutIsIncluded) && finish != null && !finish.Penalty.hasPenalty(Constants.AVG)) {
                    pts = pts + p.Points;
                    n++;
                } else if (finish != null && finish.Penalty.hasPenalty(Constants.AVG)) {
                    hasAvg = true;
                }
            });

            if (hasAvg) {
                let avg = pts / n;
                avg = Math.round(avg * 10);
                avg = avg / 10.0;
                list.forEach((p: TRacePoints) => {
                    const finish: TFinish = p.Race.getFinish(p.Entry);
                    if (finish != null && finish.Penalty.hasPenalty(Constants.AVG)) {
                        p.Points = avg;
                    }
                });
            }
            // loop setting average points
        });
        // loop thru entries
    }
}
