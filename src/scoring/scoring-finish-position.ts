import { Constants, TRSPenalty } from "./scoring-penalty";

    /**
     * Class for storing finish position numbers.
     * This is mostly an integer with the raw finish order, 
     * but also handles non-finish values such as DNC, DNS and DNF.
     * NOTE this class is responsible only for specifying the finish numbers, 
     * NOT for determining the points to be assigned.
     * See ScoringSystem class for changing penalties into points.
     * See also the Penalty class for handling of penalties assigned to boats (whether or not they have a valid finish).
     * To set a new finish position, recreate the instance.
     */
    export class TFinishPosition
    {	
        static NextFinishPositionID = 1;
        //private FinishPositionID: number;
        
        fFinishPosition: number;
        
        static ToStringN(order: number): string
        {
            switch (order)
            {
                case Constants.NOF: return "No Finish";
                case Constants.DNC: return "dnc";
                case Constants.DNS: return "dns";
                case Constants.DNF: return "dnf";
                case Constants.TLE: return "tle";
                default: return order.toString();					
            }
        }
        
        constructor(value: number)
        {
            //this.FinishPositionID = TFinishPosition.NextFinishPositionID;
            TFinishPosition.NextFinishPositionID++;

            if ((value & Constants.NF) !== 0)
            {
                // setting to non-finish penalty... mask out other bits
                this.fFinishPosition = (value & Constants.NOF);
            }
            else
            {
                this.fFinishPosition = value;
            }
        }
        
        static parseString(s: string): number
        {
            try
            {
                return Number.parseInt(s, 10);
            }
            catch
            {
                try
                {
                    return TRSPenalty.ParsePenalty(s).Penalty;
                }
                catch
                {
                    return Constants.NOF;
                }
            }
        }
                        
        compareTo(that: TFinishPosition): number
        {
            if (!that)
                return -1;
            if (this.fFinishPosition < that.fFinishPosition)
                return - 1;
            else if (this.fFinishPosition > that.fFinishPosition)
                return 1;
            else
                return 0;
        }
        
        isFinisher(): boolean
        {
            return ((this.fFinishPosition < Constants.HF) && (this.fFinishPosition > 0));
        }
        
        isNoFinish(): boolean
        {
            return this.fFinishPosition === Constants.NOF;
        }
        
        equals(that: TFinishPosition): boolean
        {
            if (!that)
                return false;
            return this.fFinishPosition === that.fFinishPosition;
        }
        
        intValue(): number
        {
            return this.fFinishPosition;
        }
        
        isValidFinish(): boolean
        {
            return this.IsValidFinish(this.fFinishPosition);
        }
            
        IsValidFinish(order: number): boolean
        {
            return (order <= Constants.HF);
        }
        
        toString(): string
        {
            return TFinishPosition.ToStringN(this.fFinishPosition);
        }
                
    }
