import { TStringList } from "../util/fb-strings";
import { TEventRowCollectionItem, TEventRowCollection, TEventNode } from "../col/event/event-row-collection";
import { TEventRaceEntry } from "../col/event/event-race-entry";
import { TFinishError, TEntryError } from "../col/event/event-enums";
import { TEventBO } from "../col/event/event-bo";
import { TBO } from "./fr-bo";

export class TOTimeErrorList
    {
        private FL: Array<TEventRowCollectionItem>;
        private FErrorList: TStringList;
        private FSortedSL: TStringList;
        private BO: TBO;
        
        constructor(abo: TBO)
        {
            this.FL = new Array<TEventRowCollectionItem>();
            this.BO = abo;
            this.FErrorList = new TStringList();
            this.FSortedSL = new TStringList();
            // FSortedSL.Sorted = true; // IndexOf does not work yet
        }

        private CheckOTime(ev: TEventNode): boolean
        {
            if (ev.UseFleets)
            {
                let hasError = false;
                const cl: TEventRowCollection = ev.Collection;
                for (let r = 1; r < cl.RCount; r++)
                {
                    const fc: number = cl.FleetCount(r);
                    for (let f = 0; f <= fc; f++)
                    {
                        ev.Collection.FillFleetList(this.FL, r, f);
                        if (this.FL.length > 0)
                            if (this.CheckOTimeForFleet(this.FL, r))
                                hasError = true;
                    }
                }
                this.FL.length = 0;
                return hasError;
            }
            else
            {
                return this.CheckOTimeForAll(ev.Collection);
            }
        }

        private CheckOTimeForFleet(cl: Array<TEventRowCollectionItem>, r: number):boolean
        {
            let cr: TEventRowCollectionItem;
            let re: TEventRaceEntry;

            const oldErrorCount = this.FErrorList.Count;
            const EntryCount = cl.length;
            const a: number[] = new Array<number>(EntryCount + 1);

            // clear array slots
            for (let i1 = 0; i1 < a.length; i1++)
            {
                a[i1] = 0;
            }

            for (let i2 = 0; i2 < cl.length; i2++)
            {
                cr = cl[i2];
                re = cr.Race[r];
                const temp: number = re.OTime;
                if (temp < 0)
                {
                    re.FinishErrors.Include(TFinishError.error_OutOfRange_OTime_Min);
                    this.AddFinishError(r, cr, TFinishError.error_OutOfRange_OTime_Min); // below lower limit
                }
                else if (temp > EntryCount)
                {
                    re.FinishErrors.Include(TFinishError.error_OutOfRange_OTime_Max);
                    this.AddFinishError(r, cr, TFinishError.error_OutOfRange_OTime_Max); // beyond upper limit
                }
                else if ((temp > 0) && (a[temp] === 1))
                {
                    re.FinishErrors.Include(TFinishError.error_Duplicate_OTime);
                    this.AddFinishError(r, cr, TFinishError.error_Duplicate_OTime); // has duplicates
                }
                else
                    a[temp] = 1;
            }

            let HasNull = false;
            for (let position = 1; position <= EntryCount; position++)
            {
                if ((a[position] === 1) && HasNull)
                {
                    this.AddContiguousErrorA(cl, r, position);
                    HasNull = false;
                }
                if (a[position] === 0)
                    HasNull = true;
            }

            return (this.FErrorList.Count > oldErrorCount);
        }

        private AddContiguousError(cl: TEventRowCollection, r: number, position: number): void
        {
            let cr: TEventRowCollectionItem;
            let re: TEventRaceEntry;
            for (let i = 0; i < cl.Count; i++)
            {
                cr = cl.Items[i];
                re = cr.Race[r];
                if (re.OTime === position)
                {
                    re.FinishErrors.Include(TFinishError.error_Contiguous_OTime);
                    this.AddFinishError(r, cr, TFinishError.error_Contiguous_OTime);
                }
            }
        }

        private AddContiguousErrorA(cl: Array<TEventRowCollectionItem>, r: number, position: number): void
        {
            let cr: TEventRowCollectionItem;
            let re: TEventRaceEntry;
            for (let i = 0; i < cl.length; i++)
            {
                cr = cl[i];
                re = cr.Race[r];
                if (re.OTime === position)
                {
                    re.FinishErrors.Include(TFinishError.error_Contiguous_OTime);
                    this.AddFinishError(r, cr, TFinishError.error_Contiguous_OTime);
                }
            }
        }

        private CheckOTimeForAll(cl: TEventRowCollection): boolean
        {
            let cr: TEventRowCollectionItem;
            let re: TEventRaceEntry;

            const oldErrorCount: number = this.FErrorList.Count;
            const EntryCount: number = cl.Count;
            const a: number[] = new Array<number>(EntryCount + 1); // SetLength(a, EntryCount + 1);
            for (let r = 1; r < cl.RCount; r++)
            {
                // clear array slots
                for (let i1 = 0; i1 < a.length; i1++)
                {
                    a[i1] = 0;
                }
                for (let i2 = 0; i2 < cl.Count; i2++)
                {
                    cr = cl.Items[i2];
                    re = cr.Race[r];
                    const temp: number = re.OTime;
                    if (temp < 0)
                    {
                        re.FinishErrors.Include(TFinishError.error_OutOfRange_OTime_Min);
                        this.AddFinishError(r, cr, TFinishError.error_OutOfRange_OTime_Min); // below lower limit
                    }
                    else if (temp > EntryCount)
                    {
                        re.FinishErrors.Include(TFinishError.error_OutOfRange_OTime_Max);
                        this.AddFinishError(r, cr, TFinishError.error_OutOfRange_OTime_Max); // beyond upper limit
                    }
                    else if ((temp > 0) && (a[temp] === 1))
                    {
                        re.FinishErrors.Include(TFinishError.error_Duplicate_OTime);
                        this.AddFinishError(r, cr, TFinishError.error_Duplicate_OTime); // has duplicates
                    }
                    else
                        a[temp] = 1;
                }
                let HasNull = false;
                for (let position = 1; position <= EntryCount; position++)
                {
                    if ((a[position] === 1) && HasNull)
                    {
                        this.AddContiguousError(cl, r, position);
                        HasNull = false;
                    }
                    if (a[position] === 0)
                        HasNull = true;
                }
            }
            return (this.FErrorList.Count > oldErrorCount);
        }
        
        private CheckBib(ev: TEventNode): boolean
        {
            // Bib must be unique, should be > 0
            let result = true;
            this.FSortedSL.Clear();

            const cl: TEventRowCollection = ev.Collection;
            for (let i = 0; i < cl.Count; i++)
            {
                const cr: TEventRowCollectionItem = cl.Items[i];
                const  s: string = cr.Bib.toString();
                // check for duplicates
                const foundIndex: number = this.FSortedSL.IndexOf(s);
                if (foundIndex > -1)
                {
                    cr.EntryErrors.Include(TEntryError.error_Duplicate_Bib);
                    this.AddEntryError(cr, TEntryError.error_Duplicate_Bib);
                    result = false;
                }
                else
                    this.FSortedSL.Add(s);
            }
            return result;
        }
        
        private ClearFlags(ev: TEventNode): void
        {
            const cl: TEventRowCollection = ev.Collection;
            for (let i = 0; i < cl.Count; i++)
            {
                const cr: TEventRowCollectionItem = cl.Items[i];
                cr.EntryErrors.Clear();
                for (let r = 1; r < cl.RCount; r++)
                    cr.Race[r].FinishErrors.Clear();
            }
        }
        
        private CheckSNR(ev: TEventNode): boolean
        {
                        let result = true;
            // SNR must be unique, must be > 0
            const cl: TEventRowCollection = ev.Collection;
            this.FSortedSL.Clear();
            for (let i = 0; i < cl.Count; i++)
            {
                const cr: TEventRowCollectionItem = cl.Items[i];
                const s: string = cr.SNR.toString();
                // check for duplicates
                if (this.FSortedSL.IndexOf(s) > -1)
                {
                    cr.EntryErrors.Include(TEntryError.error_Duplicate_SNR);
                    this.AddEntryError(cr, TEntryError.error_Duplicate_SNR);
                    result = false;
                }
                else
                    this.FSortedSL.Add(s);
            }
            return result;
        }
        
        protected AddEntryError(cr: TEventRowCollectionItem, e: TEntryError): void
        {
            let s: string = "Error." + this.BO.MsgToken.cTokenSport;
            if (cr != null)
                s = s + "ID" + cr.BaseID.toString();
            s = s + " = " + this.EntryErrorStrings(e);
            this.FErrorList.Add(s);
        }
        
        protected AddFinishError(r: number, cr: TEventRowCollectionItem, e: TFinishError): void
        {
            let s: string = "Error." + this.BO.MsgToken.cTokenSport + this.BO.MsgToken.cTokenRace + r.toString();
            if (cr != null)
                s = s + ".ID" + cr.BaseID.toString();
            s = s + " = " + this.FinishErrorStrings(e);
            this.FErrorList.Add(s);
        }
        
        public IsPreconditionForStrictInputMode(ev: TEventNode): boolean
        {
            const cl: TEventRowCollection = ev.Collection;
            if (ev.UseFleets)
            {
                if (cl.Count < 2)
                    return true;
                for (let r = 1; r < cl.RCount; r++)
                {
                    const fc: number = cl.FleetCount(r);
                    for (let f = 0; f <= fc; f++)
                    {
                        cl.FillFleetList(this.FL, r, f);
                        if (this.FL.length > 0)
                        {
                            if (! this.IsPreconditionForFleet(this.FL, r))
                                return false;
                        }
                    }
                }
                return true;
            }
            else
            {
                return this.IsPreconditionForAll(cl);
            }
        }

        private IsPreconditionForFleet(cl: Array<TEventRowCollectionItem>, r: number): boolean
        {
            let a: Array<number>; // array of Integer;
            let cr: TEventRowCollectionItem;
            let EntryCount: number;
            let temp: number;
            let HasNull: boolean;

            // exit at the first encouter of an error, only boolean result is important
            if (cl.length < 2) return false;
            EntryCount = cl.length;
            a = new Array<number>(EntryCount + 1); // SetLength(a, EntryCount + 1);

            // clear array slots
            for (let i1 = 0; i1 < a.length; i1++)
            {
                a[i1] = 0;
            }
            for (let i2 = 0; i2 < cl.length; i2++)
            {
                cr = cl[i2];
                temp = cr.Race[r].OTime;
                if (temp < 0) return false; // below lower limit
                if (temp > EntryCount) return false; // beyond upper limit
                if ((temp > 0) && (a[temp] === 1)) return false; // has duplicates
                a[temp] = 1;
            }
            HasNull = false;
            for (let i3 = 1; i3 < cl.length; i3++)
            {
                if ((a[i3] === 1) && HasNull)
                    return false; // not contiguous
                if (a[i3] === 0)
                    HasNull = true;
            }
            return true;
        }

        private IsPreconditionForAll(cl: TEventRowCollection): boolean
        {
            let a: Array<number>; // array of Integer;
            let cr: TEventRowCollectionItem;
            let EntryCount: number;
            let temp:number;
            let HasNull: boolean;

            // exit at the first encouter of an error, only boolean result is important
            if (cl.Count < 2) return false;
            EntryCount = cl.Count;			
            a = new Array<number>(EntryCount + 1); // SetLength(a, EntryCount + 1);
            for (let r = 1; r < cl.RCount; r++)
            {
                // clear array slots
                for (let i1 = 0; i1 < a.length; i1++)
                {
                    a[i1] = 0;
                }
                for (let i2 = 0; i2 < cl.Count; i2++)
                {
                    cr = cl.Items[i2];
                    temp = cr.Race[r].OTime;
                    if (temp < 0) return false; // below lower limit
                    if (temp > EntryCount) return false; // beyond upper limit
                    if ((temp > 0) && (a[temp] === 1)) return false; // has duplicates
                    a[temp] = 1;
                }
                HasNull = false;
                for (let i3 = 1; i3 < cl.Count; i3++)
                {
                    if ((a[i3] === 1) && HasNull)
                        return false; // not contiguous
                    if (a[i3] === 0)
                        HasNull = true;
                }
            }
            return true;
        }
        
        public CheckAll(ev: TEventNode): boolean
        {
            this.FErrorList.Clear();
            this.ClearFlags(ev);
              this.CheckOTime(ev);
            this.CheckBib(ev);
            this.CheckSNR(ev);
            return this.FErrorList.Count > 0;
        }
        
        public GetMsg(Memo: TStringList): void
        {
            for (let i = 0; i < this.FErrorList.Count; i++)
                Memo.Add(this.FErrorList.SL[i]);
        }
        
        public HasErrors(): boolean
        {
            return this.FErrorList.Count > 0;
        }
        
        public EntryErrorStrings(e: TEntryError): string
        {
            switch (e)
            {
                case TEntryError.error_Duplicate_Bib: return "duplicate Bib";
                case TEntryError.error_Duplicate_SNR: return "duplicate SNR";
                case TEntryError.error_OutOfRange_Bib: return "Bib out of range";
                case TEntryError.error_OutOfRange_SNR: return "SNR out of range";
            }
            return "";
        }
        
        public FinishErrorStrings(e: TFinishError): string
        {
            switch (e)
            {
                case TFinishError.error_Duplicate_OTime: return "duplicate OTime";
                case TFinishError.error_OutOfRange_OTime_Max: return "OTime beyond EntryCount";
                case TFinishError.error_OutOfRange_OTime_Min: return "OTime below zero";
                case TFinishError.error_Contiguous_OTime: return "OTime gap";
            }
            return "";
        }
    }

