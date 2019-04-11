import { TUtils } from "../../util/fb-classes";
import { TFinishError } from "./event-enums";
import { TPenaltyISAF } from "../../calc/penalty-isaf";
import { TEnumSet } from "../../util/fb-enumset";
import { TEventNode } from "./event-row-collection";

export class TEventRaceEntryInspection {
    Penalty = "";
    CTime = 0;
    IsRacing = true;
    Fleet = 0;
    Drop = false;
    DG = 0;
    OTime = 0;
    Rank = 0;
    PosR = 0;
    PLZ = 0;
    FinishErrors = "";
}

export class TEventRaceEntry {
    private FPenalty: TPenaltyISAF = new TPenaltyISAF();
    CTime: number; // Points

    IsRacing = true;
    Fleet = 0;
    Drop = false;
    DG = 0;
    OTime = 0; // ORank
    Rank = 0;
    PosR = 0;
    PLZ = 0;
    FinishErrors: TEnumSet = new TEnumSet(TFinishError.error_Contiguous_OTime);
    
    constructor(private EventNode: TEventNode) {
        this.Clear();
    }

    inspect(): TEventRaceEntryInspection {
        const o = new TEventRaceEntryInspection();

        o.Penalty = this.FPenalty.toString();

        o.CTime = this.CTime;
        o.IsRacing = this.IsRacing;
        o.Fleet = this.Fleet;
        o.Drop = this.Drop;
        o.DG = this.DG;
        o.OTime = this.OTime;
        o.Rank = this.Rank;
        o.PosR = this.PosR;
        o.PLZ = this.PLZ;

        o.FinishErrors = this.FinishErrors.toString();
    
        return o;
    }

    Sanitize() {
        if (this.Rank === undefined)
          this.Rank = -1;
        if (this.PosR === undefined)
          this.PosR = -1;
        if (this.PLZ === undefined)
          this.PLZ = -1;
          if (this.DG === undefined)
          this.DG = -1;
        if (this.Drop === undefined)
          this.Drop = false;
        if (this.Fleet === undefined)
          this.Fleet = -1;
        if (this.CTime === undefined)
          this.CTime = 0;
          
    }
    Clear(): void {
        this.IsRacing = true;
        this.Fleet = 0;
        this.Drop = false;
        this.CTime = 0;
        this.DG = 0;
        this.OTime = 0;
        this.Rank = 0;
        this.PosR = 0;
        this.PLZ = 0;
        this.FPenalty.Clear();
    }

    Assign(e: TEventRaceEntry): void {
        if (e) {
            this.Fleet = e.Fleet;
            this.IsRacing = e.IsRacing;
            this.Drop = e.Drop;
            this.Penalty.Assign(e.Penalty); // QU := e.QU;
            this.DG = e.DG;
            this.OTime = e.OTime;
            this.CTime = e.CTime;
            this.Rank = e.Rank;
            this.PosR = e.PosR;
            this.PLZ = e.PLZ;
        }
    }

    get RaceValue(): string {
        let sPoints: string;
        switch (this.Layout) {
            case 0:
                sPoints = this.Points; // Default
                break;
            case 1: sPoints = this.OTime.toString(); // FinishPos
                break;
            case 2:
                sPoints = this.Points; // Points
                break;
            default:
                sPoints = this.CTime.toString();
                break;
        }
        let result: string = sPoints;

        const sQU: string = this.Penalty.toString();
        if (sQU !== "")
            result = result + "/" + sQU;

        if (this.Drop)
            result = "[" + result + "]";

        if (!this.IsRacing)
            result = "(" + result + ")";

        return result;
    }
    set RaceValue(value: string) {
        /* use special value 0 to delete a FinishPosition, instead of -1,
          so that the sum of points is not affected*/
        if (value === "0")
            this.OTime = 0;
        else if (TUtils.StrToIntDef(value, -1) > 0)
            this.OTime = Number.parseInt(value, 10);

        else if (value.length > 1 && value[0] === 'F')
            this.Fleet = this.ParseFleet(value);


        else if (value === "x")
            this.IsRacing = false;
        else if (value === "-x")
            this.IsRacing = true;

        else
            this.Penalty.Parse(value);
    }

    get QU(): number {
        return this.FPenalty.AsInteger;
    }
    set QU(value: number) {
        this.FPenalty.AsInteger = value;
    }

    get Penalty(): TPenaltyISAF {
        return this.FPenalty;
    }
    get Points(): string {
        return this.CPoints.toFixed(2);
    }
    get CPoints(): number {
        return this.CTime / 100.0; // floating point division
    }
    set CPoints(value: number) {
        this.CTime = value * 100;
    }

    get CTime1(): number {
        return this.CTime / 100; // integer division
    }
    set CTime1(value: number) {
        this.CTime = value * 100;
    }

    get Layout(): number {
        if (this.EventNode != null)
            return this.EventNode.ShowPoints;
        else
            return 0;
    }

    ParseFleet(value: string): number {
        if (value.length >= 2 && value[0] === 'F') {
            const s: string = value.toUpperCase().substring(1);
            const c: string = s[0];
            switch (c) {
                case 'Y': return 1;
                case 'B': return 2;
                case 'R': return 3;
                case 'G': return 4;
                case 'M': return 0;
                default: return TUtils.StrToIntDef(s, this.Fleet);
            }
        }
        return this.Fleet;
    }

}


