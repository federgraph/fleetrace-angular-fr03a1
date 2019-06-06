import { TPTime, TQTime } from '../../calc/time';

export class TTimePoint {
    private FOTime: TPTime = new TPTime();
    private FBehind: TPTime = new TPTime();
    private FBFT: TQTime = new TQTime();
    private FBPL: TQTime = new TQTime();

    ORank = 0;
    Rank = 0;
    PosR = 0;
    PLZ = 0;

    Assign(source: object): void {
        if (source instanceof TTimePoint) {
            const o: TTimePoint = source as TTimePoint;
            this.OTime.Assign(o.OTime);
            this.Behind.Assign(o.Behind);
            this.BFT.Assign(o.BFT);
            this.BPL.Assign(o.BPL);
            this.ORank = o.ORank;
            this.Rank = o.Rank;
            this.PosR = o.PosR;
            this.PLZ = o.PLZ;
        } else if (source instanceof TTimePointEntry) {
            const e: TTimePointEntry = source as TTimePointEntry;
            this.OTime.Parse(e.OTime);
            this.Behind.Parse(e.Behind);
            this.BFT.Parse(e.BFT);
            this.BPL.Parse(e.BPL);
            this.ORank = e.ORank;
            this.Rank = e.Rank;
            this.PosR = e.PosR;
            this.PLZ = e.PLZ;
        }
    }

    Clear(): void {
        this.OTime.Clear();
        this.Behind.Clear();
        this.BFT.Clear();
        this.BPL.Clear();
        this.ORank = 0;
        this.Rank = 0;
        this.PosR = 0;
        this.PLZ = 0;
    }

    get OTime(): TPTime {
        return this.FOTime;
    }
    set OTime(value: TPTime) {
        if (value != null) {
            this.FOTime.Assign(value);
        }
    }

    get Behind(): TPTime {
        return this.FBehind;
    }
    set Behind(value: TPTime) {
        if (value != null) {
            this.FBehind.Assign(value);
        }
    }

    get BFT(): TQTime {
        return this.FBFT;
    }
    set BFT(value: TQTime) {
        if (value != null) {
            this.FBFT.Assign(value);
        }
    }

    get BPL(): TQTime {
        return this.FBPL;
    }
    set BPL(value: TQTime) {
        if (value != null) {
            this.FBPL.Assign(value);
        }
    }
}

export class TTimePointEntry {
    OTime: string;
    ORank: number;
    Rank: number;
    PosR: number;
    Behind: string;
    BFT: string;
    BPL: string;
    PLZ: number;

    Assign(source: object) {
        if (source instanceof TTimePointEntry) {
            const e: TTimePointEntry = source as TTimePointEntry;
            this.OTime = e.OTime;
            this.Behind = e.Behind;
            this.BFT = e.BFT;
            this.BPL = e.BPL;
            this.ORank = e.ORank;
            this.Rank = e.Rank;
            this.PosR = e.PosR;
            this.PLZ = e.PLZ;
        } else if (source instanceof TTimePoint) {
            const o: TTimePoint = source as TTimePoint;
            this.OTime = o.OTime.toString();
            this.Behind = o.Behind.toString();
            this.BFT = o.BFT.toString();
            this.BPL = o.BPL.toString();
            this.ORank = o.ORank;
            this.Rank = o.Rank;
            this.PosR = o.PosR;
            this.PLZ = o.PosR;
        }
    }
}
