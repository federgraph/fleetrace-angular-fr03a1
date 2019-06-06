import { TimeConst } from './time';
import { StatusConst } from './status';

export class TQProxy {
    HighestBibGoesFirst: boolean;

    // in
    Bib: number[] = new Array<number>(1);
    DSQGate: number[] = new Array<number>(1);
    Status: number[] = new Array<number>(1);
    OTime: number[] = new Array<number>(1);

    // out
    ORank: number[] = new Array<number>(1);
    Rank: number[] = new Array<number>(1);
    PosR: number[] = new Array<number>(1);
    PLZ: number[] = new Array<number>(1);

    /** behind best at TimePoint */
    TimeBehind: number[] = new Array<number>(1);

    /** behind previous best at TimePoint */
    TimeBehindPreviousLeader: number[] = new Array<number>(1);

    /** behind previous best at Finish */
    TimeBehindLeader: number[] = new Array<number>(1);

    BestIndex: number;
    BestOTime: number;

    Calc(): void {
    }

    IsOut(Value: number): boolean {
        return ((Value === StatusConst.StatusDSQ)
            || (Value === StatusConst.StatusDNF)
            || (Value === StatusConst.StatusDNS));
    }

    IsOK(Value: number): boolean {
        return ((Value === StatusConst.StatusOK)
            || (Value === StatusConst.StatusDSQPending));
    }

    get Count(): number {
        return this.Rank.length;
    }
    set Count(value: number) {
        if ((value !== this.Rank.length + 1) && (value >= 0)) {
            this.Bib = new Array<number>(value);
            this.DSQGate = new Array<number>(value);
            this.Status = new Array<number>(value);
            this.OTime = new Array<number>(value);
            this.ORank = new Array<number>(value);
            this.Rank = new Array<number>(value);
            this.PosR = new Array<number>(value);
            this.PLZ = new Array<number>(value);
            this.TimeBehind = new Array<number>(value);
            this.TimeBehindPreviousLeader = new Array<number>(value);
            this.TimeBehindLeader = new Array<number>(value);
        }

    }
}

export class TQProxy1 extends TQProxy {

    private Calc_ORank(): void {
        for (let j1 = 0; j1 < this.Count; j1++) {
            this.ORank[j1] = 1;
        }
        for (let j2 = 0; j2 < this.Count; j2++) {
            const t2: number = this.OTime[j2];
            if (t2 <= 0) {
                this.ORank[j2] = 0;
            } else {
                for (let l = j2 + 1; l < this.Count; l++) {
                    const t1: number = this.OTime[l];
                    if (t1 > 0) {
                        if (t1 < t2) {
                            this.ORank[j2] = this.ORank[j2] + 1;
                        }
                        if (t1 > t2) {
                            this.ORank[l] = this.ORank[l] + 1;
                        }
                    }
                }
            }
        }
    }

    private Calc_BestIdx(): void {
        this.BestIndex = 0;
        this.BestOTime = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < this.Count; i++) {
            const t: number = this.OTime[i];
            if ((t > 0) && (t < this.BestOTime) && this.IsOK(this.Status[i])) {
                this.BestIndex = i;
                this.BestOTime = this.OTime[i];
            }
        }
    }

    private Calc_TimeBehind(): void {
        if (this.BestOTime === TimeConst.TimeNull) {
            for (let i1 = 0; i1 < this.Count; i1++) {
                this.TimeBehind[i1] = TimeConst.TimeNull;
            }
        } else {
            for (let i2 = 0; i2 < this.Count; i2++) {
                if (this.OTime[i2] > 0) {
                    this.TimeBehind[i2] = this.OTime[i2] - this.BestOTime;
                } else {
                    this.TimeBehind[i2] = TimeConst.TimeNull;
                }
            }
        }
    }

    private EncodeDSQGateAndStatus(): void {
        for (let i = 0; i < this.Count; i++) {
            let temp: number = this.OTime[i];
            if (this.Status[i] === StatusConst.StatusDNF) {
                temp = Number.MAX_SAFE_INTEGER - 300;
            } else if (this.Status[i] === StatusConst.StatusDSQ) {
                temp = Number.MAX_SAFE_INTEGER - 200;
            } else if (this.Status[i] === StatusConst.StatusDNS) {
                temp = Number.MAX_SAFE_INTEGER - 100;
            }
            temp = temp - this.DSQGate[i];
            this.OTime[i] = temp;
        }
    }
    private Calc_Rank_PosR_Encoded(): void {
        let t1: number; // Zeit1
        let t2: number; // Zeit2
        let BibMerker: number; // wegen 'Highest Bib goes first'

        // reset
        for (let j1 = 0; j1 < this.Count; j1++) {
            this.Rank[j1] = 1;
            this.PosR[j1] = 1;
            this.PLZ[j1] = -1;
        }

        // new calculation
        for (let j2 = 0; j2 < this.Count; j2++) {
            t2 = this.OTime[j2];
            BibMerker = this.Bib[j2];
            // TimePresent = False
            if (t2 <= 0) {
                this.Rank[j2] = 0;
                this.PosR[j2] = 0;
            } else {
                // TimePresent
                for (let l = j2 + 1; l < this.Count; l++) {
                    t1 = this.OTime[l];
                    if (t1 > 0) {
                        if (t1 < t2) {
                            // increment Rank and PosR for j
                            this.Rank[j2] = this.Rank[j2] + 1;
                            this.PosR[j2] = this.PosR[j2] + 1;
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
                                if (BibMerker > this.Bib[l]) {
                                    this.PosR[l] = this.PosR[l] + 1;
                                } else {
                                    this.PosR[j2] = this.PosR[j2] + 1;
                                }
                            } else {
                                if (BibMerker < this.Bib[l]) {
                                    this.PosR[l] = this.PosR[l] + 1;
                                } else {
                                    this.PosR[j2] = this.PosR[j2] + 1;
                                }
                            }
                        }
                    }
                }
                if (this.PosR[j2] > 0) {
                    const temp: number = this.PosR[j2];
                    this.PLZ[temp - 1] = j2;
                }
            }
        }
    }

    Calc(): void {
        this.Calc_ORank();
        this.Calc_BestIdx();
        this.Calc_TimeBehind();
        this.EncodeDSQGateAndStatus();
        this.Calc_Rank_PosR_Encoded();
    }
}

