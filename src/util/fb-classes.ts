import { TStringList } from "./fb-strings";

// const BoolStr = ['False', 'True'];
// const BoolInt = [0, 1];
// const BoolFloat = [0.0, 1.0];

export class TimeSpan {


    h: number;
    m: number;
    s: number;
    constructor(ah: number, am: number, as: number) {
       this.h = ah;
       this.m = am;
       this.s = as;
    }

    toString(): string {
        return this.h.toString() + ':' + this.m.toString() + ':' + this.s.toString();
    }

}

export enum TConnectionStatus {
    csRed,
    csYellow,
    csGreen
}

export class TextWriter {
    private fFileName: string;
    private SL: TStringList;

    private GetStrings(): TStringList {
        return this.SL;
    }

    constructor(fn: string) {
        this.fFileName = fn;
        this.SL = new TStringList();
    }
    Write(s: string) {
        this.SL.SL[this.SL.Count - 1] = this.SL.SL[this.SL.Count - 1] + s;
    }
    WriteLine(s: string) {
        this.SL.Add(s);
    }
    Flush() {

    }
    Close() {
        //  if fFileName <> '' then
        //    SL.SaveToFile(fFileName);
    }
    get Strings(): TStringList { return this.GetStrings(); }
}

export class TStringContainer {
    constructor(public value: string = '') {
    }
    get length(): number {
        return this.value.length;
    }
    test(testValue: string): boolean {
        return this.value.substring(1, this.value.length) === testValue;
    }
}

export class TUtils {

    static BoolStr(value: boolean): string
    {
        if (value) 
            return "True";
        else
            return "False";
    }
    
    static IsFalse(Value: string): boolean {
        let result = false;
        const s = Value.toUpperCase();
        if (s === 'FALSE' || s === 'F' || s === '0')
            result = true;
        return result;
    }
    static IsTrue(value: string): boolean {
        const s = value.toUpperCase();
        if (s === 'TRUE' || s === 'T' || s === '1')
            return true;
        return false;
    }
    static IsEmptyOrTrue(Value: string): boolean {
        let result = false;
        const s = Value.toUpperCase();
        if (s === '' || s === 'TRUE' || s === 'T' || s === '1')
            result = true;
        return result;
    }
    static StartsWith(s: string, substring: string): boolean {
        return s.startsWith(substring);
    }
    static EndsWith(s: string, substring: string): boolean {
        return s.endsWith(substring);
    }
    /** 
     * Trennt einen String beim Trennzeichen
     * @param delim Trennzeichen -> erstes Auftreten = Trennposition
     * @param s input
     * @param token output, vorn abgeschnitten
     * @returns den rest
     * */
    static Cut(delim: string, s: string, token: TStringContainer): string {
        let posi: number; // Trennposition
        let result: string;
        posi = s.indexOf(delim);
        if (posi > -1) {
            token.value = s.substring(0, posi).trim();
            result = s.substring(posi + 1).trim();
        }
        else {
            token.value = s;
            result = '';
        }
        return result;
    }
    static IncludeTrailingSlash(s: string): string {
        if (!s.endsWith('/'))
            return s + '/';
        else
            return s;
    }
    static IncludeTrailingBackSlash(s: string): string {
        if (!s.endsWith('\\'))
            return s + '\\';
        else
            return s;
    }    
    static StrToBoolDef(Value: string, DefaultValue: boolean): boolean {
        if (Value === '')
            return DefaultValue;
        else
            return TUtils.IsTrue(Value);
    }

    static StringReplaceAll(s: string, search: string, replace: string): string {
        const re = new RegExp(search, 'g');        
        return s.replace(re, replace);
    }
        
    static Odd(value: number): boolean {
        return (value % 2) !== 0; 
      }
  
    static StrToIntDef(value: string, defaultResult: number) {
        let i = Number.parseInt(value, 10);
        if (Number.isNaN(i))
            i = defaultResult;
        return i;
    }
      
    static Assert(b: boolean, s: string) {
        if (!b)
            console.assert(b, s);
    }

    static IntToStr(value: number) {
        return '' + value;
    }    
    
    static StrToFloatDef(s: string, precision: number) {
        return Number.parseFloat(s);
    }    

    static EnumInt(enumSource: any): number {
        const r = enumSource as number;
        if (r === Number.NaN)
            return -1;
        return r;
    }

}

export class TTokenParser {
    sToken: string = "";
    sRest: string = "";
    Token: TStringContainer = new TStringContainer();

    NextToken(): void {
        this.Token.value = this.sToken;
        this.sRest = TUtils.Cut('.', this.sRest, this.Token);
    }
    NextTokenX(TokenName: string): number {
        const l = TokenName.length;
        if (this.sToken.substring(0, l) === TokenName) {
            this.sToken = this.sToken.substring(l + 1);
            return TUtils.StrToIntDef(this.sToken, -1);
        }
        return -1;
    }
}

export class TLineParser {
    SL: TStringList; // helper object, Commatext used to parse line when loading

    protected ParseKeyValue(Key: string, Value: string): boolean {
        // virtual, this implementation only used in unit test.
        return (Key === 'Key' && Value === 'Value');
    }

    constructor() {
        this.SL = new TStringList();
    }

    ParseLine(s: string): boolean {
        let sK: string;
        let sV: string;
        let temp: string;
        let i: number;

        this.SL.Clear();
        i = s.indexOf('=');
        if (i > -1) {
            temp = s.substring(0, i).trim() + '=' + s.substring(i + 1, s.length).trim();
        }
        else {
            temp = TUtils.StringReplaceAll(s.trim(), ' ', '_');
        }

        if (temp.indexOf('=') === 0)
            temp = temp + '=';
        this.SL.Add(temp);
        sK = this.SL.KeyFromIndex(0);
        sV = this.SL.ValueFromIndex(0);
        return this.ParseKeyValue(sK, sV);
    }
}
