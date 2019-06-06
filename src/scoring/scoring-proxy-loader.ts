import { TFRProxy, TJSEventProps, TEntryInfo, TRaceInfo, TEntryInfoCollection } from './scoring-proxy';
import { TRegatta } from './scoring-regatta';
import { TScoringLowPoint } from './scoring-low-point';
import { IScoringModel } from './scoring-model';
import { TEntry } from './scoring-entry';
import { TRace } from './scoring-race';
import { TFinish } from './scoring-finish';
import { TFinishPosition } from './scoring-finish-position';
import { TRSPenalty, Constants } from './scoring-penalty';
import { TSeriesPointsList } from './scoring-series-points-list';
import { TSeriesPoints } from './scoring-series-points';
import { TRacePoints } from './scoring-race-points';
import { TScoringManager } from './scoring-manager';

/**
 * Loads and unloads proxy data to and from a new regatta object.
 */
export class TProxyLoader {

    static readonly THROWOUT_NONE: number = 4;

    protected regatta: TRegatta; // temporary regatta object
    proxyNode: TFRProxy; // passed via parameter to calc

    /**
     * shortcut to proxyNode.EventProps
     */
    EventProps: TJSEventProps;

    Calc(proxy: TFRProxy): void {
        this.proxyNode = proxy;
        this.EventProps = this.proxyNode.EventProps;
        if (this.proxyNode.EntryInfoCollection.Count === 0) {
            return;
        }

        const ScoringManager = new TScoringManager();
        this.regatta = new TRegatta(ScoringManager);
        try {
            this.regatta.ScoringManager.Model = this.EventProps.ScoringSystem;
            this.InitThrowoutScheme();
            this.LoadProxy();
            this.regatta.ScoreRegatta();
            this.UnLoadProxy();
        } finally {
            this.regatta = null;
        }
    }

    private InitThrowoutScheme(): void {
        // precondition
        if (!this.regatta) {
            return;
        }
        if (!this.proxyNode) {
            return;
        }
        if (this.proxyNode.EntryInfoCollection.Count === 0) {
            return;
        }

        // count of sailed races
        let IsRacingCount = 0;
        for (let r = 1; r < this.proxyNode.RCount; r++) {
            if (this.proxyNode.IsRacing[r]) {
                IsRacingCount++;
            }
        }

        // number of throwouts
        let t = this.proxyNode.EventProps.Throwouts;
        if (t >= IsRacingCount) {
            t = IsRacingCount - 1;
        }

        const sm: TScoringLowPoint = new TScoringLowPoint();

        sm.setFixedNumberOfThrowouts(t);

        sm.FirstIs75 = this.EventProps.FirstIs75;
        sm.ReorderRAF = this.EventProps.ReorderRAF;

        this.regatta.ScoringManager.Model = this.EventProps.ScoringSystem;

        const m: IScoringModel = this.regatta.ScoringManager.getModel();
        m.setAttributes(sm);
    }

    private LoadProxy(): void {
        let e: TEntry;
        let r: TRace;
        let f: TFinish;
        let fp: TFinishPosition;
        let p: TRSPenalty;

        let cr: TEntryInfo;
        let er: TRaceInfo;

        if (this.regatta == null) {
            return;
        }
        if (this.proxyNode == null) {
            return;
        }

        if (this.proxyNode.RCount > this.proxyNode.FirstFinalRace) {
            TRegatta.IsInFinalPhase = true;
        }

        const cl: TEntryInfoCollection = this.proxyNode.EntryInfoCollection;
        for (let i = 0; i < cl.Count; i++) {
            cr = cl.EntryList[i];
            cr.IsGezeitet = false;
            e = new TEntry();
            e.SailID = cr.SNR;
            this.regatta.AddEntry(e);

            for (let j = 1; j < cr.RCount; j++) {
                if (i === 0) {
                    r = new TRace(j);
                    this.regatta.Races.Add(r);
                    r.IsRacing = this.proxyNode.IsRacing[j];
                    r.HasFleets = this.proxyNode.UseFleets;
                    r.TargetFleetSize = this.proxyNode.TargetFleetSize;
                    if (j >= this.proxyNode.FirstFinalRace) {
                        r.IsFinalRace = true;
                    }
                } else {
                    r = this.regatta.Races[j - 1] as TRace;
                }
                er = cr.RaceList[j];
                if (er.OTime === 0) {
                    fp = new TFinishPosition(Constants.DNC);
                } else {
                    fp = new TFinishPosition(er.OTime);
                }

                if (fp.isValidFinish()) {
                    cr.IsGezeitet = true;
                }

                if (er.QU === 0) {
                    p = null;
                } else {
                    p = new TRSPenalty(er.QU);
                    p.Points = er.PenaltyPoints;
                    p.Percent = er.PenaltyPercent;
                }
                f = new TFinish(r, e, fp, p);
                f.Fleet = er.Fleet;
                if (!er.IsRacing) {
                    f.IsRacing = er.IsRacing;
                }
                r.FinishList.Add(f);
            }
        }
        // count Gezeitet
        let a = 0;
        for (let ei = 0; ei < cl.Count; ei++) {
            if (cl.EntryList[ei].IsGezeitet) {
                a++;
            }
        }
        this.proxyNode.Gezeitet = a;
    }

    private UnLoadProxy(): void {
        let seriesPoints: TSeriesPointsList;
        let sp: TSeriesPoints;

        let race: TRace;
        let racepts: TRacePoints;

        let cr: TEntryInfo;
        let crPLZ: TEntryInfo;

        if (this.regatta == null) {
            return;
        }
        if (this.proxyNode == null) {
            return;
        }

        try {
            seriesPoints = this.regatta.ScoringManager.SeriesPointsList;
            this.regatta.ScoringManager.getModel().sortSeries(seriesPoints);

            const cl: TEntryInfoCollection = this.proxyNode.EntryInfoCollection;
            for (let e = 0; e < seriesPoints.length; e++) {
                sp = seriesPoints[e];
                cr = cl.FindKey(sp.Entry.SailID);
                if ((cr == null) || (sp == null)) {
                    continue;
                }

                cr.IsTied = sp.Tied;
                cr.RaceList[0].CPoints = sp.Points;
                cr.RaceList[0].Rank = sp.Position;
                cr.RaceList[0].PosR = e + 1;

                crPLZ = cl.EntryList[e];
                if (crPLZ != null) {
                    crPLZ.RaceList[0].PLZ = cr.Index;
                }

                // loop thru races display points for each race
                for (let i = 0; i < this.regatta.Races.Count; i++) {
                    race = this.regatta.Races[i];
                    racepts = this.regatta.ScoringManager.RacePointsList.findPoints(race, sp.Entry);
                    if (racepts != null) {
                        cr.RaceList[i + 1].CPoints = racepts.Points;
                        cr.RaceList[i + 1].Drop = racepts.IsThrowout;
                    } else if (!race.IsRacing) {
                        cr.RaceList[i + 1].CPoints = 0;
                        cr.RaceList[i + 1].Drop = false;
                    }
                }
            }
        } catch {
        }
    }
}
