import { TLineParser, TUtils } from '../util/fb-classes';
import { TBO } from './fr-bo';
import { FieldNames } from '../col/stammdaten/stammdaten-fieldnames';
import { TColorMode } from '../col/event/event-enums';
import { TStringList } from '../util/fb-strings';
import {
  TNameValueRowCollection,
  TNameValueRowCollectionItem,
  NameValueFieldType,
} from '../col/name-value/name-value-grid';
import { TEventNode } from '../col/event/event-row-collection';

export enum TThrowoutScheme {
  throwoutDefault,
  throwoutBYNUMRACES, // = 1;
  throwoutPERXRACES, // = 2;
  throwoutBESTXRACES, // = 3;
  throwoutNONE, // = 4;
}

export class TThrowoutSchemeStruct {
  static readonly ThrowoutSchemeLow = 0;
  static readonly ThrowoutSchemeHigh = 4;

  static getName(o: TThrowoutScheme) {
    return TThrowoutSchemeStruct.AsString(o);
  }

  static AsInteger(o: TThrowoutScheme): number {
    switch (o) {
      case TThrowoutScheme.throwoutDefault:
        return 0;
      case TThrowoutScheme.throwoutBYNUMRACES:
        return 1;
      case TThrowoutScheme.throwoutPERXRACES:
        return 2;
      case TThrowoutScheme.throwoutBESTXRACES:
        return 3;
      case TThrowoutScheme.throwoutNONE:
        return 4;
    }
    return 0;
  }

  static AsString(o: TThrowoutScheme): string {
    switch (o) {
      case TThrowoutScheme.throwoutDefault:
        return 'ByNumRaces';
      case TThrowoutScheme.throwoutBYNUMRACES:
        return 'ByNumRaces';
      case TThrowoutScheme.throwoutPERXRACES:
        return 'PerXRaces';
      case TThrowoutScheme.throwoutBESTXRACES:
        return 'BestXRaces';
      case TThrowoutScheme.throwoutNONE:
        return 'None';
    }
    return '';
  }
}

export enum TScoringSystem {
  LowPoint,
  BonusPoint,
  BonusPointDSV,
}

export class TScoringSystemStruct {
  static readonly ScoringSystemLow = 0;
  static readonly ScoringSystemHigh = 2;

  static FromInteger(i: number): TScoringSystem {
    switch (i) {
      case 0:
        return TScoringSystem.LowPoint;
      case 1:
        return TScoringSystem.BonusPoint;
      case 2:
        return TScoringSystem.BonusPointDSV;
      default:
        return TScoringSystem.LowPoint;
    }
  }

  static getName(o: TScoringSystem): string {
    switch (o) {
      case TScoringSystem.LowPoint:
        return 'Low Point System';
      case TScoringSystem.BonusPoint:
        return 'Bonus Point System';
      case TScoringSystem.BonusPointDSV:
        return 'Bonus Point System DSV';
    }
    return '';
  }

  static getComboStrings(): string[] {
    const sa: string[] = new Array(TScoringSystemStruct.ScoringSystemHigh + 1);
    for (
      let i = TScoringSystemStruct.ScoringSystemLow;
      i <= TScoringSystemStruct.ScoringSystemHigh;
      i++
    ) {
      sa[i] = this.getName(this.FromInteger(i));
    }
    return sa;
  }
}

export enum TInputMode {
  Strict,
  Relaxed,
}

export class TInputModeStrings {
  static getName(o: TInputMode) {
    switch (o) {
      case TInputMode.Relaxed:
        return 'Relaxed';
      case TInputMode.Strict:
        return 'Strict';
    }
    return '';
  }
}

export class TEventProps extends TLineParser {
  BO: TBO;

  EventName = '';
  EventDates = '';
  HostClub = '';
  PRO = '';
  JuryHead = '';

  ScoringSystem: TScoringSystem = TScoringSystem.LowPoint;
  Throwouts = 0;
  ThrowoutScheme: TThrowoutScheme = TThrowoutScheme.throwoutDefault;
  FirstIs75 = false;
  ReorderRAF = false;

  // Uniqua Props
  ShowCupColumn = false;
  EnableUniquaProps = false; // override calculated values
  UniquaGemeldet = 0; // Count of Entries
  UniquaGesegelt = 0; // Count of Races
  UniquaGezeitet = 0; // Count of Entries at start
  FFaktor = 0.0;

  // Dynamic Props
  private detailUrl = 'detailurl';
  private eventNameID = '';
  NormalizedOutput = false;
  SortColName = '';

  // Other
  IsTimed = false;

  constructor(abo: TBO) {
    super();
    this.BO = abo;
    this.LoadDefaultData();
  }

  get Gemeldet(): number {
    if (this.EnableUniquaProps) {
      return this.UniquaGemeldet;
    } else {
      return this.FRGemeldet();
    }
  }
  set Gemeldet(value: number) {
    this.UniquaGemeldet = value;
  }

  get Gesegelt(): number {
    if (this.EnableUniquaProps) {
      return this.UniquaGesegelt;
    }
    return this.FRGesegelt();
  }
  set Gesegelt(value: number) {
    this.UniquaGesegelt = value;
  }

  get Gezeitet(): number {
    if (this.EnableUniquaProps) {
      return this.UniquaGezeitet;
    }
    return this.FRGezeitet();
  }
  set Gezeitet(value: number) {
    this.UniquaGezeitet = value;
  }

  get Faktor(): number {
    return this.FFaktor;
  }
  set Faktor(value: number) {
    if (value > 0.1 && value < 10) {
      this.FFaktor = value;
    }
  }

  get DivisionName(): string {
    return this.BO.MsgToken.cTokenB;
  }
  set DivisionName(value: string) {
    this.BO.MsgToken.DivisionName = value;
  }

  get InputMode(): TInputMode {
    if (this.BO.EventBO.RelaxedInputMode) {
      return TInputMode.Relaxed;
    }
    return TInputMode.Strict;
  }
  set InputMode(value: TInputMode) {
    if (value === TInputMode.Relaxed) {
      this.BO.EventBO.RelaxedInputMode = true;
    }
    this.BO.EventBO.RelaxedInputMode = false;
  }

  /**
   * specify what is shown in Field DN (DisplayName)
   */
  get FieldMap(): string {
    return this.BO.StammdatenNode.Collection.FieldMap;
  }
  set FieldMap(value: string) {
    this.BO.StammdatenNode.Collection.FieldMap = value;
  }

  get FieldCaptions(): string {
    return this.BO.StammdatenNode.Collection.FieldCaptions;
  }
  set FieldCaptions(value: string) {
    this.BO.StammdatenNode.Collection.FieldCaptions = value;
  }

  get FieldCount(): string {
    return this.BO.StammdatenNode.Collection.FieldCount.toString();
  }
  set FieldCount(value: string) {
    const i = TUtils.StrToIntDef(value, -1);
    if (i !== -1) {
      this.BO.StammdatenNode.Collection.FieldCount = i;
    }
  }

  get NameFieldCount(): string {
    return this.BO.EventBO.NameFieldCount.toString();
  }
  set NameFieldCount(value: string) {
    const i = TUtils.StrToIntDef(value, -1);
    if (i !== -1) {
      this.BO.EventBO.NameFieldCount = i;
    }
  }

  get NameFieldOrder(): string {
    return this.BO.EventBO.NameFieldOrder;
  }
  set NameFieldOrder(value: string) {
    this.BO.EventBO.NameFieldOrder = value;
  }

  get RaceLayout(): string {
    if (this.BO.EventNode.ShowPoints === TEventNode.LayoutFinish) {
      return 'Finish';
    }
    return 'Points'; // default
  }
  set RaceLayout(value: string) {
    if (value === 'Finish') {
      this.BO.EventNode.ShowPoints = TEventNode.LayoutFinish;
    } else {
      this.BO.EventNode.ShowPoints = TEventNode.LayoutPoints;
    }
  }

  get SchemaCode(): number {
    return FieldNames.getSchemaCode();
  }
  set SchemaCode(value: number) {
    FieldNames.setSchemaCode(value);
  }

  get NameSchema(): string {
    switch (FieldNames.getSchemaCode()) {
      case 2:
        return 'NX';
      case 1:
        return 'LongNames';
      default:
        return '';
    }
  }
  set NameSchema(value: string) {
    switch (value) {
      case 'NX':
        FieldNames.setSchemaCode(2);
        break;
      case 'LongNames':
        FieldNames.setSchemaCode(1);
        break;
      default:
        FieldNames.setSchemaCode(0);
        break;
    }
  }

  get DetailUrl(): string {
    return this.detailUrl;
  }
  set DetailUrl(value: string) {
    this.detailUrl = value;
  }

  get EventNameID(): string {
    return this.eventNameID;
  }
  set EventNameID(value: string) {
    this.eventNameID = value;
  }

  get NormalizeOutput(): string {
    if (this.NormalizedOutput) {
      return 'true';
    } else {
      return 'false';
    }
  }
  set NormalizeOutput(value: string) {
    this.NormalizedOutput = value != null && value.toLowerCase().startsWith('t');
  }

  get ShowPosRColumn(): boolean {
    return this.BO.EventNode.ShowPosRColumn;
  }
  set ShowPosRColumn(value: boolean) {
    this.BO.EventNode.ShowPosRColumn = value;
  }

  get ShowPLZColumn(): boolean {
    return this.BO.EventNode.ShowPLZColumn;
  }
  set ShowPLZColumn(value: boolean) {
    this.BO.EventNode.ShowPLZColumn = value;
  }

  get ColorMode(): string {
    switch (this.BO.EventNode.ColorMode) {
      case TColorMode.ColorMode_Fleet:
        return 'Fleet';
      case TColorMode.ColorMode_None:
        return 'None';
      default:
        return 'Normal';
    }
  }
  set ColorMode(value: string) {
    if (value === 'Fleet') {
      this.BO.EventNode.ColorMode = TColorMode.ColorMode_Fleet;
    } else if (value === 'None') {
      this.BO.EventNode.ColorMode = TColorMode.ColorMode_None;
    } else {
      this.BO.EventNode.ColorMode = TColorMode.ColorMode_Error;
    }
  }

  get UseCompactFormat(): boolean {
    return this.BO.UseCompactFormat;
  }
  set UseCompactFormat(value: boolean) {
    this.BO.UseCompactFormat = value;
  }

  get UseFleets(): boolean {
    return this.BO.EventNode.UseFleets;
  }
  set UseFleets(value: boolean) {
    this.BO.EventNode.UseFleets = value;
  }

  get UseInputFilter(): boolean {
    return this.BO.UseInputFilter;
  }
  set UseInputFilter(value: boolean) {
    this.BO.UseInputFilter = value;
  }

  get TargetFleetSize(): number {
    return this.BO.EventNode.TargetFleetSize;
  }
  set TargetFleetSize(value: number) {
    this.BO.EventNode.TargetFleetSize = value;
  }

  get FirstFinalRace(): number {
    return this.BO.EventNode.FirstFinalRace;
  }
  set FirstFinalRace(value: number) {
    this.BO.EventNode.FirstFinalRace = value;
  }

  get UseOutputFilter(): boolean {
    return this.BO.UseOutputFilter;
  }
  set UseOutputFilter(value: boolean) {
    this.BO.UseOutputFilter = value;
  }

  protected override ParseKeyValue(Key: string, Value: string): boolean {
    if (Key.startsWith('EP.')) {
      Key = Key.substring('EP.'.length);
    } else if (Key.startsWith('Event.Prop_')) {
      Key = Key.substring('Event.Prop_'.length);
    }

    if (Key === 'Name') {
      this.EventName = Value;
    } else if (Key === 'Dates') {
      this.EventDates = Value;
    } else if (Key === 'HostClub') {
      this.HostClub = Value;
    } else if (Key === 'PRO') {
      this.PRO = Value;
    } else if (Key === 'JuryHead') {
      this.JuryHead = Value;
    } else if (Key === 'ScoringSystem') {
      if (Value.indexOf('DSV') > 0) {
        this.ScoringSystem = TScoringSystem.BonusPointDSV;
      }
      if (Value.indexOf('onus') > 0) {
        this.ScoringSystem = TScoringSystem.BonusPoint;
      } else {
        this.ScoringSystem = TScoringSystem.LowPoint;
      }
    } else if (Key === 'Throwouts') {
      this.Throwouts = TUtils.StrToIntDef(Value, this.Throwouts);
    } else if (Key === 'ThrowoutScheme') {
      switch (Value) {
        case 'ByNumRaces':
          this.ThrowoutScheme = TThrowoutScheme.throwoutBYNUMRACES;
          break;
        case 'ByBestXRaces':
          this.ThrowoutScheme = TThrowoutScheme.throwoutBESTXRACES;
          break;
        case 'PerXRaces':
          this.ThrowoutScheme = TThrowoutScheme.throwoutPERXRACES;
          break;
        default:
          this.ThrowoutScheme = TThrowoutScheme.throwoutNONE;
          break;
      }
    } else if (Key === 'FirstIs75') {
      this.FirstIs75 = Value.toLowerCase().startsWith('t');
    } else if (Key === 'ReorderRAF') {
      this.ReorderRAF = Value.toLowerCase().startsWith('t');
    } else if (Key === 'ColorMode') {
      this.ColorMode = Value;
    } else if (Key === 'UseFleets') {
      this.UseFleets = TUtils.IsTrue(Value);
    } else if (Key === 'TargetFleetSize') {
      this.TargetFleetSize = TUtils.StrToIntDef(Value, this.TargetFleetSize);
    } else if (Key === 'FirstFinalRace') {
      this.FirstFinalRace = TUtils.StrToIntDef(Value, this.FirstFinalRace);
    } else if (Key === 'IsTimed') {
      this.IsTimed = TUtils.IsTrue(Value);
    } else if (Key === 'UseCompactFormat') {
      this.UseCompactFormat = TUtils.IsTrue(Value);
    } else if (Key === 'ShowPosRColumn') {
      this.ShowPosRColumn = TUtils.IsTrue(Value);
    } else if (Key === 'ShowCupColumn') {
      this.ShowCupColumn = TUtils.IsTrue(Value);
    } else if (Key === 'Uniqua.Enabled') {
      this.EnableUniquaProps = TUtils.IsTrue(Value);
    } else if (Key === 'Uniqua.Gesegelt') {
      this.UniquaGesegelt = TUtils.StrToIntDef(Value, this.Gesegelt);
    } else if (Key === 'Uniqua.Gemeldet') {
      this.UniquaGemeldet = TUtils.StrToIntDef(Value, this.Gemeldet);
    } else if (Key === 'Uniqua.Gezeitet') {
      this.UniquaGezeitet = TUtils.StrToIntDef(Value, this.Gezeitet);
    } else if (Key === 'Uniqua.Faktor') {
      this.Faktor = TUtils.StrToFloatDef(Value, this.Faktor);
    } else if (Key === 'DivisionName') {
      this.DivisionName = Value;
    } else if (Key === 'InputMode' || Key === 'IM') {
      if (Value.toLowerCase() === 'strict') {
        this.InputMode = TInputMode.Strict;
      } else {
        this.InputMode = TInputMode.Relaxed;
      }
    } else if (Key === 'FieldMap') {
      this.FieldMap = Value;
    } else if (Key === 'FieldCaptions') {
      this.FieldCaptions = Value;
    } else if (Key === 'FieldCount') {
      this.FieldCount = Value;
    } else if (Key === 'NameFieldCount') {
      this.NameFieldCount = Value;
    } else if (Key === 'NameFieldOrder') {
      this.NameFieldOrder = Value;
    } else if (Key === 'RaceLayout') {
      this.RaceLayout = Value;
    } else if (Key === 'NameSchema') {
      this.NameSchema = Value;
    } else if (Key === 'DetailUrl') {
      this.DetailUrl = Value;
    } else if (Key === 'EventNameID') {
      this.EventNameID = Value;
    } else if (Key === 'NormalizeOutput') {
      this.NormalizeOutput = Value;
    } else if (Key === 'SortColName') {
      this.SortColName = Value;
    } else {
      return false;
    }
    return true;
  }

  SaveProps(SLBackup: TStringList): void {
    if (this.EventName) {
      SLBackup.Add('EP.Name = ' + this.EventName);
    }

    if (this.EventDates) {
      SLBackup.Add('EP.Dates = ' + this.EventDates);
    }
    if (this.HostClub) {
      SLBackup.Add('EP.HostClub = ' + this.HostClub);
    }
    if (this.PRO) {
      SLBackup.Add('EP.PRO = ' + this.PRO);
    }
    if (this.JuryHead) {
      SLBackup.Add('EP.JuryHead = ' + this.JuryHead);
    }

    SLBackup.Add('EP.ScoringSystem = ' + TScoringSystemStruct.getName(this.ScoringSystem));

    SLBackup.Add('EP.Throwouts = ' + this.Throwouts.toString());

    if (this.ThrowoutScheme !== TThrowoutScheme.throwoutBYNUMRACES) {
      SLBackup.Add('EP.ThrowoutScheme = ' + TThrowoutSchemeStruct.getName(this.ThrowoutScheme));
    }
    if (this.FirstIs75) {
      SLBackup.Add('EP.FirstIs75 = ' + TUtils.BoolStr(this.FirstIs75));
    }
    if (!this.ReorderRAF) {
      SLBackup.Add('EP.ReorderRAF = ' + TUtils.BoolStr(this.ReorderRAF));
    }

    SLBackup.Add('EP.DivisionName = ' + this.DivisionName);
    SLBackup.Add('EP.InputMode = ' + TInputModeStrings.getName(this.InputMode));
    SLBackup.Add('EP.RaceLayout = ' + this.RaceLayout);
    SLBackup.Add('EP.NameSchema = ' + this.NameSchema);
    SLBackup.Add('EP.FieldMap = ' + this.FieldMap);
    SLBackup.Add('EP.FieldCaptions = ' + this.FieldCaptions);
    SLBackup.Add('EP.FieldCount = ' + this.FieldCount);
    SLBackup.Add('EP.NameFieldCount = ' + this.NameFieldCount);
    SLBackup.Add('EP.NameFieldOrder = ' + this.NameFieldOrder);
    SLBackup.Add('EP.ColorMode = ' + this.ColorMode);
    SLBackup.Add('EP.UseFleets = ' + TUtils.BoolStr(this.UseFleets));
    SLBackup.Add('EP.TargetFleetSize = ' + this.TargetFleetSize.toString());
    SLBackup.Add('EP.FirstFinalRace = ' + this.FirstFinalRace.toString());
    SLBackup.Add('EP.IsTimed = ' + TUtils.BoolStr(this.IsTimed));

    SLBackup.Add('EP.UseCompactFormat = ' + TUtils.BoolStr(this.UseCompactFormat));
    if (this.ShowPosRColumn) {
      SLBackup.Add('EP.ShowPosRColumn = ' + TUtils.BoolStr(this.ShowPosRColumn));
    }
    if (this.ShowCupColumn) {
      SLBackup.Add('EP.ShowCupColumn = ' + TUtils.BoolStr(this.ShowCupColumn));
    }
    if (this.ShowCupColumn) {
      SLBackup.Add('EP.Uniqua.Faktor = ' + this.Faktor.toFixed(2));
      SLBackup.Add('EP.Uniqua.Enabled  = ' + TUtils.BoolStr(this.EnableUniquaProps));
      SLBackup.Add('EP.Uniqua.Gesegelt = ' + this.Gesegelt.toString());
      SLBackup.Add('EP.Uniqua.Gemeldet = ' + this.Gemeldet.toString());
      SLBackup.Add('EP.Uniqua.Gezeitet = ' + this.Gezeitet.toString());
    }
    // note: do not write out dynamic props.
  }

  LoadDefaultData(): void {
    this.EventName = '';
    this.EventDates = '';
    this.HostClub = '';
    this.ScoringSystem = TScoringSystem.LowPoint;
    this.Throwouts = 0;
    this.ThrowoutScheme = TThrowoutScheme.throwoutBYNUMRACES; // 1
    // DivisionName = '*';

    // Ranglisten Props von BO übernehmen
    this.ShowCupColumn = false;
    this.EnableUniquaProps = false;
    this.Gemeldet = this.Gemeldet;
    this.Gezeitet = this.Gezeitet;
    this.Gesegelt = this.Gesegelt;
    this.Faktor = 1.1;
  }

  EditRegattaProps(): boolean {
    // result := Main.FormAdapter.EditRegattaProps(Self);
    return false;
  }
  EditUniquaProps(): boolean {
    // result := Main.FormAdapter.EditUniquaProps(Self);
    return false;
  }
  EditFleetProps(): boolean {
    // result := Main.FormAdapter.EditFleetProps(Self);
    return false;
  }
  FRGemeldet(): number {
    return this.BO.Gemeldet;
  }
  FRGesegelt(): number {
    return this.BO.Gesegelt;
  }
  FRGezeitet(): number {
    return this.BO.Gezeitet;
  }

  InspectorOnLoad(sender: object): void {
    // let cl: TNameValueRowCollection;
    let cr: TNameValueRowCollectionItem;
    if (!(sender instanceof TNameValueRowCollection)) {
      return;
    }

    const cl = sender as TNameValueRowCollection;

    cr = cl.Add();
    cr.Category = 'File';
    cr.FieldName = 'UseCompactFormat';
    cr.FieldType = NameValueFieldType.FTBoolean;
    cr.FieldValue = TUtils.BoolStr(this.UseCompactFormat);
    cr.Caption = 'UseCompactFormat';
    cr.Description = 'use delimited-value tables';

    cr = cl.Add();
    cr.Category = 'File';
    cr.FieldName = 'IsTimed';
    cr.FieldType = NameValueFieldType.FTBoolean;
    cr.FieldValue = TUtils.BoolStr(this.IsTimed);
    cr.Caption = 'IsTimed';
    cr.Description = 'save space if event is not timed';

    cr = cl.Add();
    cr.Category = 'Scoring';
    cr.FieldName = 'ReorderRAF';
    cr.FieldType = NameValueFieldType.FTBoolean;
    cr.FieldValue = TUtils.BoolStr(this.ReorderRAF);
    cr.Caption = 'ReorderRAF';
    cr.Description = 'if false, do not shuffle finish position';

    cr = cl.Add();
    cr.Category = 'Layout';
    cr.FieldName = 'ShowPLZColumn';
    cr.FieldType = NameValueFieldType.FTBoolean;
    cr.FieldValue = TUtils.BoolStr(this.ShowPLZColumn);
    cr.Caption = 'ShowPLZColumn';
    cr.Description = 'show index column for debugging...';

    cr = cl.Add();
    cr.Category = 'Layout';
    cr.FieldName = 'ShowPosRColumn';
    cr.FieldType = NameValueFieldType.FTBoolean;
    cr.FieldValue = TUtils.BoolStr(this.ShowPosRColumn);
    cr.Caption = 'ShowPosRColumn';
    cr.Description = 'show unique ranking';

    cr = cl.Add();
    cr.Category = 'File';
    cr.FieldName = 'UseOutputFilter';
    cr.FieldType = NameValueFieldType.FTBoolean;
    cr.FieldValue = TUtils.BoolStr(this.UseOutputFilter);
    cr.Caption = 'UseOutputFilter';
    cr.Description = 'apply filter when saving once';

    cr = cl.Add();
    cr.Category = 'Layout';
    cr.FieldName = 'NameFieldCount';
    cr.FieldType = NameValueFieldType.FTString;
    cr.FieldValue = this.NameFieldCount;
    cr.Caption = 'NameFieldCount';
    cr.Description = 'count of name columns in event table display';

    cr = cl.Add();
    cr.Category = 'Layout';
    cr.FieldName = 'NameFieldOrder';
    cr.FieldType = NameValueFieldType.FTString;
    cr.FieldValue = this.NameFieldOrder;
    cr.Caption = 'NameFieldOrder';
    cr.Description = 'namefield index string';
  }

  InspectorOnSave(sender: object): void {
    // let cl: TNameValueRowCollection;
    let cr: TNameValueRowCollectionItem;

    if (!(sender instanceof TNameValueRowCollection)) {
      return;
    }

    const cl = sender as TNameValueRowCollection;

    for (let i = 0; i < cl.Count; i++) {
      cr = cl.Items[i];
      if (cr.FieldName === 'UseCompactFormat') {
        this.UseCompactFormat = TUtils.IsTrue(cr.FieldValue);
      } else if (cr.FieldName === 'IsTimed') {
        this.IsTimed = TUtils.IsTrue(cr.FieldValue);
      } else if (cr.FieldName === 'ReorderRAF') {
        this.ReorderRAF = TUtils.IsTrue(cr.FieldValue);
      } else if (cr.FieldName === 'ShowPLZColumn') {
        this.ShowPLZColumn = TUtils.IsTrue(cr.FieldValue);
      } else if (cr.FieldName === 'ShowPosRColumn') {
        this.ShowPosRColumn = TUtils.IsTrue(cr.FieldValue);
      } else if (cr.FieldName === 'UseOutputFilter') {
        this.UseOutputFilter = TUtils.IsTrue(cr.FieldValue);
      } else if (cr.FieldName === 'NameFieldCount') {
        this.NameFieldCount = cr.FieldValue;
      } else if (cr.FieldName === 'NameFieldOrder') {
        this.NameFieldOrder = cr.FieldValue;
      }
    }
  }
}
