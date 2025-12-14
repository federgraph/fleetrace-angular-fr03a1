import { TUtils } from '../util/fb-classes';

export enum TTimeStatus {
  tsNone,
  tsAuto,
  tsMan,
  tsTimePresent,
  tsPenalty,
}

export class TimeStatusStruct {
  getItem(status: TTimeStatus) {
    switch (status) {
      case TTimeStatus.tsNone:
        return '';
      case TTimeStatus.tsAuto:
        return 'Auto';
      case TTimeStatus.tsMan:
        return 'Man';
      case TTimeStatus.tsTimePresent:
        return 'Time';
      case TTimeStatus.tsPenalty:
        return 'Pen';
    }
    return '';
  }
}

export class TimeConst {
  static TimeNull = Number.MAX_SAFE_INTEGER;
  static TimeStatusStrings: TimeStatusStruct = new TimeStatusStruct();
}

export class TimeVar {
  minus: boolean;
  h: number;
  m: number;
  s: number;
  ss: number;
}

export class TimeStrings {
  Sign: string;
  Hour: string;
  Min: string;
  Sec: string;
  SubSec: string;
}

export class TTimeSplit {
  Value = 0;

  private FormatNumber2(aNumber: number): string {
    if (aNumber < 10) {
      return '0' + aNumber.toString();
    } else {
      return aNumber.toString();
    }
  }

  private FormatNumber4(aNumber: number): string {
    // result := Format('%.4d', [aNumber]);
    return aNumber.toFixed(4);
  }

  Split(t: TimeVar): void {
    let TimeVal: number = this.Value;
    t.minus = false;
    if (TimeVal < 0) {
      t.minus = true;
      TimeVal = Math.abs(TimeVal);
    }
    t.ss = Math.round(TimeVal % 10000);
    TimeVal = TimeVal / 10000;
    t.s = Math.round(TimeVal % 60);
    TimeVal = TimeVal / 60;
    t.m = Math.round(TimeVal % 60);
    TimeVal = TimeVal / 60;
    t.h = Math.round(TimeVal);
  }

  SplitToStrings(): TimeStrings {
    const tv: TimeVar = new TimeVar();
    this.Split(tv);

    const result = new TimeStrings();
    if (tv.minus) {
      result.Sign = 'M';
    } else {
      result.Sign = 'P';
    }

    result.Hour = this.FormatNumber2(tv.h);
    result.Min = this.FormatNumber2(tv.m);
    result.Sec = this.FormatNumber2(tv.s);
    result.SubSec = this.FormatNumber2(Math.floor(tv.ss / 100)); // Hundertstel

    return result;
  }

  AsString(): string {
    const t: TimeVar = new TimeVar();
    this.Split(t);
    t.ss = Math.floor(t.ss / 100);
    let result =
      this.FormatNumber2(t.h) +
      ':' +
      this.FormatNumber2(t.m) +
      ':' +
      this.FormatNumber2(t.s) +
      '.' +
      this.FormatNumber2(t.ss);
    if (t.minus) {
      result = '-' + result;
    }
    return result;
  }

  AsString3(): string {
    const t: TimeVar = new TimeVar();
    this.Split(t);
    t.ss = Math.floor(t.ss / 100);
    let result =
      this.FormatNumber2(t.h) +
      ':' +
      this.FormatNumber2(t.m) +
      ':' +
      this.FormatNumber2(t.s) +
      '.' +
      this.FormatNumber2(t.ss) +
      '0';
    if (t.minus) {
      result = '-' + result;
    }
    return result;
  }

  AsString4(): string {
    const t: TimeVar = new TimeVar();
    this.Split(t);
    let result =
      this.FormatNumber2(t.h) +
      ':' +
      this.FormatNumber2(t.m) +
      ':' +
      this.FormatNumber2(t.s) +
      '.' +
      this.FormatNumber4(t.ss);
    if (t.minus) {
      result = '-' + result;
    }
    return result;
  }

  get Hour(): string {
    const t: TimeVar = new TimeVar();
    this.Split(t);
    return this.FormatNumber2(t.h);
  }

  get Min(): string {
    const t: TimeVar = new TimeVar();
    this.Split(t);
    return this.FormatNumber2(t.m);
  }

  get Sec(): string {
    const t: TimeVar = new TimeVar();
    this.Split(t);
    return this.FormatNumber2(t.s);
  }

  get SubSec(): string {
    const t: TimeVar = new TimeVar();
    this.Split(t);
    return this.FormatNumber2(t.ss);
  }

  get Sign(): string {
    if (this.Value < 0) {
      return 'M';
    }
    return 'P';
  }
}

export class TNTime {
  Time = 0;
  protected FStatus: TTimeStatus = TTimeStatus.tsNone;
  private FDisplayPrecision = 2;
  private FPrecision = 2;

  static StaticIsValidTimeString(TimeStr: string): boolean {
    if (TimeStr === '') {
      return false;
    }

    // den letzten Punkt suchen (find last decimal point)
    let dotpos: number = TimeStr.lastIndexOf('.');
    let lastcolon: number = dotpos;

    // auch nach letztem Komma suchen (find last Comma)
    dotpos = TimeStr.lastIndexOf(',');

    // eventuell Punkt ergänzen (ensure decimal point)
    if (lastcolon === -1 && dotpos === -1) {
      TimeStr = TimeStr + '.0';
      dotpos = TimeStr.lastIndexOf('.');
    }

    // Bemerkung: lastcolon und dotpos werden beide auf die Position des Dezimalpunktes gestellt
    // dotpos wird von hier ab nicht mehr verändert
    if (lastcolon === -1 && dotpos > 0) {
      lastcolon = dotpos; // es war ein Komma
    } else if (lastcolon > 0) {
      dotpos = lastcolon; // war es ein Punkt
    }

    // der Vorkommateil wird von dotpos aus nach links gelesen:
    // Sekunden zuerst, dann Minuten, dann Stunden
    // dabei die Sonderzeichen entfernen,
    // gegebenenfalls Nullen auffüllen (Sekunden, Minuten, Stunden, alles 2-stellig)
    for (let i = dotpos - 1; i >= 0; i--) {
      const cv: string = TimeStr[i];
      if (cv === ':') {
        // ok
      } else if (cv >= '0' && cv <= '9') {
        // ok
      } else {
        return false;
      }
    }

    // der Nachkommateil wird von dotpos aus nach rechts gelesen:
    const sNachkomma: string = TimeStr.substring(dotpos + 1, TimeStr.length);
    for (const cn of sNachkomma) {
      if (cn < '0' || cn > '9') {
        return false;
      }
    }
    return true;
  }

  /** Will place a zero in front of one-digit numbers */
  private EnsureLeadingZero(value: number): string {
    if (value < 10) {
      return '0' + value.toString();
    } else {
      return value.toString();
    }
  }

  private LeadingZeros(anz: number, sIn: string): string {
    let hs = '0'.repeat(anz) + sIn;
    hs = hs.substring(hs.length - anz);
    return hs;
  }

  private CheckTime(TimeStr: string): string {
    let dotpos: number;
    let TimeStr2: string;
    let lastdd: number;
    // let sNachkomma: string;
    let sNachkommaChecked: string;
    if (TimeStr === '') {
      return '';
    }
    TimeStr2 = '';
    // ersten Punkt suchen
    dotpos = TimeStr.indexOf('.');
    lastdd = dotpos;
    // wurde entgegen den Regeln doch ein Komma eingegeben...
    dotpos = TimeStr.indexOf(',');

    if (lastdd === -1 && dotpos === -1) {
      TimeStr = TimeStr + '.0';
      dotpos = TimeStr.indexOf('.');
    }
    if (lastdd === -1 && dotpos > -1) {
      lastdd = dotpos; // es war ein Komma
    } else if (lastdd > -1) {
      dotpos = lastdd; // war es ein Punkt
    }

    // die Zeichen vor dem Komma/Punkt überprüfen
    for (let i = dotpos; i >= 1; i--) {
      // Zeichen überprüfen
      const c: string = TimeStr[i - 1];
      if (c === ':') {
        if (lastdd > -1) {
          // gab es schon einen Punkt oder Doppelpunkt
          if (lastdd - i < 2) {
            // waren es 2 Zeichen
            TimeStr2 = '0' + TimeStr2; // nein, auffüllen
          }
          lastdd = i; // Position speichern
        }
      } else if (c >= '0' && c <= '9') {
        // war es wenigstens eine Zahl
        TimeStr2 = TimeStr[i - 1] + TimeStr2; // Zeichen übernehmen
      }
    }
    TimeStr2 = this.LeadingZeros(6, TimeStr2); // führende Nullen anfügen

    // die Zeichen nach dem Komma/Punkt überprüfen
    sNachkommaChecked = '';
    const sNachkomma = TimeStr.substring(dotpos + 1);
    for (const ncc of sNachkomma) {
      if (ncc >= '0' && ncc <= '9') {
        sNachkommaChecked = sNachkommaChecked + ncc;
      }
    }
    if (sNachkommaChecked === '') {
      sNachkommaChecked = '0';
    }

    return TimeStr2 + '.' + sNachkommaChecked;
  }

  /**
   * Konvertiert einen numerischen Wert in einen String -> Format (-)HH:MM:SS.mm
   * wobei fehlende führende Stunden/Minuten entfallen: 674326 -> '1:07.43'
   * führende Null wird nicht ausgebeben
   * Tausendstel und Zehntausendstel werden nicht ausgegeben
   */
  protected ConvertTimeToStr3(TimeVal: number): string {
    // let hours: number;
    // let min: number;
    // let sec: number;
    // let msec: number;
    let temp: string;
    let minus = false;

    if (TimeVal < 0) {
      minus = true;
      TimeVal = Math.abs(TimeVal);
    }

    const msec = Math.floor(TimeVal % 10000);
    TimeVal = TimeVal / 10000;
    const sec = Math.floor(TimeVal % 60);
    TimeVal = TimeVal / 60;
    const min = Math.floor(TimeVal % 60);
    TimeVal = TimeVal / 60;
    const hours = Math.floor(TimeVal);

    // fehlende führende Bestandteile nicht mit ausgeben
    temp = '';
    if (hours > 0) {
      temp = temp + this.EnsureLeadingZero(hours) + ':';
    }
    if (min + hours > 0) {
      temp = temp + this.EnsureLeadingZero(min) + ':';
    }
    if (sec + min + hours > 0) {
      temp = temp + this.EnsureLeadingZero(sec);
    } else {
      temp = temp + '00'; // Sekunden immer ausgeben, niemals nur mit Punkt beginnen
    }

    // Nachkommastellen estmal komplett anhängen,
    // davon wird am Ende nur bis zur gewünschten Stelle gelesen
    temp = temp + '.' + this.LeadingZeros(4, msec.toString());

    // führende Null wird nicht ausgebeben
    if (temp[0] === '0') {
      temp = temp.substring(1, temp.length);
    }

    if (minus) {
      temp = '-' + temp;
    }

    // Tausendstel und Zehntausendstel nicht ausgeben
    temp = temp.substring(0, temp.length - (4 - this.FDisplayPrecision));

    return temp;
  }

  /**
   * Konvertiert TimeStr in einen numerischen Wert
   * Liefert Zeit als Anzahl Hundertstel
   * Beispiel:
   *   Eine Miute, zwei Sekunden, 3 Hundertstel; also 1:02.03
   *   ConvertStrToTime2 übergibt nur den VorkommaAnteil an diese Funktion -
   *   00010200 --> 6200
   * @param TimeStr time string to convert
   */
  private ConvertStrToTime1(TimeStr: string): number {
    let i: number;
    let j: number;
    let k: number;
    let s: number;

    if (TimeStr[2] === ':') {
      // Sonderzeichen ignorieren, wenn vorhanden
      k = 1;
    } else {
      k = 0;
    }

    s = 0;
    i = TUtils.StrToIntDef(TimeStr.substring(s, s + 2), 0); // Stunden
    j = i;

    s = 2 + k * 1;
    i = TUtils.StrToIntDef(TimeStr.substring(s, s + 2), 0); // Minuten
    j = j * 60 + i;

    s = 4 + k * 2;
    i = TUtils.StrToIntDef(TimeStr.substring(s, s + 2), 0); // Sekunden
    j = j * 60 + i;

    s = 6 + k * 3;
    i = TUtils.StrToIntDef(TimeStr.substring(s, s + 2), 0); // Hundertstel
    j = j * 100 + i;

    return j;
  }

  /**
   * Konvertiert TimeStr in einen numerischen Wert
   */
  private ConvertStrToTime2(TimeStr: string): number {
    let V: number; // VorkommaTeil
    let N: number; // NachkommaTeil
    // let pos1: number;
    // let pos2: number;
    // let posi: number;
    let str: string;

    const pos1 = TimeStr.indexOf('.'); // Sonderzeichen vorhanden?
    const pos2 = TimeStr.indexOf(',');
    const posi = Math.max(pos1, pos2);
    if (posi > 0) {
      // Vorkommastellen V
      str = '000000' + TimeStr.substring(0, posi) + '00'; // Vorkommastellen mit Nullen auffüllen
      str = str.substring(str.length - 8); // letzten 8 Zeichen nehmen
      V = this.ConvertStrToTime1(str); // diese Konvertieren
      V = V * 100; // V jetzt in Zehntausendstel

      // Nachkommastellen N
      str = TimeStr.substring(7);
      if (str.length === 0) {
        str = '0';
      }
      // Runden auf Precision
      const d: number = TUtils.StrToIntDef(str, 0) * Math.pow(10, this.FPrecision - str.length);
      N = Math.floor(Math.round(d)); // Convert.ToInt64(Math.Round(d));
      // aber intern immer Tausendstel speichern
      for (let i = this.FPrecision; i <= 3; i++) {
        N = N * 10;
      }

      return V + N;
    } else {
      return 0;
    }
  }

  Assign(source: object): void {
    if (source instanceof TNTime) {
      const o: TNTime = source as TNTime;
      this.AsInteger = o.AsInteger;
    }
  }

  Clear(): void {
    this.Status = TTimeStatus.tsNone;
    this.Time = 0;
  }

  Parse(value: string): boolean {
    if (!this.IsValidTimeString(value)) {
      return false;
    }
    this.Status = TTimeStatus.tsAuto;
    const v = this.CheckTime(value);
    this.Time = this.ConvertStrToTime2(v);
    return true;
  }

  toString(): string {
    // if (Time < 0)
    // return '';
    // else
    if (this.Time === 0 && !this.TimePresent) {
      return '';
    } else if (this.Time === 0) {
      switch (this.DisplayPrecision) {
        case 1:
          return '0.0';
        case 2:
          return '0.00';
        case 3:
          return '0.000';
        case 4:
          return '0.0000';
        default:
          return '0';
      }
    } else {
      return this.ConvertTimeToStr3(this.Time);
    }
  }

  UpdateQualiTimeBehind(aBestTime: number, aOTime: number): void {
    if (aBestTime === TimeConst.TimeNull) {
      this.AsInteger = TimeConst.TimeNull;
    } else if (aOTime > 0) {
      this.AsInteger = aOTime - aBestTime;
    } else {
      this.AsInteger = TimeConst.TimeNull;
    }
  }

  IsValidTimeString(TimeStr: string): boolean {
    return TNTime.StaticIsValidTimeString(TimeStr);
  }

  StatusAsString(): string {
    // result := TimeStatusStrings[Status];
    return TimeConst.TimeStatusStrings.getItem(this.Status);
  }
  get TimeSplit(): TTimeSplit {
    const o: TTimeSplit = new TTimeSplit();
    o.Value = this.Time;
    return o;
  }
  get TimePresent(): boolean {
    return this.FStatus !== TTimeStatus.tsNone; // || (FStatus == tsDNA)
  }
  get AsString(): string {
    return this.toString();
  }
  set AsString(value: string) {
    this.Parse(value);
  }

  get DisplayPrecision(): number {
    return this.FDisplayPrecision;
  }
  set DislayPrecesion(value: number) {
    if (this.DisplayPrecision > 0 && this.DisplayPrecision <= 4) {
      this.FDisplayPrecision = value;
    }
  }

  get AsInteger(): number {
    if (this.FStatus === TTimeStatus.tsNone) {
      return 0;
    }
    return this.Time;
  }
  set AsInteger(value: number) {
    if (value === TimeConst.TimeNull) {
      this.Status = TTimeStatus.tsNone;
      this.Time = 0;
    } else {
      this.Status = TTimeStatus.tsAuto;
      this.Time = value;
    }
  }

  get Status(): TTimeStatus {
    // Assert(FTime >= 0, 'Zeit darf nicht negativ sein');
    if (this.Time < 0) {
      this.Time = 0;
      this.FStatus = TTimeStatus.tsNone;
    }
    return this.FStatus;
  }
  set Status(value: TTimeStatus) {
    this.FStatus = value;
  }
}

export class TQTime extends TNTime {}

export class TPTime extends TNTime {
  override get AsInteger(): number {
    if (this.FStatus === TTimeStatus.tsNone) {
      return -1;
    }
    return this.Time;
  }
  override set AsInteger(value: number) {
    if (value === TimeConst.TimeNull || value < 0) {
      this.Status = TTimeStatus.tsNone;
      this.Time = 0;
    } else {
      this.Status = TTimeStatus.tsAuto;
      this.Time = value;
    }
  }

  override toString(): string {
    if (this.Time < 0) {
      return '';
    } else if (this.Time === 0 && !this.TimePresent) {
      return '';
    } else if (this.Time === 0) {
      switch (this.DisplayPrecision) {
        case 1:
          return '0.0';
        case 2:
          return '0.00';
        case 3:
          return '0.000';
        case 4:
          return '0.0000';
        default:
          return '0';
      }
    } else {
      return this.ConvertTimeToStr3(this.Time);
    }
  }

  SetPenalty(PenaltyTime: number): void {
    if (PenaltyTime < 100) {
      PenaltyTime = 100;
    }
    if (PenaltyTime > 595900) {
      PenaltyTime = 595900;
    }
    this.Status = TTimeStatus.tsPenalty;
    this.Time = PenaltyTime;
  }
}
