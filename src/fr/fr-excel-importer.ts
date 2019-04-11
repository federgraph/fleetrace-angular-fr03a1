import { TStringList } from "../util/fb-strings";
import { TUtils, TStringContainer } from "../util/fb-classes";
import { TColCaptions } from "../grid/col-captions";

export class TableID {
    static readonly NameList = 1;
    static readonly FinishList = 2;
    static readonly StartList = 3;
    static readonly ResultList = 4;
    static readonly TimeList = 5;
    static readonly FleetList = 6;
    static readonly CaptionList = 7;
    static readonly CompareList = 8;
}

export class TableToken {

    static readonly NameListStart = "NameList.Begin";
    static readonly NameListEnd = "NameList.End";

    static readonly StartListStart = "StartList.Begin";
    static readonly StartListEnd = "StartList.End";

    static readonly FinishListStart = "FinishList.Begin";
    static readonly FinishListEnd = "FinishList.End";

    static readonly TimeListStart = "TimeList.Begin"; // with Param: TimeList.Begin.R1
    static readonly TimeListEnd = "TimeList.End";

    static readonly ResultListStart = "ResultList.Begin";
    static readonly ResultListEnd = "ResultList.End";

    static readonly FleetListStart = "FleetList.Begin";
    static readonly FleetListEnd = "FleetList.End";

    static readonly CaptionListStart = "CaptionList.Begin";
    static readonly CaptionListEnd = "CaptionList.End";

    static readonly CompareListStart = 'CompareList.Begin';
    static readonly CompareListEnd = 'CompareList.End';      
}

export class TExcelImporter {
    private SL: TStringList;
    private SLToken: TStringList;
    private SLField: TStringList;
    private SLFilter: TStringList;

    private SNR: number = 0;
    private Bib: number = 0;
    private PosID: number = 0;
    private N: number = 0;
    private W: number = 0;
    private IT: number = 0;
    private TableID: number = 0;
    private Token: TStringContainer = new TStringContainer;
    private sRest: string = "";

    Delimiter: string;

    CompareList: TStringList;

    constructor() {
        this.Delimiter = ';';
        this.SL = new TStringList();
        this.SLToken = new TStringList();
        this.SLToken.Delimiter = this.Delimiter;
        // SLToken.StrictDelimiter = true;
        this.SLField = new TStringList();
        this.SLFilter = new TStringList();
        this.CompareList = new TStringList();
    }

    static Expand(EventData: string): string {
        const t: TStringList = new TStringList();
        const o: TExcelImporter = new TExcelImporter();
        o.RunImportFilter(EventData, t);
        return t.Text;
    }

    SetTableID(Value: string): void {
        if (Value.indexOf("StartList") > -1)
            this.TableID = TableID.StartList;
        else if (Value.indexOf("FleetList") > -1)
            this.TableID = TableID.FleetList;
        else if (Value.indexOf("FinishList") > -1)
            this.TableID = TableID.FinishList;
        else if (Value.indexOf("NameList") > -1)
            this.TableID = TableID.NameList;
        else if (Value.indexOf("ResultList") > -1)
            this.TableID = TableID.ResultList;
        else if (Value.indexOf("TimeList") > -1) {
            this.TableID = TableID.TimeList;
            this.W = this.ExtractRaceParam(Value);
        }
        else if (Value.indexOf("CaptionList") > -1)
            this.TableID = TableID.CaptionList;
        else if (Value.indexOf("CompareList") > -1) {
            this.TableID = TableID.CompareList;
            this.CompareList.Clear();
        }
        else
            this.TableID = 0;
    }

    private ExtractRaceParam(Value: string): number {
        this.sRest = Value;
        this.NextToken(); // TimeList
        this.NextToken(); // Begin
        return this.NextTokenX("R"); // RX
    }

    protected NextToken(): void {
        this.Token.value = this.sRest;
        this.sRest = TUtils.Cut('.', this.sRest, this.Token);
    }
    protected NextTokenX(TokenName: string): number {
        this.NextToken();
        const l = TokenName.length;
        if (this.Token.value.substring(0, l) === TokenName) {
            const st = this.Token.value.substring(l);
            return TUtils.StrToIntDef(st, -1);
        }
        return -1;
    }

    protected TrimAroundEqual(s: string): string {
        let result: string = s;
        const i: number = s.indexOf('=');
        if (i > 0)
            result = s.substring(0, i).trim() + '=' + s.substring(i + 1).trim();
        return result;
    }

    GetTestData(Memo: TStringList): void {
        Memo.Clear();
        Memo.Add("Bib;SNR;FN;LN;NC;R1;R2");
        Memo.Add("1;1000;A;a;FRA;1;2");
        Memo.Add("2;1001;B;b;GER;2;3");
        Memo.Add("3;1002;C;b;ITA;3;1");
    }

    ShowTabs(Memo: TStringList): void {
        this.SL.Text = Memo.Text;
        Memo.Clear();
        const delim = '\t';
        let s: string;
        for (let i = 0; i < this.SL.Count; i++) {
            s = this.SL.SL[i];
            s = s.replace(delim, ';');
            Memo.Add(s);
        }
    }

    Go(command: string, data: string): string {
        const Memo: TStringList = new TStringList();
        Memo.Text = data;
        if (command === "Convert")
            this.ConvertVoid(Memo, TableID.ResultList);
        if (command === "ShowTabs")
            this.ShowTabs(Memo);
        if (command === "GetTestData")
            this.GetTestData(Memo);

        return Memo.Text;
    }

    Convert(MemoText: string, tableID: number): string {
        const Memo: TStringList = new TStringList();
        Memo.Text = MemoText;
        this.ConvertVoid(Memo, tableID);
        return Memo.Text;
    }

    ConvertVoid(Memo: TStringList, tableID: number): void {
        this.SL.Clear();
        this.TableID = tableID;
        this.Transpose(Memo);
        Memo.Text = this.SL.Text;
        this.TableID = 0;
        this.SL.Clear();
    }

    private SetValue_StartList(f: string, v: string): void {
        let s: string;

        if (f === "SNR") {
            this.SNR = TUtils.StrToIntDef(v, 0);
            if (this.SNR !== 0) {
                s = `FR.*.W1.STL.Pos${this.PosID}.SNR=${this.SNR}`;
                this.SL.Add(s);
            }
        }
        else if (f === "Bib") {
            this.Bib = TUtils.StrToIntDef(v, 0);
            if (this.SNR !== 0 && this.Bib !== 0) {
                s = `FR.*.W1.STL.Pos${this.PosID}.Bib=${this.Bib}`;
                this.SL.Add(s);
            }
        }
    }

    private SetValue_NameList(f: string, v: string): void {
        let s: string;
        if (f === "FN" || f === "LN" || f === "SN" || f === "NC" || f === "GR" || f === "PB") {
            const v1: string = v.trim();
            s = `FR.*.SNR${this.SNR}.${f}=${v1}`;
            this.SL.Add(s);
        }

        else if (f.length > 1 && f[0] === 'N') {
            this.N = TUtils.StrToIntDef(f.substring(1), 0);
            if (this.N > 0 && this.SNR > 0) {
                s = `FR.*.SNR${this.SNR}.N${this.N}=${v}`;
                this.SL.Add(s);
            }
        }
    }

    private SetValue_FinishList(f: string, v: string): void {
        let s: string;
        if (f.length > 1 && f[0] === 'R') {
            this.W = TUtils.StrToIntDef(f.substring(1), 0);
            if (this.W > 0 && this.Bib > 0) {
                if (TUtils.StrToIntDef(v, 0) > 0) {
                    s = `FR.*.W${this.W}.Bib${this.Bib}.Rank=${v}`;
                    this.SL.Add(s);
                }
            }
        }
    }

    private SetValue_FleetList(f: string, v: string): void {
        let s: string;
        if (f.length > 1 && f[0] === 'R') {
            this.W = TUtils.StrToIntDef(f.substring(1), 0);
            if (this.W > 0 && this.Bib > 0) {
                if (TUtils.StrToIntDef(v, -1) > -1) {
                    // s = `FR.*.W${thisW}.Bib${this.Bib}.RV=F${v}`; //alternative                        
                    s = `FR.*.W${this.W}.Bib${this.Bib}.FM=${v}`;
                    this.SL.Add(s);
                }
            }
        }
    }

    private SetValue_TimeList(f: string, v: string): void {
        let s: string;
        if (f.length > 2 && f[0] === 'I') {
            this.IT = TUtils.StrToIntDef(f.substring(2), -1);
            if (this.IT > 0 && this.Bib > 0) {
                s = `FR.*.W${this.W}.Bib${this.Bib}.IT${this.IT}=${v}`;
                this.SL.Add(s);
            }
            if (this.IT === 0 && this.Bib > 0) {
                s = `FR.*.W${this.W}.Bib${this.Bib}.FT=${v}`;
                this.SL.Add(s);
            }
        }
        else if (f === "FT") {
            s = `FR.*.W${this.W}.Bib${this.Bib}.FT=${v}`;
            this.SL.Add(s);
        }

    }

    public SetValue_ResultList(f: string, v: string) {
        let s: string;
        if (f === "SNR") {
            this.SNR = TUtils.StrToIntDef(v, 0);
            if (this.SNR !== 0) {
                s = `FR.*.W1.STL.Pos${this.PosID}.SNR=${this.SNR}`;
                this.SL.Add(s);
            }
        }
        else if (f === "Bib") {
            this.Bib = TUtils.StrToIntDef(v, 0);
            if (this.SNR !== 0 && this.Bib !== 0) {
                s = `FR.*.W1.STL.Pos${this.PosID}.Bib=${this.Bib}`;
                this.SL.Add(s);
            }
        }

        else if (f === "FN" || f === "LN" || f === "SN" || f === "NC" || f === "GR" || f === "PB") {
            this.SetValue_NameList(f, v);
        }

        else if (f.length > 1 && f[0] === 'N') {
            this.SetValue_NameList(f, v);
        }

        else if (f.length > 1 && f[0] === 'R') {
            this.W = TUtils.StrToIntDef(f.substring(1), 0);
            if (this.W > 0 && this.Bib > 0) {
                if (TUtils.StrToIntDef(v, -1) > -1)
                    s = `FR.*.W${this.W}.Bib${this.Bib}.RV=${v}`;
                else
                    s = `FR.*.W${this.W}.Bib${this.Bib}.QU=${v}`;
                this.SL.Add(s);
            }
        }
    }

    public SetValue_CaptionList(f: string, v: string): void {
        TColCaptions.ColCaptionBag.setCaption(f, v);
    }

    public SetValue_CompareList(f: string, v: string): void {
        const b = TUtils.StrToIntDef(f, -1);
        const p = TUtils.StrToIntDef(v, -1);
        this.CompareList.Add(`${b}=${p}`); //Format('%.3d=%.5d', [b, p]));      
    }

    private SetValue(f: string, v: string): void {
        if (this.TableID === TableID.StartList)
            this.SetValue_StartList(f, v);
        else if (this.TableID === TableID.NameList)
            this.SetValue_NameList(f, v);
        else if (this.TableID === TableID.FinishList)
            this.SetValue_FinishList(f, v);
        else if (this.TableID === TableID.TimeList)
            this.SetValue_TimeList(f, v);
        else if (this.TableID === TableID.FleetList)
            this.SetValue_FleetList(f, v);
        else if (this.TableID === TableID.ResultList)
            this.SetValue_ResultList(f, v);
        else if (this.TableID === TableID.CaptionList)
            this.SetValue_CaptionList(f, v);
        else if (this.TableID === TableID.CompareList)
            this.SetValue_CompareList(f, v);
    }

    private Transpose(Memo: TStringList) {
        let s: string;
        let f: string;
        let v: string;
        let snrIndex: number;
        let snrString: string;
        let bibIndex: number;
        let bibString: string;

        this.PosID = -1;
        this.SLField.Clear();
        snrIndex = -1;
        bibIndex = -1;
        for (let i = 0; i < Memo.Count; i++) {
            s = Memo.Items(i);
            if (s.trim() === "")
                continue;
            this.PosID++;
            this.Bib = 0 + this.PosID;
            this.SLToken.Delimiter = this.Delimiter;
            this.SLToken.DelimitedText = s;
            this.SNR = 999 + this.PosID;

            if (i > 0) {
                if (this.SLToken.Count !== this.SLField.Count) {
                    continue;
                }
            }

            // get real SNR
            if (i === 0) {
                snrIndex = this.SLToken.IndexOf("SNR");
            }
            if (i > 0) {
                if (snrIndex > -1) {
                    snrString = this.SLToken.SL[snrIndex].trim();
                    this.SNR = TUtils.StrToIntDef(snrString, this.SNR);
                }
            }

            // get real Bib
            if (i === 0) {
                bibIndex = this.SLToken.IndexOf("Bib");
            }
            if (i > 0) {
                if (bibIndex > -1) {
                    bibString = this.SLToken.SL[bibIndex].trim();
                    this.Bib = TUtils.StrToIntDef(bibString, this.Bib);
                }
            }

            for (let j = 0; j < this.SLToken.Count; j++) {
                v = this.SLToken.SL[j];
                if (i === 0)
                    this.SLField.Add(v);
                else {
                    if (v.trim() === "")
                        continue;
                    f = this.SLField.SL[j];
                    this.SetValue(f, v);
                }
            }
        }

    }

    private TransposePropList(Memo: TStringList): void {
        let s: string;
        let temp: string;
        let sK: string;
        let sV: string;

        for (let l = 0; l < Memo.Count; l++) {
            s = Memo.Items(l);
            if (s.trim() === "")
                continue;

            this.SLToken.Clear();
            const i: number = s.indexOf("=");
            if (i > 0) {
                temp = s.substring(0, i).trim();
                temp += "=";
                temp += s.substring(i + 1).trim();
            }
            else {
                temp = s.trim();
                temp = temp.replace(' ', '_');
            }

            if (!temp.includes("="))
                temp = temp + "=";
            this.SLToken.Add(temp);
            sK = this.SLToken.KeyFromIndex(0);
            sV = this.SLToken.ValueFromIndex(0);

            this.SetValue(sK, sV);
        }
    }

    public RunImportFilter(Data: string, m: TStringList) {
        this.SL.Clear();

        let s: string;
        let FilterMode: boolean;

        this.TableID = 0;
        FilterMode = false;
        m.Text = Data;
        for (let i = 0; i < m.Count; i++) {
            s = m.Items(i);

            if (s === undefined)
                continue;

            s = s.trim();

            // Comment Lines
            if (s === "undefined" || s === "" || s.startsWith("//") || s.startsWith("#"))
                continue;

            // TableEndToken for key=value property list
            if (s === TableToken.CaptionListEnd
                || s === TableToken.CompareListEnd) {
                this.TransposePropList(this.SLFilter);
                this.SLFilter.Clear();
                FilterMode = false;
                this.TableID = 0;
            }

            // TableEndToken for delimited Tables
            else if (s === TableToken.NameListEnd
                || s === TableToken.StartListEnd
                || s === TableToken.FinishListEnd
                || s === TableToken.TimeListEnd
                || s === TableToken.FleetListEnd) {
                this.Transpose(this.SLFilter);
                this.SLFilter.Clear();
                FilterMode = false;
                this.TableID = 0;
            }

            // TableStartToken, may include Parameters
            else if (s === TableToken.NameListStart
                || s === TableToken.StartListStart
                || s === TableToken.FinishListStart
                || s === TableToken.FleetListStart
                || s.indexOf(TableToken.TimeListStart) > -1
                || s === TableToken.CaptionListStart
                || s === TableToken.CompareListStart) {
                this.SLFilter.Clear();
                FilterMode = true;
                this.SetTableID(s);
            }

            // Data Lines, normal Message or delimited Line
            else {
                if (FilterMode)
                    this.SLFilter.Add(s);
                else {
                    s = this.TrimAroundEqual(s);
                    this.SL.Add(s);
                }
            }
        }
        if (this.SLFilter.Count !== 0) {
            console.log("FilterError");
        }
        m.Text = this.SL.Text;
    }

}


