import { TEntry } from "./scoring-entry";
import { TPoints } from "./scoring-points";

export class TSeriesPoints extends TPoints {

    static NextSeriesPointID = 1;
    SeriesPointID: number;

    Tied: boolean;

    protected aSailID: number = 0; // for debugging so boat's SailID pops up in debugger listing
    protected EntryID: number = 0; // for preserving order when sorting equals

    constructor(
        entry: TEntry,
        points: number = Number.NaN,
        pos: number = Number.MAX_SAFE_INTEGER,
        tied: boolean = false) {
        super(entry, points, pos);
        this.SeriesPointID = TSeriesPoints.NextSeriesPointID;
        TSeriesPoints.NextSeriesPointID++;

        if (entry) {
            this.aSailID = entry.SailID;
            this.EntryID = entry.EntryID;
        }
        this.Tied = tied;
    }

    equals(that: TSeriesPoints): boolean {
        if (this === that)
            return true;
        // if (!(obj instanceof TSeriesPoints))
        //     return false;
        if (!that)
            return false;

        if (!super.equals(that))
            return false;

        // let that: TSeriesPoints = obj as TSeriesPoints;
        return (this.Tied === that.Tied);
    }

    compareTo(that: TSeriesPoints): number {
        if (that == null)
            return - 1;
        try {
            // let that: TSeriesPoints = obj as TSeriesPoints;
            if (this.Points < that.Points)
                return - 1;
            else if (this.Points > that.Points)
                return 1;
            else {
                // need to compare by EntryID also, because Sort is not a stable sort,
                // order of elements is not preserved if elements are equal
                if (this.EntryID < that.EntryID)
                    return -1;
                else if (this.EntryID > that.EntryID)
                    return 1;
            }
            return 0;
        }
        catch
        {
            return - 1;
        }
    }

    toString(): string {
        let s = this.Points.toFixed(2);
        if (this.Tied)
            s += 'T';
        return s;
    }

}

