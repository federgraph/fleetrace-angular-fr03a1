import { TStringList } from '../util/fb-strings';
import { TUtils } from '../util/fb-classes';
import { TEnumSet } from '../util/fb-enumset';

/**
 * APPENDIX A - SCORING
 * A1 NUMBER OF RACES
 * The number of races scheduled and the number required to be completed to
 * constitute a series shall be stated in the sailing instructions.
 *
 * A2 SERIES SCORES
 * Each boat's series score shall be the total of her race scores excluding her
 * worst score. (The sailing instructions may make a different arrangement by
 * providing, for example, that no score will be excluded, that two or more
 * scores will be excluded, or that a specified number of scores will be
 * excluded if a specified number of races are completed.) If a boat has two
 * or more equal worst scores, the score( s) for the race( s) sailed earliest
 * in the series shall be excluded. The boat with the lowest series score wins
 * and others shall be ranked accordingly.
 *
 * A3 STARTING TIMES AND FINISHING PLACES
 * The time of a boat's starting signal shall be her starting time, and the order
 * in which boats finish a race shall determine their finishing places. However,
 * when a handicap system is used a boat's elapsed time, corrected to the nearest
 * second, shall determine her finishing place.
 *
 * A4 LOW POINT AND BONUS POINT SYSTEMS
 * Most series are scored using either the Low Point System or the Bonus Point
 * System. The Low Point System uses a boat's finishing place as her race score.
 * The Bonus Point System benefits the first six finishers because of the greater
 * difficulty in advancing from fourth place to third, for example, than from
 * fourteenth place to thirteenth. The system chosen may be made to apply by
 * stating in the sailing instructions that, for example, 'The series will be
 * scored as provided in Appendix A of the racing rules using the
 * [Low] [Bonus] Point System.'
 *
 * A4.1 Each boat starting and finishing and not thereafter retiring, being
 * penalized or given redress shall be scored points as follows:
 * Finishing place Low Point System Bonus Point System
 *
 * First 1 0
 * Second 2 3
 * Third 3 5.7
 * Fourth 4 8
 * Fifth 5 10
 * Sixth 6 11.7
 * Seventh 7 13
 * Each place thereafter Add 1 point Add 1 point
 *
 * A4.2 A boat that did not start, did not finish, retired after finishing or was
 * disqualified shall be scored points for the finishing place one more than the
 * number of boats entered in the series. A boat penalized under rule 30.2 or 44.3
 * shall be scored points as provided in rule 44.3(c).
 *
 * A5 SCORES DETERMINED BY THE RACE COMMITTEE
 * A boat that did not start, comply with rule 30.2 or 30.3, or finish, or that
 * takes a penalty under rule 44.3 or retires after finishing, shall be scored
 * accordingly by the race committee without a hearing. Only the protest committee
 * may take other scoring actions that worsen a boat's score.
 *
 * A6 CHANGES IN PLACES AND SCORES OF OTHER BOATS
 * (a) If a boat is disqualified from a race or retires after finishing, each boat
 * that finished after her shall be moved up one place.
 *
 * (b) If the protest committee decides to give redress by adjusting a boat's
 * score, the scores of other boats shall not be changed unless the protest
 * committee decides otherwise.
 *
 * A7 RACE TIES
 * If boats are tied at the finishing line or if a handicap system is used and
 * boats have equal corrected times, the points for the place for which the boats
 * have tied and for the place(s) immediately below shall be added together and
 * divided equally. Boats tied for a race prize shall share it or be given
 * equal prizes.
 *
 * A8 SERIES TIES
 * A8.1 If there is a series score tie between two or more boats, each boat's
 * race scores shall be listed in order of best to worst, and at the first point(s)
 * where there is a difference the tie shall be broken in favour of the boat(s)
 * with the best score(s). No excluded scores shall be used.
 *
 * A8.2 If a tie remains between two boats, it shall be broken in favour of the
 * boat that scored better than the other boat in more races. If more than two
 * boats are tied, they shall be ranked in order of the number of times each boat
 * scored better than another of the tied boats. No race for which a tied boat's
 * score has been excluded shall be used. [Rule A8.2 is deleted and rule A8.3 is
 * renumbered as A8.2. Change effective as from 1 June 2002.]
 *
 * A8.3 2 If a tie still remains between two or more boats, they shall be ranked
 * in order of their scores in the last race. Any remaining ties shall be broken
 * by using the tied boats' scores in the next-to-last race and so on until all
 * ties are broken. These scores shall be used even if some of them are excluded
 * scores.
 *
 * A9 RACE SCORES IN A SERIES LONGER THAN A REGATTA
 * For a series that is held over a period of time longer than a regatta, a boat
 * that came to the starting area but did not start, did not finish, retired after
 * finishing or was disqualified shall be scored points for the finishing place
 * one more than the number of boats that came to the starting area. A boat that
 * did not come to the starting area shall be scored points for the finishing
 * place one more than the number of boats entered in the series.
 *
 * A10 GUIDANCE ON REDRESS
 * If the protest committee decides to give redress by adjusting a boat's score
 * for a race, it is advised to consider scoring her
 *
 * (a) points equal to the average, to the nearest tenth of a point (0.05 to be rounded upward),
 * of her points in all the races in the series except the race in question;
 *
 * (b) points equal to the average, to the nearest tenth of a point (0.05 to be
 * rounded upward), of her points in all the races before the race in question;
 *
 * or
 *
 * (c) points based on the position of the boat in the race at the time of the
 * incident that justified redress.
 *
 * A11 SCORING ABBREVIATIONS
 * These abbreviations are recommended for recording the circumstances described:
 * DNC Did not start; did not come to the starting area
 * DNS Did not start (other than DNC and OCS)
 * OCS Did not start; on the course side of the starting line and broke rule 29.1 or 30.1
 * ZFP 20% penalty under rule 30. 2
 * UFD U-Flag Disqualification under rule 30.3
 * BFD Black-Flag Disqualification under rule 30.4
 * SCP Took a scoring penalty under rule 44.3
 * DNF Did not finish
 * RAF Retired after finishing
 * DSQ Disqualification
 * DNE Disqualification not excludable under rule 88.3(b)
 * RDG Redress given
 * DGM Disqualification great misconduct
 * DPI Descretionary penalty imposed
 *
 */

export enum TISAFPenaltyDSQ {
    NoDSQ,
    DSQ,
    DNE,
    RAF,
    OCS,
    BFD,
    DGM,
    UFD
}

export enum TISAFPenaltyNoFinish {
    NoFinishBlank,
    TLE,
    DNF,
    DNS,
    DNC,
    NOF
}

export enum TISAFPenaltyOther {
    STP, // standard penalty
    TIM, // time limit
    ZFP,
    AVG, // average
    SCP, // scoring penalty, pct (percent) of finish position
    RDG, // redress given
    MAN, // manual
    CNF, // check-in failure
    TMP, // scoring time penalty, pct (percent) of time
    DPI  // descretionary penalty imposed
}

export class TPenaltyISAF { // extends TPenalty

    static TISAFPenaltyOtherLow: number = TISAFPenaltyOther.STP;
    static TISAFPenaltyOtherHigh: number = TISAFPenaltyOther.DPI;

    /*
    Penalty values are/should be used only internally to the program and NOT
    written out to persistent storage (that is done by string name).
    Therefore it should be safe to reset the values, provided the orders are
    not changed and the types of penalties keep their bit-boundaries straight.
    */

    /* Enum of
    Disqualification penalties - NOT bitwise, lower 3 bits.

    These are the various ways a boat can be disqualified.
    These are not bitwise, as a boat can only be disqualified once.

    But a boat can be disqualified with or without a valid finish.
    So, a boat can carry both a non-finish penalty and a disqualification penalty.
    */
    static readonly ISAF_DSQ = 0x0001; // Disqualification
    // 0000 0000 0000 0001;

    static readonly ISAF_DNE = 0x0002; // Disqualification not excludable under rule 88.3(b)
    // 0000 0000 0000 0010;

    static readonly ISAF_RAF = 0x0003; // Retired after finishing
    // 0000 0000 0000 0011;

    static readonly ISAF_OCS = 0x0004; // Did not start; on the course side of the starting line and broke rule 29.1 or 30.1
    // 0000 0000 0000 0100;

    static readonly ISAF_BFD = 0x0005; // Disqualification under rule 30.3 - black flag
    // 0000 0000 0000 0101;

    static readonly ISAF_DGM = 0x0006; // Disqualification Great Miscoduct
    // 0000 0000 0000 0110;

    static readonly ISAF_UFD = 0x0007; // Disqualification under rule 30.4 - U-Flag
    // 0000 0000 0000 0111;

    /* TEnumSet of
    Other scoring penalties - bitwise, middle bits used,
    but not the lower 3 bits (Disqualification penalties, not bitwise)
    or the upper 3 bits (NO-Finish penalties, not bitwise)

    These are the various other ways a boat can be 'dinged'.
    This includes check-in penalties, redress, percentage penalties, etc.
    These ARE Bit-wise penalties, and a boat can have more than one of them.
    Also, a boat CAN have a non-finish penalty and 'other' penalty,
    but a boat may not have a disqualification penalty and 'other' penalty.
    */

    static readonly ISAF_STP = 0x0008; // available
    // 0000 0000 0000 1000; 0.008
    static readonly ISAF_TIM = 0x0010; // time limit
    // 0000 0000 0001 0000; 0.016
    static readonly ISAF_ZFP = 0x0020; // 20% penalty under rule 30. 2
    // 0000 0000 0010 0000; 0.032
    static readonly ISAF_AVG = 0x0040; // average
    // 0000 0000 0100 0000; 0.064
    static readonly ISAF_SCP = 0x0080; // Took a scoring penalty under rule 44.3
    // 0000 0000 1000 0000; 0.128
    static readonly ISAF_RDG = 0x0100; // Redress given
    // 0000 0001 0000 0000; 0.256
    static readonly ISAF_MAN = 0x0200; // manual
    // 0000 0010 0000 0000; 0.512
    static readonly ISAF_CNF = 0x0400; // check-in failure
    // 0000 0100 0000 0000; 1.024
    static readonly ISAF_TMP = 0x0800; // scoring time penalty, pct (percent) of time
    // 0000 1000 0000 0000; 2.048
    static readonly ISAF_DPI = 0x1000; // descretionary penalty imposed
    // 0001 0000 0000 0000; 4.096

    // highest possible real finish
    static readonly ISAF_HIF = 0x1FFF;
    // 0001 1111 1111 1111; 8.191

    /* Enum of
    Non-finishing penalties - NOT bitwise, upper 3 bits

    These show up in the finish order column,
    and can get set as Finish 'Positions' - means no finish recorded yet.
    Non-Finish penalty values are for boats that do not have a valid Finish.
    These are used in BOTH the FinishPosition class and in the Penalty class.
    These are not-bitwise penalties and a boat cannot have more than one
    of these at a time.
    */

    // 08.192
    // available              = 0x2000; // available
    // 0010 0000 0000 0000

    // 16.384
    // available              = 0x4000; // available
    // 0100 0000 0000 0000

    // 24.576
    static readonly ISAF_TLE = 0x6000; // an amount of time applied to elapsed time
    // 0110 0000 0000 0000

    // 32.768
    static readonly ISAF_DNF = 0x8000; // Did not finish
    // 1000 0000 0000 0000

    // 40.960
    static readonly ISAF_DNS = 0xA000; // Did not start (other than DNC and OCS)
    // 1010 0000 0000 0000

    // 49.152
    static readonly ISAF_DNC = 0xC000; // Did not come to the starting area
    // 1100 0000 0000 0000

    // 57.344
    static readonly ISAF_NOF = 0xE000; // clean, but no finish recorded yet
    // 1110 0000 0000 0000


    /**
     * These masks break up the 32-bit Integer into the portions reserved for each penalty type.
     */

    // 0.000
    static readonly ISAF_NOP = 0x0000;
    // 0000 0000 0000 0000 0000

    // 0.007
    static readonly ISAF_DSQ_MASK = 0x0007;
    // 0000 0000 0000 0000 0111

    // 8.184
    static readonly ISAF_OTH_MASK = 0x1FF8;
    // 0001 1111 1111 1000

    // 57.344
    static readonly ISAF_NOF_MASK = 0xE000;
    // 1110 0000 0000 0000

    private FPenaltyDSQ: TISAFPenaltyDSQ;
    private FPenaltyNoFinish: TISAFPenaltyNoFinish;
    private FDSQPending: boolean = false;
    public PenaltyOther: TEnumSet;

    Points: number = 0.0;
    Percent: number = 0;
    TimePenalty: number = 0;
    Note: string = '';

    public SLPenalty: TStringList = new TStringList();

    static PenaltyDSQString(o: TISAFPenaltyDSQ): string {
        switch (o) {
            case TISAFPenaltyDSQ.NoDSQ: return '';
            case TISAFPenaltyDSQ.DSQ: return 'DSQ';
            case TISAFPenaltyDSQ.DNE: return 'DNE';
            case TISAFPenaltyDSQ.RAF: return 'RAF';
            case TISAFPenaltyDSQ.OCS: return 'OCS';
            case TISAFPenaltyDSQ.BFD: return 'BFD';
            case TISAFPenaltyDSQ.DGM: return 'DGM';
            case TISAFPenaltyDSQ.UFD: return 'UFD';
        }
        return '';
    }

    static PenaltyNoFinishString(o: TISAFPenaltyNoFinish): string {
        switch (o) {
            case TISAFPenaltyNoFinish.NoFinishBlank: return '';
            case TISAFPenaltyNoFinish.TLE: return 'TLE';
            case TISAFPenaltyNoFinish.DNF: return 'DNF';
            case TISAFPenaltyNoFinish.DNS: return 'DNS';
            case TISAFPenaltyNoFinish.DNC: return 'DNC';
            case TISAFPenaltyNoFinish.NOF: return 'NOF';
        }
        return '';
    }

    static PenaltyOtherString(o: TISAFPenaltyOther): string {
        switch (o) {
            case TISAFPenaltyOther.STP: return 'STP';
            case TISAFPenaltyOther.TIM: return 'TIM';
            case TISAFPenaltyOther.ZFP: return 'ZFP';
            case TISAFPenaltyOther.AVG: return 'AVG';
            case TISAFPenaltyOther.SCP: return 'SCP';
            case TISAFPenaltyOther.RDG: return 'RDG';
            case TISAFPenaltyOther.MAN: return 'MAN';
            case TISAFPenaltyOther.CNF: return 'CNF';
            case TISAFPenaltyOther.TMP: return 'TMP';
            case TISAFPenaltyOther.DPI: return 'DPI';
        }
        return '';
    }

    constructor() {
        this.SLPenalty.QuoteChar = '#';
        this.PenaltyOther = new TEnumSet(TPenaltyISAF.TISAFPenaltyOtherHigh);
        this.Clear();
    }

    Assign(o: TPenaltyISAF): void {
        if (o === this) {
            return;
        }
        if (o) {
            this.FPenaltyDSQ = o.FPenaltyDSQ;
            this.FPenaltyNoFinish = o.FPenaltyNoFinish;
            this.PenaltyOther.Assign(o.PenaltyOther);
            this.FDSQPending = o.FDSQPending;

            this.Points = o.Points;
            this.Percent = o.Percent;
            this.TimePenalty = o.TimePenalty;
            this.Note = o.Note;
        }
    }

    Clear(): void {
        this.FPenaltyDSQ = TISAFPenaltyDSQ.NoDSQ;
        this.FPenaltyNoFinish = TISAFPenaltyNoFinish.NoFinishBlank;
        this.PenaltyOther.Clear();
        this.FDSQPending = false;

        this.Points = 0;
        this.Percent = 0;
        this.TimePenalty = 0;
        this.Note = '';
    }

    toString(): string {
        let po: TISAFPenaltyOther;
        let s: string;

        this.SLPenalty.Clear();

        if (this.FPenaltyDSQ !== TISAFPenaltyDSQ.NoDSQ) {
            this.SLPenalty.Add(TPenaltyISAF.PenaltyDSQString(this.FPenaltyDSQ));
        }
        if (this.FPenaltyNoFinish !== TISAFPenaltyNoFinish.NoFinishBlank) {
            this.SLPenalty.Add(TPenaltyISAF.PenaltyNoFinishString(this.FPenaltyNoFinish));
        }
        for (let i = TPenaltyISAF.TISAFPenaltyOtherLow; i <= TPenaltyISAF.TISAFPenaltyOtherHigh; i++) {
            po = i as TISAFPenaltyOther;
            if (this.PenaltyOther.IsMember(i)) {
                s = TPenaltyISAF.PenaltyOtherString(po);
                if ((po === TISAFPenaltyOther.STP)) {
                    s += '/' + this.Points.toFixed(2);
                } else if ((po === TISAFPenaltyOther.MAN)) {
                    s += '/' + this.Points.toFixed(2);
                } else if ((po === TISAFPenaltyOther.RDG)) {
                    s += '/' + this.Points.toFixed(2);
                } else if ((po === TISAFPenaltyOther.DPI)) {
                    s += '/' + this.Points.toFixed(2);
                } else if ((po === TISAFPenaltyOther.SCP)) {
                    s += '/' + this.Percent.toFixed(2) + '%';
                } else if ((po === TISAFPenaltyOther.TMP)) {
                    s += '/' + this.Percent.toString() + '%';
                }
                this.SLPenalty.Add(s);
            }
        }
        if (this.SLPenalty.Count > 0) {
            return this.SLPenalty.DelimitedText;
        } else {
            return '';
        }
    }

    FromString(Value: string): boolean {
        let result = true;
        Value = Value.replace('"', '');
        this.SLPenalty.DelimitedText = Value;
        for (let i = 0; i < this.SLPenalty.Count; i++) {
            result = result && this.Parse(this.SLPenalty.SL[i]);
        }
        return result;
    }

    Invert(Value: string): string {
        let result = 'ok';
        if (!Value) {
            return result;
        }

        let pen = Value.toLowerCase();
        if (pen === '') {
            return result;
        }
        if (pen.length < 1) {
            return result;
        }

        if (Value[0] === '-') {
            if (pen === '-dsq') {
                result = TPenaltyISAF.PenaltyDSQString(this.FPenaltyDSQ);
            } else if (pen === '-f') {
                result = TPenaltyISAF.PenaltyNoFinishString(this.FPenaltyNoFinish);
            } else if (pen === '-stp') {
                result = TPenaltyISAF.PenaltyOtherString(TISAFPenaltyOther.STP);
            } else if (pen === '-tim') {
                result = TPenaltyISAF.PenaltyOtherString(TISAFPenaltyOther.TIM);
            } else if (pen === '-zfp') {
                result = TPenaltyISAF.PenaltyOtherString(TISAFPenaltyOther.ZFP);
            } else if (pen === '-avg') {
                result = TPenaltyISAF.PenaltyOtherString(TISAFPenaltyOther.AVG);
            } else if (pen === '-scp') {
                result = TPenaltyISAF.PenaltyOtherString(TISAFPenaltyOther.SCP);
            } else if (pen === '-rdg') {
                result = TPenaltyISAF.PenaltyOtherString(TISAFPenaltyOther.RDG);
            } else if (pen === '-man') {
                result = TPenaltyISAF.PenaltyOtherString(TISAFPenaltyOther.MAN);
            } else if (pen === '-cnf') {
                result = TPenaltyISAF.PenaltyOtherString(TISAFPenaltyOther.CNF);
            } else if (pen === '-tmp') {
                result = TPenaltyISAF.PenaltyOtherString(TISAFPenaltyOther.TMP);
            } else if (pen === '-dpi') {
                result = TPenaltyISAF.PenaltyOtherString(TISAFPenaltyOther.DPI);
            }
        } else {
            pen = pen.substring(0, 3);

            if (pen === 'dsq') {
                result = '-dsq';
            } else if (pen === 'dne') {
                result = '-dsq';
            } else if (pen === 'raf') {
                result = '-dsq';
            } else if (pen === 'ocs') {
                result = '-dsq';
            } else if (pen === 'bfd') {
                result = '-dsq';
            } else if (pen === 'dgm') {
                result = '-dsq';
            } else if (pen === 'ufd') {
                result = '-dsq';
            } else if (pen === 'tle') {
                result = '-f';
            } else if (pen === 'dnf') {
                result = '-f';
            } else if (pen === 'dns') {
                result = '-f';
            } else if (pen === 'dnc') {
                result = '-f';
            } else if (pen === 'stp') {
                result = '-stp';
            } else if (pen === 'tim') {
                result = '-tim';
            } else if (pen === 'zfp') {
                result = '-zfp';
            } else if (pen === 'avg') {
                result = '-avg';
            } else if (pen === 'scp') {
                result = '-scp';
            } else if (pen === 'rdg') {
                result = '-rdg';
            } else if (pen === 'man') {
                result = '-man';
            } else if (pen === 'cnf') {
                result = '-cnf';
            } else if (pen === 'tmp') {
                result = '-tmp';
            } else if (pen === 'dpi') {
                result = '-dpi';
            }
        }
        return result;
    }

    Parse(Value: string): boolean {
        const result = true;

        let val = '';
        const s = Value.toLowerCase();
        let pen = s;

        let i = s.indexOf('/'); // javascore delimiter, problem with xml-generator
        if (i < 1) {
            i = s.indexOf(':'); // alternative, normalized form
        }
        if (i > 0) {
            pen = s.substring(0, i).trim();
            val = s.substring(i + 1, s.length).trim();
        }

        if (pen === '') {
            return result;
        } else if (pen === 'ok') {
            this.Clear();
        } else if (pen === '*') {
            this.FDSQPending = true;
        } else if (pen === '-dsq') {
            this.FPenaltyDSQ = TISAFPenaltyDSQ.NoDSQ;
        } else if (pen === 'dsq') {
            this.FPenaltyDSQ = TISAFPenaltyDSQ.DSQ;
        } else if (pen === 'dne') {
            this.FPenaltyDSQ = TISAFPenaltyDSQ.DNE;
        } else if (pen === 'raf') {
            this.FPenaltyDSQ = TISAFPenaltyDSQ.RAF;
        } else if (pen === 'ocs') {
            this.FPenaltyDSQ = TISAFPenaltyDSQ.OCS;
        } else if (pen === 'bfd') {
            this.FPenaltyDSQ = TISAFPenaltyDSQ.BFD;
        } else if (pen === 'dgm') {
            this.FPenaltyDSQ = TISAFPenaltyDSQ.DGM;
        } else if (pen === 'ufd') {
            this.FPenaltyDSQ = TISAFPenaltyDSQ.UFD;
        } else if (pen === '-f') {
            this.FPenaltyNoFinish = TISAFPenaltyNoFinish.NoFinishBlank;
        } else if (pen === 'tle') {
            this.FPenaltyNoFinish = TISAFPenaltyNoFinish.TLE;
        } else if (pen === 'dnf') {
            this.FPenaltyNoFinish = TISAFPenaltyNoFinish.DNF;
        } else if (pen === 'dns') {
            this.FPenaltyNoFinish = TISAFPenaltyNoFinish.DNS;
        } else if (pen === 'dnc') {
            this.FPenaltyNoFinish = TISAFPenaltyNoFinish.DNC;
        } else if (pen === 'zfp') {
            this.PenaltyOther.Include(TISAFPenaltyOther.ZFP);
        } else if (pen === 'avg') {
            this.PenaltyOther.Include(TISAFPenaltyOther.AVG);
        } else if (pen === 'cnf') {
            this.PenaltyOther.Include(TISAFPenaltyOther.CNF);
        } else if (pen === '-stp') {
            this.PenaltyOther.Exclude(TISAFPenaltyOther.STP);
        } else if (pen === '-tim') {
            this.PenaltyOther.Exclude(TISAFPenaltyOther.TIM);
        } else if (pen === '-zfp') {
            this.PenaltyOther.Exclude(TISAFPenaltyOther.ZFP);
        } else if (pen === '-avg') {
            this.PenaltyOther.Exclude(TISAFPenaltyOther.AVG);
        } else if (pen === '-scp') {
            this.PenaltyOther.Exclude(TISAFPenaltyOther.SCP);
        } else if (pen === '-rdg') {
            this.PenaltyOther.Exclude(TISAFPenaltyOther.RDG);
        } else if (pen === '-man') {
            this.PenaltyOther.Exclude(TISAFPenaltyOther.MAN);
        } else if (pen === '-cnf') {
            this.PenaltyOther.Exclude(TISAFPenaltyOther.CNF);
        } else if (pen === '-tmp') {
            this.PenaltyOther.Exclude(TISAFPenaltyOther.TMP);
        } else if (pen === '-dpi') {
            this.PenaltyOther.Exclude(TISAFPenaltyOther.DPI);
        } else if (val.endsWith('%')) {
            this.PenaltyOther.Include(TISAFPenaltyOther.SCP as number);
            this.Percent = TUtils.StrToIntDef(val.substring(0, val.length - 1), 0);
        } else if (pen[0] === 'p') {
            this.PenaltyOther.Include(TISAFPenaltyOther.SCP as number);
            this.Percent = TUtils.StrToIntDef(val, 0);
        } else if ((pen === 'stp')  || (pen === 'rdg') || (pen === 'rdr') || (pen === 'man') || (pen === 'dpi')) {
            if (pen.substring(0, 3) === 'stp') {
                this.PenaltyOther.Include(TISAFPenaltyOther.STP);
            } else if (pen.substring(0, 3) === 'man') {
                this.PenaltyOther.Include(TISAFPenaltyOther.MAN);
            } else if (pen.substring(0, 3) === 'dpi') {
                this.PenaltyOther.Include(TISAFPenaltyOther.DPI);
            } else {
                this.PenaltyOther.Include(TISAFPenaltyOther.RDG);
            }
            // assume is form 'MAN/<pts>'
            val = val.replace(',', '.');
            this.Points = TUtils.StrToFloatDef(val, 0);
        } else if ((pen === 'tmp')) {
            this.PenaltyOther.Include(TISAFPenaltyOther.TMP);
            // assume is form 'MAN/<pts>'
            this.Percent = TUtils.StrToIntDef(val, 0);
        } else if ((pen === 'scp') || (pen === 'pct')) {
            this.PenaltyOther.Include(TISAFPenaltyOther.SCP);
            // assume is form 'SCP/<pct>'
            this.Percent = TUtils.StrToIntDef(val, 0);
        }
        return result;
    }

    protected GetIsDSQPending(): boolean {
        return this.FDSQPending;
    }

    get IsOK(): boolean {
        return (this.FPenaltyDSQ === TISAFPenaltyDSQ.NoDSQ)
            && (this.FPenaltyNoFinish === TISAFPenaltyNoFinish.NoFinishBlank)
            && (this.PenaltyOther.IsEmpty);
        // && (FDSQPending == false);
    }

    get IsOut(): boolean {
        return !this.IsOK;
    }

    protected SetIsDSQPending(Value: boolean): void {
        this.FDSQPending = Value;
    }

    protected GetAsInteger(): number {
        let result = 0;

        switch (this.FPenaltyDSQ) {
            case TISAFPenaltyDSQ.DSQ: result = result | TPenaltyISAF.ISAF_DSQ; break;
            case TISAFPenaltyDSQ.DNE: result = result | TPenaltyISAF.ISAF_DNE; break;
            case TISAFPenaltyDSQ.RAF: result = result | TPenaltyISAF.ISAF_RAF; break;
            case TISAFPenaltyDSQ.OCS: result = result | TPenaltyISAF.ISAF_OCS; break;
            case TISAFPenaltyDSQ.BFD: result = result | TPenaltyISAF.ISAF_BFD; break;
            case TISAFPenaltyDSQ.DGM: result = result | TPenaltyISAF.ISAF_DGM; break;
            case TISAFPenaltyDSQ.UFD: result = result | TPenaltyISAF.ISAF_UFD; break;
        }

        switch (this.FPenaltyNoFinish) {
            case TISAFPenaltyNoFinish.TLE: result = result | TPenaltyISAF.ISAF_TLE; break;
            case TISAFPenaltyNoFinish.DNF: result = result | TPenaltyISAF.ISAF_DNF; break;
            case TISAFPenaltyNoFinish.DNS: result = result | TPenaltyISAF.ISAF_DNS; break;
            case TISAFPenaltyNoFinish.DNC: result = result | TPenaltyISAF.ISAF_DNC; break;
            case TISAFPenaltyNoFinish.NOF: result = result | TPenaltyISAF.ISAF_NOF; break;
            case TISAFPenaltyNoFinish.NoFinishBlank: break;
        }

        for (let i = TPenaltyISAF.TISAFPenaltyOtherLow; i <= TPenaltyISAF.TISAFPenaltyOtherHigh; i++) {
            if (this.PenaltyOther.IsMember(i)) {
                const other: TISAFPenaltyOther = i as TISAFPenaltyOther;
                switch (other) {
                    case TISAFPenaltyOther.STP: result = result | TPenaltyISAF.ISAF_STP; break;
                    case TISAFPenaltyOther.TIM: result = result | TPenaltyISAF.ISAF_TIM; break;
                    case TISAFPenaltyOther.ZFP: result = result | TPenaltyISAF.ISAF_ZFP; break;
                    case TISAFPenaltyOther.AVG: result = result | TPenaltyISAF.ISAF_AVG; break;
                    case TISAFPenaltyOther.SCP: result = result | TPenaltyISAF.ISAF_SCP; break;
                    case TISAFPenaltyOther.RDG: result = result | TPenaltyISAF.ISAF_RDG; break;
                    case TISAFPenaltyOther.MAN: result = result | TPenaltyISAF.ISAF_MAN; break;
                    case TISAFPenaltyOther.CNF: result = result | TPenaltyISAF.ISAF_CNF; break;
                    case TISAFPenaltyOther.TMP: result = result | TPenaltyISAF.ISAF_TMP; break;
                    case TISAFPenaltyOther.DPI: result = result | TPenaltyISAF.ISAF_DPI; break;
                }
            }
        }

        return result;
    }

    protected SetAsInteger(Value: number): void {
        this.Clear();
        if (Value === TPenaltyISAF.ISAF_NOP) {
            return;
        }

        let i = Value & TPenaltyISAF.ISAF_DSQ_MASK;
        switch (i) {
            case TPenaltyISAF.ISAF_DSQ: this.FPenaltyDSQ = TISAFPenaltyDSQ.DSQ; break;
            case TPenaltyISAF.ISAF_DNE: this.FPenaltyDSQ = TISAFPenaltyDSQ.DNE; break;
            case TPenaltyISAF.ISAF_RAF: this.FPenaltyDSQ = TISAFPenaltyDSQ.RAF; break;
            case TPenaltyISAF.ISAF_OCS: this.FPenaltyDSQ = TISAFPenaltyDSQ.OCS; break;
            case TPenaltyISAF.ISAF_BFD: this.FPenaltyDSQ = TISAFPenaltyDSQ.BFD; break;
            case TPenaltyISAF.ISAF_DGM: this.FPenaltyDSQ = TISAFPenaltyDSQ.DGM; break;
            case TPenaltyISAF.ISAF_UFD: this.FPenaltyDSQ = TISAFPenaltyDSQ.UFD; break;
        }

        i = Value & TPenaltyISAF.ISAF_NOF_MASK;
        switch (i) {
            case TPenaltyISAF.ISAF_TLE: this.FPenaltyNoFinish = TISAFPenaltyNoFinish.TLE; break;
            case TPenaltyISAF.ISAF_DNF: this.FPenaltyNoFinish = TISAFPenaltyNoFinish.DNF; break;
            case TPenaltyISAF.ISAF_DNS: this.FPenaltyNoFinish = TISAFPenaltyNoFinish.DNS; break;
            case TPenaltyISAF.ISAF_DNC: this.FPenaltyNoFinish = TISAFPenaltyNoFinish.DNC; break;
            default: this.FPenaltyNoFinish = TISAFPenaltyNoFinish.NoFinishBlank; break;
        }

        i = Value & TPenaltyISAF.ISAF_OTH_MASK;
        if ((i & TPenaltyISAF.ISAF_STP) === TPenaltyISAF.ISAF_STP) {
            this.PenaltyOther.Include(TISAFPenaltyOther.STP);
        }
        if ((i & TPenaltyISAF.ISAF_TIM) === TPenaltyISAF.ISAF_TIM) {
            this.PenaltyOther.Include(TISAFPenaltyOther.TIM);
        }
        if ((i & TPenaltyISAF.ISAF_ZFP) === TPenaltyISAF.ISAF_ZFP) {
            this.PenaltyOther.Include(TISAFPenaltyOther.ZFP);
        }
        if ((i & TPenaltyISAF.ISAF_AVG) === TPenaltyISAF.ISAF_AVG) {
            this.PenaltyOther.Include(TISAFPenaltyOther.AVG);
        }
        if ((i & TPenaltyISAF.ISAF_SCP) === TPenaltyISAF.ISAF_SCP) {
            this.PenaltyOther.Include(TISAFPenaltyOther.SCP);
        }
        if ((i & TPenaltyISAF.ISAF_RDG) === TPenaltyISAF.ISAF_RDG) {
            this.PenaltyOther.Include(TISAFPenaltyOther.RDG);
        }
        if ((i & TPenaltyISAF.ISAF_MAN) === TPenaltyISAF.ISAF_MAN) {
            this.PenaltyOther.Include(TISAFPenaltyOther.MAN);
        }
        if ((i & TPenaltyISAF.ISAF_CNF) === TPenaltyISAF.ISAF_CNF) {
            this.PenaltyOther.Include(TISAFPenaltyOther.CNF);
        }
        if ((i & TPenaltyISAF.ISAF_TMP) === TPenaltyISAF.ISAF_TMP) {
            this.PenaltyOther.Include(TISAFPenaltyOther.TMP);
        }
        if ((i & TPenaltyISAF.ISAF_RDG) === TPenaltyISAF.ISAF_DPI) {
            this.PenaltyOther.Include(TISAFPenaltyOther.DPI);
        }
    }

    get PenaltyDSQ(): TISAFPenaltyDSQ {
        return this.FPenaltyDSQ;
    }

    get PenaltyNoFinish(): TISAFPenaltyNoFinish {
        return this.FPenaltyNoFinish;
    }

    get AsInteger(): number {
        return this.GetAsInteger();
    }
    set AsInteger(value: number) {
        this.SetAsInteger(value);
    }

}

