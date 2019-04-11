/**
 * These are the constants that defined the penalty values.
 * They come in three groups:
 * 
 * Non-Finish penalty values are for boats that do not have a valid Finish.
 * These are used in BOTH the FinishPosition class and in the Penalty class.
 * These are not-bitwise penalties and a boat cannot have more than one of these at a time.  
 * See FinishPosition class
 * 
 * Disqualification penalties are the various ways a boat can be disqualified.
 * These also are not bitwise, as a boat can only be disqualified once.  
 * But a boat can be disqualified with or without a valid finish.  
 * So, a boat can carry both a non-finish penalty and a disqualification penalty.
 * See Penalty class
 * 
 * Other penalties are the various other ways a boat can be "dinged".
 * This includes check-in penalties, redress, percentage penalties, etc.  
 * These ARE Bit-wise penalties, and a boat can have more than one of them.  
 * Also, a boat CAN have a non-finish penalty and an other penalty, 
 * but a boat may not have a disqualification penalty and "other" penalty.
 * See Penalty class
*/
export class Constants {
    static readonly NOP = 0x0000; // no penalty mask

    // group of dsq penalties
    static readonly DSQ = 0x0001;
    static readonly DNE = 0x0002;
    static readonly RAF = 0x0003; // retired after finish
    static readonly OCS = 0x0004; // on course side
    static readonly BFD = 0x0005; // black flag disqualification
    static readonly DGM = 0x0006;
    static readonly UFD = 0x0007; // U-Flag disqualification

    static readonly DM = 0x0007; // dsq (penalty) mask

    // group / set  of other penalty bits (flags)
    static readonly STP = 0x0008; // z flag penalty
    static readonly ZFP = 0x0020; // z flag penalty
    static readonly AVG = 0x0040; // average
    static readonly SCP = 0x0080; // scoring penalty
    static readonly RDG = 0x0100; // redress given
    static readonly MAN = 0x0200; // manual
    static readonly CNF = 0x0400; // checkin failure
    static readonly DPI = 0x1000; // redress given

    static readonly OM = 0x1FF8; // other (penalty) mask
    static readonly HF = 0x1FFF; // highest possible finish

    // group of nofinish penalties
    static readonly TLE = 0x6000; // tle, time limit expired (finish time window)
    static readonly DNF = 0x8000; // dnf, did not finish
    static readonly DNS = 0xA000; // dns, did not start
    static readonly DNC = 0xC000; // dnc, did not come to the starting area
    static readonly NOF = 0xE000; // nofinish value

    static readonly NF = 0xE000; // nofinish mask    
}

/**
 * Class for storing penalty settings. NOTE this class is responsible only
 * for specifying the penalty assignments: NOT for determining the points to
 * be assigned. See <see cref="ScoringSystems"/> for changing penalties into points.
 * 
 * There are three sets of penalties supported in this class:
 * - NonFinishPenalties: penalties that can be assigned to boats that have not finished a race.
 * Examples include DNC, DNS
 * - Disqualification Penalties: penalties that override other penalties and involve some variant of causing a boat's finish to be ignored.
 * Examples include, DSQ, OCS
 * - ScoringPenalties: penalties that may accumulate as various "hits" on a boat's score. 
 * Examples include SCP, ZFP  
 * 
 * Although it is unusual a boat may have more than one penalty applied. 
 * For example a boat may get a Z Flag penalty and a 20 Percent penalty.  
 * Or a boat may miss a finish time window and still be scored with a 20 Percent penalty.
 * 
 * In general, a boat can have a Non-Finish penalty AND any other penalty applied
 * and the scoring penalties can accumulate. But the disqualification penalties do
 * not accumulate and will override other penalties assigned.
 */
export class TRSPenalty {

    static AllNonFinishPenalties: TRSPenalty[] = [
        new TRSPenalty(Constants.DNC),
        new TRSPenalty(Constants.DNS),
        new TRSPenalty(Constants.DNF),
        new TRSPenalty(Constants.TLE)
    ];

    /** contains the percentage assigned if a SCP penalty is set */
    Percent = 0;

    /** contains the points to be awarded for STP, RDG and MAN penalties */
    Points = 0.0;

    /** contains the penalties assigned. 
    This is a "bit-wise" field, each bit represents a different penalty. */
    private fPenalty: number;
    
    static IsFinishPenalty(pen: number): boolean {
        return ((pen & Constants.NF) !== 0);
    }
    
    /**
    string parameter is a list of comma separated tokens
    each token has the form of Key[/Value]
    a points value is expected for STP, RDG, MAN (parsed as double)
    a percent value is expected for SCP (parsed as int)
    without a key, a percent value can be specified as P+Value or  Value+%
    may throw ArgumentException
    
    @param origPen Comma separated list of tokens of key/value pairs
    @returns new penalty object
    */
    static ParsePenalty(origPen: string): TRSPenalty {
        let pen = origPen.toUpperCase();
        let rsp: TRSPenalty = null;

        if (pen.length === 0)
            return new TRSPenalty(Constants.NOP);

        // foreach comma separated token, call this same method (recursively)
        if (pen.indexOf(",") >= 0) {
            let leftc = 0;
            const newpen: TRSPenalty = new TRSPenalty();

            while (leftc <= pen.length) {
                let rightc: number = pen.indexOf(",", leftc);
                if (rightc < 0)
                    rightc = pen.length;
                const sub: string = pen.substring(leftc, rightc);
                const addpen: TRSPenalty = TRSPenalty.ParsePenalty(sub);
                if (addpen.isOtherPenalty()) {
                    newpen.addOtherPenalty(addpen.Penalty);

                    if (addpen.hasPenalty(Constants.STP) || addpen.hasPenalty(Constants.MAN) || addpen.hasPenalty(Constants.RDG)) {
                        newpen.Points = addpen.Points;
                    }
                    if (addpen.hasPenalty(Constants.SCP)) {
                        newpen.Percent = addpen.Percent;
                    }
                }
                else if (addpen.isDsqPenalty()) {
                    newpen.DsqPenalty = addpen.Penalty;
                }
                else if (addpen.isFinishPenalty()) {
                    newpen.FinishPenalty = addpen.Penalty;
                }
                leftc = rightc + 1;
            }
            return newpen;
        }

        // the individual tokens should have the general form of <pen>/<number>
        const divided: string[] = pen.split('/');
        pen = divided[0];
        const val: string = (divided.length > 1) ? divided[1] : "";

        if (pen === "DSQ")
            return new TRSPenalty(Constants.DSQ);
        if (pen === "DNE")
            return new TRSPenalty(Constants.DNE);
        if (pen === "DND")
            return new TRSPenalty(Constants.DNE);
        if (pen === "RAF")
            return new TRSPenalty(Constants.RAF);
        if (pen === "RET")
            return new TRSPenalty(Constants.RAF);
        if (pen === "OCS")
            return new TRSPenalty(Constants.OCS);
        if (pen === "PMS")
            return new TRSPenalty(Constants.OCS);
        if (pen === "BFD")
            return new TRSPenalty(Constants.BFD);
        if (pen === "DGM")
            return new TRSPenalty(Constants.DGM);
        if (pen === "UFD")
            return new TRSPenalty(Constants.UFD);
        if (pen === "CNF")
            return new TRSPenalty(Constants.CNF);
        if (pen === "ZPG")
            return new TRSPenalty(Constants.ZFP);
        if (pen === "ZFP")
            return new TRSPenalty(Constants.ZFP);
        if (pen === "AVG")
            return new TRSPenalty(Constants.AVG);
        if (pen === "DNC")
            return new TRSPenalty(Constants.DNC);
        if (pen === "DNS")
            return new TRSPenalty(Constants.DNS);
        if (pen === "DNF")
            return new TRSPenalty(Constants.DNF);
        if (pen === "WTH")
            return new TRSPenalty(Constants.DNF);
        if (pen === "TLE")
            return new TRSPenalty(Constants.TLE);
        if (pen === "TLM")
            return new TRSPenalty(Constants.TLE);

        if (pen.endsWith("%")) {
            rsp = new TRSPenalty(Constants.SCP);
            try {
                rsp.Percent = Number.parseInt(pen.substring(0, pen.length - 2), 10);
            }
            catch (ex) {
                // don't care
            }
            return rsp;
        }

        if (pen.startsWith("P")) {
            rsp = new TRSPenalty(Constants.SCP);
            try {
                rsp.Percent = Number.parseInt(pen.substring(1), 10);
                return rsp;
            }
            catch (ex) {
                console.log(ex.Message);
            }
        }

        if (pen === "STP" || pen === "RDG" || pen === "RDR" || pen === "MAN" || pen === "DPI") {
            if (pen.startsWith("STP"))
                rsp = new TRSPenalty(Constants.STP);
            else if (pen.startsWith("MAN"))
                rsp = new TRSPenalty(Constants.MAN);
            else if (pen.startsWith("DPI"))
                rsp = new TRSPenalty(Constants.DPI);
            else // if (pen.startsWith("RDG"))
                rsp = new TRSPenalty(Constants.RDG);
            // assume is form "MAN/<pts>"
            try {
                rsp.Points = Number.parseFloat(val); // , NumberFormatInfo.InvariantInfo); 
            }
            catch (ex) {
                console.log(ex.Message);
            }
            return rsp;
        }

        if (pen === "SCP" || pen === "PCT") {
            rsp = new TRSPenalty(Constants.SCP);
            // assume is form "SCP/<pts>"
            try {
                rsp.Percent = Number.parseInt(val, 10);
            }
            catch (ex) {
            }
            return rsp;
        }

        // throw new System.ArgumentException("Unable to parse penalty, pen=" + pen);
        throw new Error("Unable to parse penalty, pen=" + pen);

    }

    /** create new penalty object with fPercent and fPoints zero.    
        @param pen combined penalty value
    */
    constructor(pen: number = Constants.NOP) {
        this.fPenalty = pen;
        this.Percent = 0;
        this.Points = 0;
    }

    /** replaces the finish penalty leaving others alone */
    set FinishPenalty(value: number) {
        this.fPenalty = this.fPenalty & (Constants.NF ^ 0xFFFF); // clear finish bits
        this.fPenalty = this.fPenalty | (value & Constants.NF); // add in new finish penalty bit
    }

    /** replaces the disqualification penalty leaving others alone */
    set DsqPenalty(value: number) {
        this.fPenalty = this.fPenalty & (Constants.DM ^ 0xFFFF); // clear dsq bits
        this.fPenalty = this.fPenalty | (value & Constants.DM); // add in new dsq penalty bit
    }

    get Penalty(): number {
        return this.fPenalty;
    }

    /** 
     * replaces the current penalty settings with the specified penalty
     * Resets percentage and manual points to 0.
     */
    set Penalty(value: number) {
        this.fPenalty = value;
        this.Percent = 0; // percentage
        this.Points = 0; // manual points
    }

    equals(that: TRSPenalty): boolean {
        if (this === that)
            return true;
        try {
            if (this.Penalty !== that.Penalty)
                return false;
            if (this.Percent !== that.Percent)
                return false;
            if (this.Points !== that.Points)
                return false;
            return true;
        }
        catch (ex) {
            return false;
        }
    }

    compareTo(that: TRSPenalty): number {
        if (this === that)
            return 0;

        // so far all penalties are equal
        if (that.fPenalty > this.fPenalty)
            return -1;
        else if (that.fPenalty < this.Penalty)
            return 1;
        else if (that.Percent > this.Percent)
            return -1;
        else if (that.Percent < this.Percent)
            return 1;
        else if (that.Points > this.Points)
            return -1;
        else if (that.Points < this.Points)
            return 1;
        else
            return 0;
    }

    Clone(): TRSPenalty {
        // return MemberwiseClone();
        const result = new TRSPenalty();
        result.Percent = this.Percent;
        result.Points = this.Points;
        result.fPenalty = this.fPenalty;
        return result;
    }

    /** Adds the specified penalty to the set of other penalties applied
        All other penalties remain
    */
    addOtherPenalty(newPen: number): number {
        newPen = newPen & Constants.OM; // mask out stray bits out of Other area
        this.fPenalty = this.fPenalty | newPen;
        return this.fPenalty;
    }

    /** Clears the specified penalty in the set of penalties applied */
    clearPenalty(newPen: number): number {
        const notPen: number = 0xFFFF ^ newPen;
        this.fPenalty = (this.fPenalty & notPen);
        return this.fPenalty;
    }

    /** 
     * tests for the presence of the bit,
     * presumes that inPen is a simple penalty,
     * not a combination penalty
     * @param inPen a "simple" penalty, not a combination
     * @returns true if penalty bit is set
     */
    hasPenalty(inPen: number): boolean {
        if (this.IsOtherPenalty(inPen)) {
            return (this.fPenalty & inPen & Constants.OM) !== 0;
            // AND of the two in the other range should return good
        }
        else if (this.IsDsqPenalty(inPen)) {
            return (this.fPenalty & Constants.DM) === (inPen & Constants.DM);
        }
        else if (TRSPenalty.IsFinishPenalty(inPen)) {
            return (this.fPenalty & Constants.NF) === (inPen & Constants.NF);
        }
        return (inPen === this.fPenalty);
    }

    /** clears the penalty integer, percent and points */
    clear(): void {
        this.Points = 0;
        this.Percent = 0;
        this.Penalty = Constants.NOP;
    }

    isFinishPenalty(): boolean {
        return TRSPenalty.IsFinishPenalty(this.fPenalty);
    }

    isDsqPenalty(): boolean {
        return this.IsDsqPenalty(this.fPenalty);
    }
    IsDsqPenalty(pen: number): boolean {
        return ((pen & Constants.DM) !== 0);
    }

    isOtherPenalty(): boolean {
        return this.IsOtherPenalty(this.fPenalty);
    }
    IsOtherPenalty(pen: number): boolean {
        return ((pen & Constants.OM) !== 0);
    }

    toString(): string {
        return this.ToString2(this, true);
    }

    ToStringB(showPts: boolean): string {
        return this.ToString2(this, showPts);
    }

    ToStringP(inP: TRSPenalty): string {
        return this.ToString2(inP, true);
    }

    FinishPositionToString(order: number): string {
        // see static method in TFinishPosition
        // copied to avoid circular dependency warning
        switch (order) {
            case Constants.NOF: return "No Finish";
            case Constants.DNC: return "dnc";
            case Constants.DNS: return "dns";
            case Constants.DNF: return "dnf";
            case Constants.TLE: return "tle";
            default: return order.toString();
        }
    }

    ToString2(inP: TRSPenalty, showPts: boolean): string {
        let pen: number = inP.Penalty;
        if (pen === 0)
            return "";

        let sb = "";
        if ((inP.Penalty & Constants.NF) !== 0) {
            sb += this.FinishPositionToString(pen & Constants.NF);
            sb += ",";
        }

        pen = (inP.Penalty & Constants.DM);
        if (pen === Constants.DSQ)
            sb += "DSQ,";
        if (pen === Constants.DNE)
            sb += "DNE,";
        if (pen === Constants.RAF)
            sb += "RAF,";
        if (pen === Constants.OCS)
            sb += "OCS,";
        if (pen === Constants.BFD)
            sb += "BFD,";
        if (pen === Constants.DGM)
            sb += "DGM,";
        if (pen === Constants.UFD)
            sb += "UFD,";

        pen = (inP.Penalty & Constants.OM);
        if ((pen & Constants.CNF) !== 0)
            sb += "CNF,";
        if ((pen & Constants.ZFP) !== 0)
            sb += "ZFP,";
        if ((pen & Constants.AVG) !== 0)
            sb += "AVG,";
        if ((pen & Constants.SCP) !== 0) {
            sb += inP.Percent.toString();
            sb += "%,";
        }
        if ((pen & Constants.STP) !== 0) {
            sb += "STP";
            if (showPts) {
                sb += "/";
                sb += inP.Points.toString();
            }
            sb += ",";
        }
        if ((pen & Constants.MAN) !== 0) {
            sb += "MAN";
            if (showPts) {
                sb += "/";
                sb += inP.Points.toString();
            }
            sb += ",";
        }
        if ((pen & Constants.RDG) !== 0) {
            sb += "RDG";
            if (showPts) {
                sb += "/";
                sb += inP.Points.toString();
            }
            sb += ",";
        }
        if ((pen & Constants.DPI) !== 0) {
            sb += "DPI";
            if (showPts) {
                sb += "/";
                sb += inP.Points.toString();
            }
            sb += ",";
        }

        if (sb.length > 1 && sb.endsWith(",")) {
            sb = sb.substring(0, sb.length - 2);
        }

        return sb;
    }

    ToStringN(pen: number): string {
        return this.ToStringNB(pen, true);
    }

    ToStringNB(pen: number, doShort: boolean): string {
        return this.ToString2(new TRSPenalty(pen), doShort);
    }

    parsePenalty(pen: TRSPenalty, penString: string): void {
        const newpen: TRSPenalty = TRSPenalty.ParsePenalty(penString);
        pen.Points = newpen.Points;
        pen.fPenalty = newpen.fPenalty;
        pen.Percent = newpen.Percent;
    }

}
