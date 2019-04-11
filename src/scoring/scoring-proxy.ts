export class TProxyProps {
    static readonly p_FRProxy = "FRProxy";
    static readonly p_Gezeitet = "Gezeitet";

    static readonly p_EventProps = "EventProps";

    static readonly p_RaceProps = "RaceProps";
    static readonly p_RCount = "RCount";

    static readonly p_Race = "Race";
    static readonly p_IsRacing = "IsRacing";
    static readonly p_Index = "Index";
    static readonly p_FResult = "FResult";
    static readonly p_OTime = "OTime";
    static readonly p_QU = "QU";
    static readonly p_Penalty_Points = "P_Points";
    static readonly p_Penalty_Note = "P_Note";
    static readonly p_Penalty_Percent = "P_Percent";
    static readonly p_Penalty_Time = "P_Time";

    static readonly p_Entry = "Entry";
    static readonly p_CPoints = "CPoints";
    static readonly p_Rank = "Rank";
    static readonly p_PosR = "PosR";
    static readonly p_PLZ = "PLZ";
    static readonly p_Drop = "Drop";
    static readonly p_SNR = "SNR";
    static readonly p_IsGezeitet = "IsGezeitet";
    static readonly p_IsTied = "IsTied";

    static readonly p_ScoringSystem = "ScoringSystem";
    static readonly p_ScoringSystem2 = "ScoringSystem2";
    static readonly p_ThrowoutScheme = "ThrowoutScheme";
    static readonly p_Throwouts = "Throwouts";
    static readonly p_FirstIs75 = "FirstIs75";
    static readonly p_ReorderRAF = "ReorderRAF";
    static readonly p_DivisionName = "DivisionName";

    static readonly p_Fleet = "Fleet";
    static readonly p_UseFleets = "UseFleets";
    static readonly p_TargetFleetSize = "TargetFleetSize";
    static readonly p_FirstFinalRace = "FirstFinalRace";
}

/**
 * data object,
 * passed as parameter to calculation engine,
 * also used in (end to end) unit-testing of scoring module.
 */
export class TFRProxy extends TProxyProps {
    EventProps: TJSEventProps;

    /**
     * RaceProps, at this time not more than a bool (for each race);
     * RCount elements,
     * element zero not used,
     * one element for each real race, starting at index 1.
     */
    IsRacing: boolean[];

    EntryInfoCollection: TEntryInfoCollection;

    /**
     * Count of Entries with at least one race-result
     */
    Gezeitet: number = 0;

    /**
     * contains ErrorCode,
     * e.g. -1 if exeption occured when calculating results
     */
    FResult: number = 0;

    UseFleets: boolean = false;
    TargetFleetSize: number = 8;
    FirstFinalRace: number = 20;

    constructor() {
        super();
        this.EventProps = new TJSEventProps();
        this.IsRacing = new Array<boolean>(1);
        this.EntryInfoCollection = new TEntryInfoCollection();
    }

    Clear(): void {
        this.EventProps.Clear();
        this.IsRacing = new Array<boolean>(1);
        this.EntryInfoCollection = new TEntryInfoCollection();
        this.Gezeitet = 0;
        this.FResult = 0;
        this.UseFleets = false;
        this.TargetFleetSize = 8;
        this.FirstFinalRace = 20;
    }

    Assign(p: TFRProxy): void {
        this.EventProps.Assign(p.EventProps);

        this.IsRacing = new Array<boolean>(p.RCount);
        for (let i = 0; i < this.RCount; i++) {
            this.IsRacing[i] = p.IsRacing[i];
        }

        this.EntryInfoCollection.Clear();
        for (let j = 0; j < p.EntryInfoCollection.Count; j++) {
            const ei: TEntryInfo = this.EntryInfoCollection.Add();
            ei.Assign(p.EntryInfoCollection.EntryList[j]);
        }

        this.Gezeitet = p.Gezeitet;
        this.FResult = p.FResult;
        this.UseFleets = p.UseFleets;
        this.TargetFleetSize = p.TargetFleetSize;
        this.FirstFinalRace = p.FirstFinalRace;
    }

    equals(p: TFRProxy): boolean {
        if (this.RCount !== p.RCount)
            return false;
        if (!this.EventProps.equals(p.EventProps))
            return false;
        if (this.Gezeitet !== p.Gezeitet)
            return false;
        if (this.FResult !== p.FResult)
            return false;
        if (this.UseFleets !== p.UseFleets)
            return false;
        if (this.TargetFleetSize !== p.TargetFleetSize)
            return false;
        if (this.FirstFinalRace !== p.FirstFinalRace)
            return false;

        if (!this.EntryInfoCollection.equals(p.EntryInfoCollection))
            return false;
        for (let i = 0; i < this.RCount; i++)
            if (this.IsRacing[i] !== p.IsRacing[i])
                return false;
        return true;
    }

    get RCount(): number { return this.IsRacing.length; }
    set RCount(value: number) {
        this.IsRacing = new Array<boolean>(value);
        for (let i = 1; i < value; i++)
            this.IsRacing[i] = true;
    }

}

export class TJSEventProps extends TProxyProps {
    static readonly LowPoint = 0;
    static readonly Bonus = 1;
    static readonly BonusDSV = 2;

    ScoringSystem: number = 0;
    ScoringSystem2: number = 0;
    ThrowoutScheme: number = 0;
    Throwouts: number = 1;
    FirstIs75: boolean = false;
    ReorderRAF: boolean = true;
    DivisionName: string = "*";

    constructor() {
        super();
        this.Clear();
    }

    Clear(): void {
        this.ScoringSystem = 0;
        this.ScoringSystem2 = 0;
        this.ThrowoutScheme = 0;
        this.Throwouts = 0;
        this.FirstIs75 = false;
        this.ReorderRAF = true;
        this.DivisionName = "*";
    }

    Assign(ep: TJSEventProps): void {
        this.ScoringSystem = ep.ScoringSystem;
        this.ScoringSystem2 = ep.ScoringSystem2;
        this.ThrowoutScheme = ep.ThrowoutScheme;
        this.Throwouts = ep.Throwouts;
        this.FirstIs75 = ep.FirstIs75;
        this.ReorderRAF = ep.ReorderRAF;
        this.DivisionName = ep.DivisionName;
    }

    equals(ep: TJSEventProps): boolean {
        if (this.ScoringSystem !== ep.ScoringSystem)
            return false;
        if (this.ScoringSystem2 !== ep.ScoringSystem2)
            return false;
        if (this.ThrowoutScheme !== ep.ThrowoutScheme)
            return false;
        if (this.Throwouts !== ep.Throwouts)
            return false;
        if (this.FirstIs75 !== ep.FirstIs75)
            return false;
        if (this.ReorderRAF !== ep.ReorderRAF)
            return false;
        if (this.DivisionName !== ep.DivisionName)
            return false;
        return true;
    }

}

export class TRaceInfo extends TProxyProps {
    // Input
    OTime: number = 0; // int; Original Time/FinishPosition
    QU: number = 0; // int; Encoded Penalty Type ('QUit Packet')
    Penalty_Points: number = 0.0; // double
    Penalty_Note: string = "";
    Penalty_Percent: number = 0; // int
    Penalty_TimePenalty: number = 0; // long

    // Output
    CPoints: number = 0.0; // double; Calculated Points
    Rank: number = 0; // int
    PosR: number = 0; // int; unique/eindeutiges Ranking
    PLZ: number = 0; // int; PlatzZiffer
    Drop: boolean = false; // IsThrowout
    Fleet: number = 0; // int
    IsRacing = true;

    // private System.Globalization.NumberFormatInfo info = System.Globalization.NumberFormatInfo.InvariantInfo;

    Assign(ri: TRaceInfo): void {
        // Input
        this.OTime = ri.OTime;
        this.QU = ri.QU;
        this.Penalty_Points = ri.Penalty_Points;
        this.Penalty_Note = ri.Penalty_Note;
        this.Penalty_Percent = ri.Penalty_Percent;
        this.Penalty_TimePenalty = ri.Penalty_TimePenalty;
        this.Fleet = ri.Fleet;
        this.IsRacing = ri.IsRacing;

        // Output
        this.CPoints = ri.CPoints;
        this.Rank = ri.Rank;
        this.PosR = ri.PosR;
        this.PLZ = ri.PLZ;
        this.Drop = ri.Drop;
    }

    equals(ri: TRaceInfo): boolean {
        if (this.OTime !== ri.OTime)
            return false;
        if (this.QU !== ri.QU)
            return false;
        if (Math.abs(this.Penalty_Points - ri.Penalty_Points) > 0.00001)
            return false;
        if (this.Penalty_Note !== ri.Penalty_Note)
            return false;
        if (this.Penalty_Percent !== ri.Penalty_Percent)
            return false;
        if (this.Penalty_TimePenalty !== ri.Penalty_TimePenalty)
            return false;
        if (this.Fleet !== ri.Fleet)
            return false;
        if (this.IsRacing !== ri.IsRacing)
            return false;


        // Output
        if (Math.abs(this.CPoints - ri.CPoints) > 0.00001)
            return false;
        if (this.Rank !== ri.Rank)
            return false;
        if (this.PosR !== ri.PosR)
            return false;
        if (this.PLZ !== ri.PLZ)
            return false;
        if (this.Drop !== ri.Drop)
            return false;

        return true;
    }

    string_FormatG(value: number): string {
        return value.toPrecision(8); // string.Format(info, "{0:G}", value)            
    }

    Convert_ToDouble(value: string): number {
        // Convert.ToDouble(xvalue, info);
        return Number.parseFloat(value);
    }

}

export class TEntryInfo extends TProxyProps {
    Index: number = 0; // int; Index in EntryInfoCollection
    SNR: number = 0; // int; Primary Key (SportlerNummer/SailNumber)
    IsGezeitet = true;
    IsTied = false;
    RaceList: Array<TRaceInfo>;

    getRaceInfo(i: number): TRaceInfo {
        return this.RaceList[i];
    }

    constructor() {
        super();
        this.RaceList = new Array<TRaceInfo>();
    }

    Assign(ei: TEntryInfo): void {
        // FIndex intentionally not copied
        this.SNR = ei.SNR;
        this.IsGezeitet = ei.IsGezeitet;
        this.IsTied = ei.IsTied;

        this.RaceList.length = 0; // Clear();
        for (let i = 0; i < ei.RCount; i++) {
            const ri: TRaceInfo = new TRaceInfo();
            this.RaceList.push(ri);
            ri.Assign(ei.RaceList[i]);
        }
    }

    equals(ei: TEntryInfo): boolean {
        if (this.Index !== ei.Index)
            return false;
        if (this.SNR !== ei.SNR)
            return false;
        if (this.IsGezeitet !== ei.IsGezeitet)
            return false;
        if (this.IsTied !== ei.IsTied)
            return false;
        if (this.RCount !== ei.RCount)
            return false;
        for (let i = 0; i < ei.RCount; i++) {
            if (!this.RaceList[i].equals(ei.RaceList[i]))
                return false;
        }
        return true;
    }

    /** number of real races */
    get RaceCount(): number {
        return this.RCount - 1;
    }

    /**
     * Count of elements in RaceList,
     * index 0 stores series-info (total points, total rank, ...),
     * index 1 stores info for 1st race.
     */
    get RCount(): number {
        return this.RaceList.length;
    }
}

export class TEntryInfoCollection {
    EntryList: Array<TEntryInfo>;

    constructor() {
        this.EntryList = new Array<TEntryInfo>();
    }

    getEntryInfo(i: number): TEntryInfo {
        if (i < this.EntryList.length)
            return this.EntryList[i];
        else
            return null;
    }

    Clear(): void {
        this.EntryList.length = 0;
    }

    equals(eic: TEntryInfoCollection): boolean {
        if (this.Count !== eic.Count)
            return false;
        for (let i = 0; i < this.EntryList.length; i++) {
            const ei: TEntryInfo = this.EntryList[i];
            if (!ei.equals(eic.EntryList[i]))
                return false;
        }
        return true;
    }

    FindKey(SNR: number): TEntryInfo {
        let ei: TEntryInfo;
        for (let i = 0; i < this.EntryList.length; i++) {
            ei = this.EntryList[i];
            if (ei.SNR === SNR)
                return ei;
        }
        return null;
    }

    Add(): TEntryInfo {
        const ei: TEntryInfo = new TEntryInfo();
        ei.Index = this.Count;
        this.EntryList.push(ei);
        return ei;
    }

    get Count(): number {
        return this.EntryList.length;
    }

}

