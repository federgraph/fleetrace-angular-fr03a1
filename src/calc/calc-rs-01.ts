import { StatusConst } from "./status";
import { TEventRowCollectionItem, TEventRowCollection, TEventNode } from "../col/event/event-row-collection";
import { TimeConst } from "./time";
import { TCalcEventProxy } from "./calc-event-proxy";

export class TCalcEventProxy01 extends TCalcEventProxy {
    // in
    private Bib: number[] = new Array<number>(1);
    private DSQGate: number[] = new Array<number>(1);
    private Status: number[] = new Array<number>(1);
    private OTime: number[] = new Array<number>(1);

    // out
    private Rank: number[] = new Array<number>(1);
    private PosR: number[] = new Array<number>(1);
    private PLZ: number[] = new Array<number>(1);
    private BTime: number[] = new Array<number>(1); // behind best at TimePoint

    private BestIndex: number = 0;
    private BestOTime: number = 0;

    protected Calc1(): void {
        // this.Calc_BestIdx();
        // this.Calc_BTime();
        this.EncodeDSQGateAndStatus();
        this.Calc_Rank_PosR_Encoded();
    }

    protected Calc_BestIdx(): void {
        this.BestIndex = 0;
        this.BestOTime = Number.MAX_SAFE_INTEGER; // MaxInt;
        for (let i = 0; i < this.Count; i++) {
            const t: number = this.OTime[i];
            if ((t > 0) && (t < this.BestOTime) && this.IsOK(this.Status[i])) {
                this.BestIndex = i;
                this.BestOTime = this.OTime[i];
            }
        }
    }

    protected Calc_BTime(): void {
        if (this.BestOTime === TimeConst.TimeNull) {
            for (let i = 0; i < this.Count; i++)
                this.BTime[i] = TimeConst.TimeNull;
        }
        else {
            for (let j = 0; j < this.Count; j++) {
                if (this.OTime[j] > 0)
                    this.BTime[j] = this.OTime[j] - this.BestOTime;
                else
                    this.BTime[j] = TimeConst.TimeNull;
            }
        }
    }

    protected EncodeDSQGateAndStatus(): void {
        for (let i = 0; i < this.Count; i++) {
            let temp: number = this.OTime[i];
            if (this.Status[i] === StatusConst.Status_DNF)
                temp = Number.MAX_SAFE_INTEGER - 300;
            else if (this.Status[i] === StatusConst.Status_DSQ)
                temp = Number.MAX_SAFE_INTEGER - 200;
            else if (this.Status[i] === StatusConst.Status_DNS)
                temp = Number.MAX_SAFE_INTEGER - 100;
            // temp = temp - DSQGate[i];
            this.OTime[i] = temp;
        }
    }

    protected Calc_Rank_PosR_Encoded(): void {
        let t1: number; // Zeit 1
        let t2: number; // Zeit 2
        let BibMerker: number; // wegen 'Highest Bib goes first'
        let temp: number;

        // reset
        for (let j1 = 0; j1 < this.Count; j1++) {
            this.Rank[j1] = 1;
            this.PosR[j1] = 1;
            this.PLZ[j1] = -1;
        }

        // new calculation
        for (let j = 0; j < this.Count; j++) {
            t2 = this.OTime[j];
            BibMerker = this.Bib[j];
            // TimePresent = False
            if (t2 <= 0) {
                this.Rank[j] = 0;
                this.PosR[j] = 0;
            }
            // TimePresent
            else {
                for (let l = j + 1; l < this.Count; l++) {
                    t1 = this.OTime[l];
                    if (t1 > 0) {
                        if (t1 < t2) {
                            // increment Rank and PosR for j
                            this.Rank[j] = this.Rank[j] + 1;
                            this.PosR[j] = this.PosR[j] + 1;
                        }

                        if (t1 > t2) {
                            // increment Rank and PosR for l
                            this.Rank[l] = this.Rank[l] + 1;
                            this.PosR[l] = this.PosR[l] + 1;
                        }

                        if (t1 === t2) {
                            // do not increment Rank if Times are equal
                            // increment PosR for one of the riders, j or l
                            if (this.HighestBibGoesFirst) {
                                if (BibMerker > this.Bib[l])
                                    this.PosR[l] = this.PosR[l] + 1;
                                else
                                    this.PosR[j] = this.PosR[j] + 1;
                            }
                            else {
                                if (BibMerker < this.Bib[l])
                                    this.PosR[l] = this.PosR[l] + 1;
                                else
                                    this.PosR[j] = this.PosR[j] + 1;
                            }
                        }
                    }
                }
                if (this.PosR[j] > 0) {
                    temp = this.PosR[j];
                    this.PLZ[temp - 1] = j;
                }
            }
        }
    }

    protected IsOut(Value: number): boolean {
        return ((Value === StatusConst.Status_DSQ)
            || (Value === StatusConst.Status_DNF)
            || (Value === StatusConst.Status_DNS));
    }

    protected IsOK(Value: number): boolean {
        return ((Value === StatusConst.Status_OK)
            || (Value === StatusConst.Status_DSQPending));
    }

    Calc(qn: TEventNode): void {
        let RaceCount: number;
        //
        let cl: TEventRowCollection;
        let cr: TEventRowCollectionItem;
        let GPoints: number;

        if (qn.Collection.Count < 1)
            return;

        RaceCount = qn.Collection.Items[0].RCount;
        for (let i1 = 1; i1 < RaceCount; i1++) {
            this.LoadProxy(qn, i1);
            this.Calc1();
            this.UnLoadProxy(qn, i1);
        }

        // Points
        cl = qn.Collection;
        for (let i = 0; i < cl.Count; i++) {
            cr = cl.Items[i];
            GPoints = 0;
            for (let j = 1; j < cr.RCount; j++) {
                // RacePoints
                cr.Race[j].CTime1 = cr.Race[j].Rank;

                cr.Race[j].Drop = false;
                if (cr.Race[j].QU !== 0) {
                    cr.Race[j].CTime1 = 400;
                    cr.Race[j].Drop = true;
                }
                // EventPoints
                GPoints = GPoints + cr.Race[j].CTime1;
            }
            cr.GRace.CTime1 = GPoints;
        }

        this.LoadProxy(qn, 0); // channel_FT
        this.Calc1();
        this.UnLoadProxy(qn, 0); // channel_FT
    }

    LoadProxy(qn: TEventNode, channel: number): void {
        const cl: TEventRowCollection = qn.Collection;
        this.Count = cl.Count;
        for (let i = 0; i < cl.Count; i++) {
            const cr: TEventRowCollectionItem = cl.Items[i];
            this.Bib[i] = cr.Bib;
            this.DSQGate[i] = cr.Race[channel].DG;
            this.Status[i] = cr.Race[channel].QU;
            if (channel === 0) // channel_FT
                this.OTime[i] = cr.Race[channel].CTime1;
            else
                this.OTime[i] = cr.Race[channel].OTime;
        }
    }

    UnLoadProxy(qn: TEventNode, channel: number): void {
        const cl: TEventRowCollection = qn.Collection;
        if (this.Count !== cl.Count)
            return;
        for (let i = 0; i < cl.Count; i++) {
            const cr: TEventRowCollectionItem = cl.Items[i];
            // cr.Race[channel].BTime = BTime[i];
            // cr.ru.BestTime[channel] = BestOTime;
            // cr.ru.BestIndex[channel] = BestIndex;
            cr.Race[channel].Rank = this.Rank[i];
            cr.Race[channel].PosR = this.PosR[i];
            cr.Race[channel].PLZ = this.PLZ[i];
        }
    }
    get Count(): number {
        return this.Rank.length;
    }
    set Count(value: number) {
        if ((value !== this.Rank.length) && (value >= 0)) {
            this.Bib = new Array<number>(value);
            this.DSQGate = new Array<number>(value);
            this.Status = new Array<number>(value);
            this.OTime = new Array<number>(value);
            this.BTime = new Array<number>(value);
            this.Rank = new Array<number>(value);
            this.PosR = new Array<number>(value);
            this.PLZ = new Array<number>(value);
        }
    }

}


