export class TStringList {
    SL: Array<string> = [];

    QuoteChar = '"';
    Delimiter = ';';

    Delete(i: number) {
        this.SL.splice(i, 1);
    }
       
    Items(i: number): string {
        return this.SL[i];
    }

    get Count(): number {
        return this.SL.length;
    }

    Clear(): void {
        this.SL = [];
    }

    Insert(index: number, value: string): void {
        this.SL.splice(index, 0, value);
    }
    
    Add(s: string): void {
        this.SL.push(s);
    }

    Update(index: number, value: string) {
        this.SL[index] = value;
    }
    
    IndexOf(s: string): number {
        return this.SL.findIndex(t => s === t);
    }

    Assign(source: TStringList) {
        for (let i = 0; i < this.Count; i++)
            this.SL[i] = source.SL[i];
    }

    ValueFromIndex(index: number): string {
        if (index > -1 && index < this.SL.length) {
            const s = this.SL[index];
            const i = s.indexOf('=');
            if (i > -1) {            
                const v = s.substring(i + 1).trim();
                return v;
            }
        }
        return "";
    }

    KeyFromIndex(index: number): string {
        if (index > -1 && index < this.SL.length) {
            const s = this.SL[index];
            const i = s.indexOf('=');
            if (i > -1) {            
                const k = s.substring(0, i).trim();
                return k;
            }
        }
        return "";
    }
    
    get Text(): string {
        let s = "";
        for (let i = 0; i < this.SL.length; i++) {
            s += this.SL[i];
            s += '\r\n';
        }
        return s;
    }
    set Text(value: string) {
        if (value) 
        this.SL = value.split(/\r?\n/);
        else
          this.Clear();
    }
    
    set ConvertText(value: string) { 
        this.SL = value.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);        
    }

    get CommaText(): string {
        let s = "";
        for (let i = 0; i < this.SL.length-1; i++) {
            s += this.SL[i];
            s += ',';
        }
        if (this.SL.length > 0)
            s += this.SL[this.SL.length-1];
        return s;
    }
    set CommaText(value: string) {
        this.SL = value.split(',');
    }

    MyStringListCompareText(Index1: number, Index2: number): number {    
       const s1 = this.Items(Index1);
       const s2 = this.Items(Index2);
       
       if (s1 > s2)
        return 1;
       else if (s2 > s1)
         return -1;
       else
         return 0;
    }        
   
    get DelimitedText(): string {
        let s = "";
        for (let i = 0; i < this.SL.length-1; i++) {
            s += this.SL[i];
            s += this.Delimiter;
        }
        if (this.SL.length > 0)
            s += this.SL[this.SL.length-1];
        return s;
    }

    set DelimitedText(value: string) {
        this.SL = value.split(this.Delimiter);
    }
    
    LoadFromFile(fn: string) {

    }
    SaveToFile(fn: string) {

    }

}

export class StringBuilder {
    private accu: string;

    constructor(s: string = '') {
        this.accu = s;
    }
    Append(s: string) {
        this.AppendString(s);
    }
    AppendLine(s: string) {
        this.Append(s);
        this.Append('\r\n');
    }
    AppendString(s: string) {
        this.accu = this.accu + s;
    }
    AppendNumber(i: number) {
        this.AppendString(i.toString(i));
    }
    Insert(p: number, s: string) {
        this.accu = this.accu.substring(0, p - 1) + s + this.accu.substring(p);
    }
    toString(): string {
        return this.accu;
    }
}

