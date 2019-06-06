import { TStringList } from '../util/fb-strings';
import { TLineParser, TUtils, TStringContainer } from '../util/fb-classes';
import { TMsgToken } from './bo-msg-token';
import { TBO } from '../fr/fr-bo';
import { FieldNames } from '../col/stammdaten/stammdaten-fieldnames';

export enum TCommandPathError {
    Error_None,
    Error_TokenB,
    Error_TokenZ,
    Error_RunID,
    Error_Bib,
    Error_Command,
    Error_Value,
    Error_Pos,
    Error_Athlete,
    Error_MsgID,
    Error_Option
}

export enum TMsgType {
    None,
    Input,
    Param,
    Option,
    Prop,
    Cmd,
    Request,
    Comment,
    Test
}

export class TMsgParser extends TLineParser {

    private SLCompare: TStringList;
    private TokenContainer: TStringContainer;
    private MsgToken: TMsgToken;

    private FIsValid: boolean = false;
    private FLastError: TCommandPathError = TCommandPathError.Error_None;
     private FInput: string = '';
    private FMsgType: TMsgType = TMsgType.None;
    private FKey: string = '';
    private FValue: string = '';
    private sToken = '';
    private sRest: string = '';

    sAthlete: string = '';
    sPos: string = '';
    sMsgID: string = '';

    sDivision: string = '';
    iRace: number = 0;
    sRunID: string = '';
    sBib: string = '';
    sCommand: string = '';
    sValue: string = '';

    constructor(public BO: TBO) {
        super();
        this.SLCompare = new TStringList();
        this.TokenContainer = new TStringContainer();
        this.MsgToken = BO.MsgToken;
        this.Clear();
    }

    get MsgKey(): string { return this.FKey; }
    get MsgType(): TMsgType { return this.FMsgType; }

    protected NextToken() {
        this.TokenContainer.value = this.sToken;
        this.sRest = TUtils.Cut('.', this.sRest, this.TokenContainer);
        this.sToken = this.TokenContainer.value;
    }

    protected NextTokenX(TokenName: string): number {
        this.NextToken();
        let result = -1;
        if (this.sToken.startsWith(TokenName)) {
            const l = TokenName.length;
            this.sToken = this.sToken.substring(l);
            result = TUtils.StrToIntDef(this.sToken, -1);
        }
        return result;
    }

    protected TestTokenName(TokenName: string): boolean {
        const LongTokenName = this.MsgToken.LongToken(TokenName);
        return this.sRest.startsWith(TokenName) || this.sRest.startsWith(LongTokenName);
    }

    protected CompareToken(t: string): string {
        let s: string;
        for (let i = 0; i < this.SLCompare.Count; i++) {
            s = this.SLCompare.Items(i);
            if (t === s || t === this.MsgToken.LongToken(s)) {
                return s;
            }
        }
        if (this.IsProp(t)) {
            return t;
        }
        return '';
    }

    protected ParseLeaf(): boolean {
        this.FIsValid = false;

        // Command
        if (!this.ParseCommand()) {
            this.FLastError = TCommandPathError.Error_Command;
            return false;
        }
        // Value
        if (!this.ParseValue()) {
            this.FLastError = TCommandPathError.Error_Value;
            return false;
        }

        this.FIsValid = true;
        return true;
    }

    protected ParseDivision(): boolean {
        this.NextToken();
        this.SLCompare.Clear();
        this.SLCompare.Add(this.MsgToken.cTokenB);
        this.SLCompare.Add('*');
        this.sDivision = this.CompareToken(this.sToken);
        const result = this.sDivision !== '';
        if (!result) {
            this.FLastError = TCommandPathError.Error_TokenB;
        }
        return result;
    }

    protected ParseRunID(): boolean {
        this.NextToken();
        this.SLCompare.Clear();
        this.SLCompare.Add(this.MsgToken.cTokenRace + '1');
        this.sRunID = this.CompareToken(this.sToken);
        const result = this.sRunID !== '';
        if (!result) {
            this.FLastError = TCommandPathError.Error_RunID;
        }
        return result;
    }

    protected ParseCommand(): boolean {
        this.SLCompare.Clear();

        this.SLCompare.Add('XX');
        this.SLCompare.Add('IsRacing');

        this.SLCompare.Add('FM');
        this.SLCompare.Add('QU');
        this.SLCompare.Add('ST');
        if (this.BO != null) {
            for (let i = 0; i <= this.BO.BOParams.ITCount; i++) {
                this.SLCompare.Add('IT' + i.toString());
            }
        }
        this.SLCompare.Add('FT');
        this.SLCompare.Add('DG');
        this.SLCompare.Add('Rank');
        this.SLCompare.Add('RV');

        if (this.sPos !== '') {
            this.SLCompare.Add('SNR');
            this.SLCompare.Add('Bib');
        }

        if (this.sAthlete !== '') {
            this.SLCompare.Add('SNR');

            this.SLCompare.Add('FN');
            this.SLCompare.Add('LN');
            this.SLCompare.Add('SN');
            this.SLCompare.Add('NC');
            this.SLCompare.Add('GR');
            this.SLCompare.Add('PB');

            this.SLCompare.Add(FieldNames.FN);
            this.SLCompare.Add(FieldNames.LN);
            this.SLCompare.Add(FieldNames.SN);
            this.SLCompare.Add(FieldNames.NC);
            this.SLCompare.Add(FieldNames.GR);
            this.SLCompare.Add(FieldNames.PB);

            for (let j = 1; j <= this.BO.BOParams.FieldCount; j++) {
                this.SLCompare.Add('N' + j.toString());
            }
        }

        this.SLCompare.Add('Count');

        this.sCommand = this.CompareToken(this.sRest);
        return (this.sCommand !== '');
    }

    protected ParseAthlete(): boolean {
        let result = false;
        const temp = this.NextTokenX(this.MsgToken.cTokenID);
        if (temp > -1) {
            this.sAthlete = this.sToken;
            result = true;
        } else {
            this.sAthlete = '';
            result = false;
        }
        if (!result) {
            this.FLastError = TCommandPathError.Error_Athlete;
        }
        return result;
    }

    protected ParseRace(): boolean {
        let result = false;
        const temp = this.NextTokenX(this.MsgToken.cTokenRace);
        if (temp > -1) {
            this.sRunID = this.MsgToken.cTokenRace + this.sToken;
            this.iRace = TUtils.StrToIntDef(this.sToken, 0);
            result = true;
        } else {
            this.sRunID = '';
            result = false;
        }
        if (!result) {
            this.FLastError = TCommandPathError.Error_TokenZ;
        }
        return result;
    }

    protected ParseBib(): boolean {
        let result = false;
        const temp = this.NextTokenX(this.MsgToken.cTokenBib);
        if (temp > -1) {
            this.sBib = this.sToken;
            result = true;
        } else {
            this.sBib = '';
            result = false;
        }
        if (!result) {
            this.FLastError = TCommandPathError.Error_Bib;
        }
        return result;
    }

    protected ParsePos(): boolean {
        let result = false;
        const temp = this.NextTokenX('Pos');
        if (temp > -1) {
            this.sPos = this.sToken;
            result = true;
        } else {
            this.sPos = '';
            result = false;
        }
        if (!result) {
            this.FLastError = TCommandPathError.Error_Pos;
        }
        return result;
    }

    protected ParseMsgID(): boolean {
        let result = false;
        const temp = this.NextTokenX('Msg');
        if (temp > -1) {
            this.sMsgID = this.sToken;
            result = true;
        } else {
            this.sMsgID = '';
            result = false;
        }
        if (!result) {
            this.FLastError = TCommandPathError.Error_MsgID;
        }

        return result;
    }

    ParseTimeValue(): boolean {
        return true;
    }

    ParseStatusValue(): boolean {
        return true;
        // ###
        /*
        return ((FValue === 'dnf')
          || (FValue === 'dsq')
          || (FValue === 'dns')
          || (FValue === 'ok')
          || (FValue === '*'));
        */
    }

    protected ParseValue(): boolean {
        this.sValue = '';
        let result = false;

        if (this.sCommand === 'XX') {
            result = true;
        } else if (this.sCommand === 'QU') {
            result = this.ParseStatusValue();
        } else if (this.IsTimeCommand()) {
            result = this.ParseTimeValue();
        } else if ((this.sCommand === 'DG')
            || (this.sCommand === 'Bib')
            || (this.sCommand === 'SNR')
            || (this.sCommand === 'Count')
            || (this.sCommand === 'Rank')
            || (this.sCommand === 'FM')
        ) {
            result = this.ParsePositiveIntegerValue();
        } else if (this.IsAthleteCommand()) {
            result = true;
        } else if (this.sCommand === 'IsRacing') {
            result = this.ParseBooleanValue();
        } else if (this.sCommand === 'RV') {
            result = true; // ParseRaceValue()
        }

        if (result) {
            this.sValue = this.FValue;
        }

        return result;
    }

    protected ParseBooleanValue(): boolean {
        const s: string = this.FValue.toLowerCase();
        return ((s === 'false') || (s === 'true'));
    }

    protected ParsePositiveIntegerValue(): boolean {
        return TUtils.StrToIntDef(this.FValue, -1) > -1;
    }

    protected ParseIntegerValue(): boolean {
        return TUtils.StrToIntDef(this.FValue, Number.MAX_SAFE_INTEGER) !== Number.MAX_SAFE_INTEGER;
    }

    private IsAthleteCommand(): boolean {
        return (
            (this.sCommand === FieldNames.FN)
            || (this.sCommand === FieldNames.LN)
            || (this.sCommand === FieldNames.SN)
            || (this.sCommand === FieldNames.NC)
            || (this.sCommand === FieldNames.GR)
            || (this.sCommand === FieldNames.PB)

            || (this.sCommand === 'FN')
            || (this.sCommand === 'LN')
            || (this.sCommand === 'SN')
            || (this.sCommand === 'NC')
            || (this.sCommand === 'GR')
            || (this.sCommand === 'PB')

            || this.IsProp(this.sCommand)

            || this.IsNameCommand(this.sCommand)
        );
    }

    protected IsNameCommand(Token: string): boolean {
        if (Token == null) {
            return false;
        }
        if (Token.length < 2) {
            return false;
        }
        if (!Token.startsWith('N')) {
            return false;
        }
        if (TUtils.StrToIntDef(Token.substring(1), -1) === -1) {
            return false;
        }
        return true;
    }

    private IsTimeCommand(): boolean {
        return ((this.sCommand === 'ST')
            || (this.sCommand.substring(0, 2) === 'IT')
            || (this.sCommand === 'FT'));
    }

    protected IsRunID(): boolean {
        const RaceCount: number = this.BO.BOParams.RaceCount;
        const s = this.sRunID.substring(0, 1);
        const i = TUtils.StrToIntDef(this.sRunID.substring(1), -1);
        return (s === this.MsgToken.cTokenRace && i > 0 && i <= RaceCount);
    }

    protected IsProp(Token: string): boolean {
        return Token.startsWith('Prop_');
    }

    protected ParseKeyValue(sKey: string, sValue: string): boolean {
        let result = false;
        this.Clear();
        this.FKey = sKey;
        this.FValue = sValue;
        this.FInput = sKey + '=' + sValue;
        this.sRest = sKey;

        if (this.TestTokenName(this.MsgToken.cTokenA)) {
            this.NextToken();
        }

        if (!this.ParseDivision()) {
            return false;
        }

        if (this.TestTokenName('Msg')) {
            if (!this.ParseMsgID()) {
                return false;
            }
        }

        if (this.ParseLeaf()) {
            return true;
        }

        if (this.TestTokenName(this.MsgToken.cTokenID)) {
            if (!this.ParseAthlete()) {
                return false;
            }
        } else {
            if (this.TestTokenName(this.MsgToken.cTokenRace)) {
                if (!this.ParseRace()) {
                    return false;
                }
            } else if (!this.ParseRunID()) {
                // RunID
                return false;
            }

            if (this.TestTokenName('STL')) {
                this.NextToken();

                // property Startlist.Count
                if (this.ParseLeaf()) {
                    return true;
                }

                // Pos
                if (!this.ParsePos()) {
                    return false;
                }
            } else if (this.IsRunID()) {
                if (this.TestTokenName('Pos')) {
                    // Pos
                    if (!this.ParsePos()) {
                        return false;
                    }
                } else {
                    // Bib
                    if (!this.ParseBib()) {
                        return false;
                    }
                }
            }
        }

        result = this.ParseLeaf();
        return result;
    }

    Clear() {
        this.sAthlete = '';
        this.sDivision = '';
        this.sRunID = '';
        this.sBib = '';
        this.sCommand = '';
        this.sValue = '';
        this.sPos = '';

        this.FLastError = TCommandPathError.Error_None;
        this.FIsValid = false;
        this.FInput = '';
        this.FKey = '';
        this.FValue = '';
        this.FMsgType = TMsgType.None;

        this.sToken = '';
        this.sRest = '';
        this.sMsgID = '';
        this.iRace = 0;
    }

    Parse(s: string) {
        this.SL.Clear();

        let temp: string;
        const i = s.indexOf('=');
        if (i > -1) {
            let s1: string = s.substring(0, i);
            s1 = s1.trim();
            let s2: string = s.substring(i + 1);
            s2 = s2.trim();
            temp = s1 + '=' + s2;
        } else {
            temp = s.replace(' ', '');
        }

        if (temp.indexOf('=') === -1) {
            temp = temp + '=';
        }
        this.SL.Add(temp);
        this.FKey = this.SL.KeyFromIndex(0);
        this.FValue = this.SL.ValueFromIndex(0);

        return this.ParseKeyValue(this.FKey, this.FValue);

    }
}
