import { TCalcEventProxy } from "./calc-event-proxy";
import { TEventProps } from "../fr/fr-event-props";
import { TFRProxy, TEntryInfo, TRaceInfo, TJSEventProps } from "../scoring/scoring-proxy";
import { TEventRowCollectionItem, TEventRowCollection, TEventNode } from "../col/event/event-row-collection";
import { TEventRaceEntry } from "../col/event/event-race-entry";
import { TProxyLoader } from "../scoring/scoring-proxy-loader";
import { TUtils } from "../util/fb-classes";
import { TBO } from "../fr/fr-bo";

/**proxy for using internal scoring code via TFRProxy and TProxyLoader*/
export class TCalcEventProxy11 extends TCalcEventProxy {
    protected eventNode: TEventNode;

    /**shortcut to eventNode.BO.Props*/
    protected EventProps: TEventProps;
    protected proxyNode: TFRProxy;

    constructor(public BO: TBO) {
        super();
    }

    Calc(aqn: TEventNode): void {
        this.eventNode = aqn;
        this.EventProps = this.BO.EventProps;

        if (this.eventNode.Collection.Count === 0)
            return;

        this.proxyNode = new TFRProxy();
        this.LoadProxy();
        this.ScoreRegatta(this.proxyNode);
        // if (this.WithTest) {
        // 	this.WithTest = false;
        // 	this.CheckResult(this.proxyNode);
        // }
        this.UnLoadProxy();
        this.proxyNode = null;
    }

    protected LoadProxy(): void {
        if (this.eventNode == null)
            return;

        this.EventName = this.BO.EventProps.EventName;

        const ep: TJSEventProps = this.proxyNode.EventProps;
        ep.ScoringSystem = TUtils.EnumInt(this.EventProps.ScoringSystem);
        ep.ThrowoutScheme = TUtils.EnumInt(this.EventProps.ThrowoutScheme);
        ep.Throwouts = this.EventProps.Throwouts;
        ep.FirstIs75 = this.EventProps.FirstIs75;
        ep.ReorderRAF = this.EventProps.ReorderRAF;

        ep.DivisionName = this.EventProps.DivisionName;

        this.proxyNode.RCount = this.eventNode.RCount; // SetLength(p.IsRacing, qn.RCount); // RCount = RaceCount+1
        for (let r1 = 1; r1 < this.eventNode.RCount; r1++) {
            if (this.BO.GetIsRacing(r1))
                this.proxyNode.IsRacing[r1] = true;
            else
                this.proxyNode.IsRacing[r1] = false;

            this.proxyNode.UseFleets = this.eventNode.UseFleets;
            this.proxyNode.TargetFleetSize = this.eventNode.TargetFleetSize;
            this.proxyNode.FirstFinalRace = this.eventNode.FirstFinalRace;
        }
        const cl: TEventRowCollection = this.eventNode.Collection;
        this.proxyNode.EntryInfoCollection.Clear();
        for (let i = 0; i < cl.Count; i++) {
            const cr: TEventRowCollectionItem = cl.Items[i];
            const ei: TEntryInfo = this.proxyNode.EntryInfoCollection.Add();
            //any unique whole number key field will be good to use as key for TEntryInfo (ei.SNR)
            ei.SNR = cr.BaseID; //cr.SNR; cr.Bib;
            ei.RaceList.length = 0;
            for (let r = 0; r < cr.RCount; r++) {
                const ri: TRaceInfo = new TRaceInfo();
                ei.RaceList.push(ri);
                if (r === 0)
                    continue;

                const er: TEventRaceEntry = cr.Race[r];
                ri.OTime = er.OTime;
                ri.QU = er.QU;
                ri.Penalty_Points = er.Penalty.Points;
                ri.Penalty_Percent = er.Penalty.Percent;
                // #if Sailtime
                ri.Penalty_Note = er.Penalty.Note;
                ri.Penalty_TimePenalty = er.Penalty.TimePenalty;
                // #endif
                ri.Fleet = er.Fleet;
                ri.IsRacing = er.IsRacing;
            }
        }
    }

    private ScoreRegatta(p: TFRProxy): void {
        const se: TProxyLoader = new TProxyLoader();
        se.Calc(p);
    }

    protected UnLoadProxy(): void {
        if (this.eventNode == null) return;

        try {
            const cl: TEventRowCollection = this.eventNode.Collection;
            let cr: TEventRowCollectionItem;
            let ei: TEntryInfo;

            let ri: TRaceInfo;
            let er: TEventRaceEntry;

            for (let i = 0; i < cl.Count; i++) {
                cr = cl.Items[i];
                ei = this.proxyNode.EntryInfoCollection.EntryList[i];

                cr.isTied = ei.IsTied;
                cr.isGezeitet = ei.IsGezeitet;
                cr.Race[0].CPoints = ei.RaceList[0].CPoints;
                cr.Race[0].Rank = ei.RaceList[0].Rank;
                cr.Race[0].PosR = ei.RaceList[0].PosR;
                cr.Race[0].PLZ = ei.RaceList[0].PLZ;

                for (let r = 0; r < cr.RCount; r++) {
                    ri = ei.RaceList[r];
                    er = cr.Race[r];
                    er.CPoints = ri.CPoints;
                    er.Drop = ri.Drop;
                    er.Rank = ri.Rank;
                    er.PosR = ri.PosR;
                    er.PLZ = ri.PLZ;
                    er.Sanitize();
                }
            }
            this.BO.Gezeitet = this.proxyNode.Gezeitet;
        }
        catch
        {
        }
    }

    private CheckAnyRace(): boolean {
        // precondition
        if (this.eventNode == null)
            return false;
        if (this.eventNode.Collection.Count === 0)
            return false;

        // count of sailed races
        let IsRacingCount = 0;
        for (let r = 1; r <= this.eventNode.RaceCount; r++)
            if (this.BO.GetIsRacing(r))
                IsRacingCount++;

        if (IsRacingCount < 1)
            return false;

        return true;
    }

    public ClearAllWithoutCalc(): void {
        try {
            const cl: TEventRowCollection = this.eventNode.Collection;
            let posr = 0;
            cl.Items.forEach((cr: TEventRowCollectionItem) => {
                cr.isTied = true;
                cr.Race[0].CPoints = 0;
                cr.Race[0].Rank = 0;
                cr.Race[0].PosR = posr++;
                cr.Race[0].PLZ = cr.IndexOfRow;

                // loop thru races
                for (let i = 0; i < this.eventNode.RaceCount; i++) {
                    cr.Race[i + 1].CPoints = 0;
                    cr.Race[i + 1].Drop = false;
                }
            });
        }
        catch
        {
        }
    }

}

