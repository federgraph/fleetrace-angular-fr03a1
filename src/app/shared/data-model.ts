export class ApiEventParamss {
  raceCount = 2;
  itCount = 2;
  startlistCount = 8;
}

export class ApiConnectionStatus {
  connected = false;
  websockets = false;
}

export class ApiRetValue {
  retvalue = 'ok';
}

export class EventFormData {
  raceCount = 2;
  itCount = 0;
  startlistCount = 8;
  scoringSystem = 0;
}

export class EventParams {
  createOption = 0;
  raceCount = 2;
  itCount = 2;
  startlistCount = 8;
}

export class EventProps {
  eventName = '';
  scoringSystem = 0;
  schemaCode = 0;
  isTimed = true;
}

export class EntryRow {
  SNR = 1001;
  N1 = '';
  N2 = '';
  N3 = '';
  N4 = '';
  N5 = '';
  N6 = '';
}

export const ScoringSystemStrings = ['Low Point', 'Bonus Point', 'Bonus Point DSV'];

export const NameFieldSchemaStrings = ['Default', 'Long Names', 'NX'];

export class EventParamJson {
  static prefix = 'DP';

  RaceCount = 2;
  ITCount = 0;
  StartlistCount = 2;

  private SL: string[] = [];

  toArray(): string[] {
    this.SL = [];
    this.WriteLn('RaceCount', this.RaceCount);
    this.WriteLn('ITCount', this.ITCount);
    this.WriteLn('StartlistCount', this.StartlistCount);
    return this.SL;
  }

  WriteLn(key: string, value: any): void {
    this.SL.push(`${EventParamJson.prefix}.${key}=${value}`);
  }
}

export class EventPropJson {
  static prefix = 'EP';

  Name = 'Test Event Name';
  ScoringSystem = 'Low Point System';
  Throwouts = 0;
  DivisionName = '*';
  InputMode = 'Strict';
  RaceLayout = 'Finish';
  NameSchema = '';
  FieldMap = 'SN';
  FieldCaptions = '';
  FieldCount = 6;
  NameFieldCount = 2;
  NameFieldOrder = '041256';
  UseFleets = false;
  TargetFleetSize = 8;
  FirstFinalRace = 20;
  IsTimed = false;
  UseCompactFormat = true;

  private SL: string[] = [];

  toArray(): string[] {
    this.SL = [];
    this.WriteLn('Name', this.Name);
    this.WriteLn('Throwouts', this.Throwouts);
    this.WriteLn('DivisionName', this.DivisionName);
    this.WriteLn('InputMode', this.InputMode);
    this.WriteLn('RaceLayout', this.RaceLayout);
    this.WriteLn('NameSchema', this.NameSchema);
    this.WriteLn('FieldMap', this.FieldMap);
    this.WriteLn('FieldCaptions', this.FieldCaptions);
    this.WriteLn('FieldCount', this.FieldCount);
    this.WriteLn('NameFieldCount', this.NameFieldCount);
    this.WriteLn('NameFieldOrder', this.NameFieldOrder);
    this.WriteLn('UseFleets', this.UseFleets);
    this.WriteLn('TargetFleetSize', this.TargetFleetSize);
    this.WriteLn('FirstFinalRace', this.FirstFinalRace);
    this.WriteLn('IsTimed', this.IsTimed);
    this.WriteLn('UseCompactFormat', this.UseCompactFormat);
    return this.SL;
  }

  WriteLn(key: string, value: any): void {
    if (value) {
      this.SL.push(`${EventPropJson.prefix}.${key}=${value}`);
    }
  }
}

export class EventParamsJson {
  EventParams: string[] = [];
}

export class EventPropsJson {
  EventProps: string[] = [];
}

export class NameTableJson {
  NameTable: string[] = [];
}

export class StartListJson {
  StartList: string[] = [];
}

export class FleetListJson {
  FleetList: string[] = [];
}

export class FinishInfoJson {
  FinishInfo: string[] = [];
}

export class TimingInfoJson {
  TimingInfo: string[][] = [];
}

export class PenaltyInfoJson {
  PenaltyInfo = {};
}

export class EventDataJson {
  EventParams: string[] = [];
  EventProps: string[] = [];
  NameTable: string[] = [];
  StartList: string[] = [];
  FleetList: string[] = [];
  FinishInfo: string[] = [];
  TimingInfo: string[][] = [];
  PenaltyInfo: string[][] = [];
}

export class RaceDataJson {
  FinishInfo: string[] = [];
  TimingInfo: string[] = [];
  PenaltyInfo: string[] = [];
}
