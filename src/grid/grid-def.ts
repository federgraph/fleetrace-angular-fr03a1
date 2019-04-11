import { TStringList } from "../util/fb-strings";

export class TTableCell {
    th: boolean = false;
    td: boolean = false;
    align: string = "";
    color: string = "";
    text: string = "";
  }
  
export class TTableRow {
    align: string = "";
    Cols: Array<TTableCell> = [];
}

export class TTable {
    Rows: Array<TTableRow> = [];
}

export class TColCaptionBag {
    private FSL: TStringList;
    IsPersistent: boolean;

    constructor() {
        this.FSL = new TStringList();
        this.IsPersistent = false;      
    }
    
    private getCount(): number {
        return this.FSL.Count;        
    }
    private getText(): string {
        return this.FSL.Text;
    }
    private setText(value: string) {
        this.FSL.Text = value;
    }

    Clear() {
        this.FSL.Clear();
    }

    getCaption(key: string): string {
        const k = key + '=';
        let s: string;
        for (let i = 0; i < this.FSL.SL.length; i++) {
            s = this.FSL.SL[i];
            if (s.startsWith(k))
                return this.FSL.ValueFromIndex(i);
        }        
        return "";
    }

    setCaption(key: string, value: string) {
        const k = key + '=';
        let s: string;
        for (let i = 0; i < this.FSL.SL.length; i++) {
            s = this.FSL.SL[i];
            if (s.startsWith(k))
                return this.FSL.SL[i] = k + value;
        }                
        this.IsPersistent = true;      
    }
    
    get Count(): number { return this.getCount(); }
    get Text(): string { return this.getText(); }
    set Text(value: string) { this.setText(value); }
}

export class TColGridGlobals {
    static GetCellPropCounter: number = 0;
    static ColCaptionBag: TColCaptionBag = new TColCaptionBag();
    static UseDoubleBufferForGrid = false;

    constructor() {
        TColGridGlobals.ColCaptionBag = new TColCaptionBag();
    }
}

export enum TColGridColorClass {
    Blank,
    DefaultColor,
    AlternatingColor,
    FocusColor,
    EditableColor,
    AlternatingEditableColor,
    CurrentColor,
    TransColor,
    HeaderColor,
    CustomColor
}

export enum TShiftState {
    ssLeft,
    ssRight
}
export type TNotifyEvent = (sender: object) => void;
export type TKeyEvent = (Sender: object, Key: Number, Shift: TShiftState) => void;

export enum TColAlignment {
  taLeftJustify,
  taRightJustify,
  taCenter
}

export type TColor = number;

export enum TColType {
    colTypeInteger,
    colTypeString,
    colTypeRank,
    colTypeMemo
}

export class TDisplayOrderItem {
    CellString: string = "";
    RowIndex: number = 0;
    equals(that: TDisplayOrderItem): boolean {
        return (this.RowIndex === that.RowIndex && this.CellString === that.CellString);
    }    
}

export class TDisplayOrderList {

    Descending: boolean;
    Items: TDisplayOrderItem[];

    constructor() {
        this.Descending = false;
        this.Items = [];
    }

    get Count(): number { return this.Items.length; }

    Clear() {
        this.Items = [];
    }
    
    AddNumber(s: string, i: number): void {
        const cr = new TDisplayOrderItem();
        cr.CellString = s;
        cr.RowIndex = i;
        this.Items.push(cr);
    }
    
    GetDisplayIndex(i: number): number {
        if (i >= 0 && i < this.Items.length)
        {
          if (this.Descending)
            return this.Items[this.Items.length-1-i].RowIndex;
          else
            return this.Items[i].RowIndex;
        }
        else
          return i;
    }

    Sort() {
        this.Items.sort(this.CompareDisplayOrederItems);
    }

    CompareDisplayOrederItems(left: TDisplayOrderItem, right: TDisplayOrderItem): number {
        if (left.CellString < right.CellString)
          return -1;
        else if (left.CellString === right.CellString)
          return 0;
        else
            return 1;
    }    
    
    toString() {
        let s = "";
        const crlf = '\r\n';
        for(let i = 0; i < this.Count; i++) {
            s += `${i} ${this.Items[i].CellString}${crlf}`;
        }
        return s;
    }
  
  }
