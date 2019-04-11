export class ApiEventParamss {
    raceCount: number = 2;
    itCount: number = 2;
    startlistCount: number = 8;
 }
 
export class ApiConnectionStatus {
   connected: boolean = false;
   websockets: boolean = false;
}

export class ApiRetValue {
    retvalue: string = "ok";
}

export class EventFormData {
    raceCount: number = 2;
    itCount: number = 0;
    startlistCount: number = 8;
    scoringSystem: number = 0;
}
  
export class EventParams {
    createOption: number = 0;
    raceCount: number = 2;
    itCount: number = 2;
    startlistCount: number = 8;    
}

export class EventProps {
    eventName: string = "";
    scoringSystem: number = 0;    
    schemaCode: number = 0;
    isTimed: boolean = true;
}

export class EntryRow {
    SNR: number = 1001;
    N1: string = "";
    N2: string = "";
    N3: string = "";
    N4: string = "";
    N5: string = "";
    N6: string = "";
}

export const ScoringSystemStrings = ['Low Point', 'Bonus Point', 'Bonus Point DSV'];

export const NameFieldSchemaStrings = ['Default', 'Long Names', 'NX'];

export class EventParamJson {
    static prefix = 'DP';

    RaceCount: number = 2;
    ITCount: number = 0;
    StartlistCount: number = 2;    

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
        if (value)
            this.SL.push(`${EventPropJson.prefix}.${key}=${value}`);
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
    TimingInfo: Array<Array<string>> = [];
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
    TimingInfo: Array<Array<string>> = [];
    PenaltyInfo: Array<Array<string>> = [];
}

export class RaceDataJson {
    FinishInfo: string[] = [];
    TimingInfo: Array<string> = [];
    PenaltyInfo: Array<string> = [];
}
