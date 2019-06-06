import { TBOManager } from '../../bo/bo-manager';
import { EventParamJson, EventPropJson, EventDataJson, RaceDataJson } from './data-model';
import { TableID } from '../../fr/fr-excel-importer';
import { TExcelExporter } from '../../fr/fr-excel-export';
import { TStringList } from '../../util/fb-strings';

export class JsonInfo {

  ee: TExcelExporter;

  constructor(public BOManager: TBOManager) {
    this.ee = new TExcelExporter();
  }

  private updateParamJson(o: EventParamJson): void {
    o.RaceCount = this.BOManager.BO.BOParams.RaceCount;
    o.ITCount = this.BOManager.BO.BOParams.ITCount;
    o.StartlistCount = this.BOManager.BO.BOParams.StartlistCount;
  }

  private updatePropJson(o: EventPropJson): void {
    o.Name = this.BOManager.BO.EventProps.EventName;
    // o.ScoringSystem = this.BOManager.BO.EventProps.ScoringSystem;
    o.Throwouts = this.BOManager.BO.EventProps.Throwouts;
    o.DivisionName = this.BOManager.BO.EventProps.DivisionName;
    // o.InputMode = this.BOManager.BO.EventProps.InputMode;
    o.RaceLayout = this.BOManager.BO.EventProps.RaceLayout;
    o.NameSchema = this.BOManager.BO.EventProps.NameSchema;
    o.FieldMap = this.BOManager.BO.EventProps.FieldMap;
    o.FieldCaptions = this.BOManager.BO.EventProps.FieldCaptions;

    // o.FieldCount = this.BOManager.BO.EventProps.FieldCount;
    o.FieldCount = this.BOManager.BO.StammdatenNode.Collection.FieldCount;

    // o.NameFieldCount = this.BOManager.BO.EventProps.NameFieldCount;

    o.NameFieldOrder = this.BOManager.BO.EventProps.NameFieldOrder;
    o.UseFleets = this.BOManager.BO.EventProps.UseFleets;
    o.TargetFleetSize = this.BOManager.BO.EventProps.TargetFleetSize;
    o.FirstFinalRace = this.BOManager.BO.EventProps.FirstFinalRace;
    o.IsTimed = this.BOManager.BO.EventProps.IsTimed;
    o.UseCompactFormat = this.BOManager.BO.EventProps.UseCompactFormat;
  }

  getEventParams(): string[] {
    const o = new EventParamJson();
    this.updateParamJson(o);
    return o.toArray();
  }

  getEventProps(): string[] {
    const o = new EventPropJson();
    this.updatePropJson(o);
    return o.toArray();
  }

  getNames(): string[] {
    const Memo = new TStringList();
    this.ee.AddSection(TableID.NameList, this.BOManager.BO, Memo);
    const SL: string[] = [];
    for (let i = 0; i < Memo.Count; i++) {
      if (Memo.SL[i]) {
        SL.push(Memo.SL[i]);
    }
    }
    return Memo.SL;
  }

  getStartList(): string[] {
    const Memo = new TStringList();
    this.ee.AddSection(TableID.StartList, this.BOManager.BO, Memo);
    const SL: string[] = [];
    for (let i = 0; i < Memo.Count; i++) {
      if (Memo.SL[i]) {
        SL.push(Memo.SL[i]);
    }
    }
    return Memo.SL;
  }

  getFleetList(): string[] {
    const bo = this.BOManager.BO;
    // if (bo.EventProps.UseFleets) {
    if (bo.EventNode.UseFleets) {
      const Memo = new TStringList();
      this.ee.AddSection(TableID.FleetList, bo, Memo);
      const SL: string[] = [];
      for (let i = 0; i < Memo.Count; i++) {
        if (Memo.SL[i]) {
          SL.push(Memo.SL[i]);
        }
      }
      return Memo.SL;
    } else {
      return [];
    }
  }

  getRaceFinishList(r: number): string[] {
    const Memo = new TStringList();
    this.ee.AddRaceFinishSection(this.BOManager.BO, Memo, r);
    const SL: string[] = [];
    for (let i = 0; i < Memo.Count; i++) {
      if (Memo.SL[i]) {
        SL.push(Memo.SL[i]);
      }
    }
    return Memo.SL;
  }

  getFinishList(): string[] {
    const Memo = new TStringList();
    this.ee.AddSection(TableID.FinishList, this.BOManager.BO, Memo);
    const SL: string[] = [];
    for (let i = 0; i < Memo.Count; i++) {
      if (Memo.SL[i]) {
        SL.push(Memo.SL[i]);
      }
    }
    return Memo.SL;
  }

  getTL(r: number): string[] {
    const bo = this.BOManager.BO;
    const Memo = new TStringList();
    this.ee.AddTimingSection(bo, Memo, r);
    const SL: string[] = [];
    for (let i = 0; i < Memo.Count; i++) {
      if (Memo.SL[i]) {
        SL.push(Memo.SL[i]);
      }
    }
    return SL;
  }

  getPL(r: number): string[] {
    const bo = this.BOManager.BO;
    if (r > 0 && r <= bo.BOParams.RaceCount) {
      const Memo = new TStringList();
      // Memo.Add(`PenaltyList.Begin.R${r}`);
      bo.BackupPenalties(Memo, r);
      // Memo.Add(`PenaltyList.End.R${r}`);
      return Memo.SL;
    } else {
      return [];
    }
  }

  getTimeLists(): Array<Array<string>> {
    const bo = this.BOManager.BO;
    if (bo.BOParams.ITCount > 0 || bo.EventProps.IsTimed) {
      const a = [];
      for (let r = 1; r <= bo.BOParams.RaceCount; r++) {
        a.push(this.getTL(r));
      }
      return a;
    }
    return null;
  }

  getPenaltyLists(): Array<Array<string>> {
    const bo = this.BOManager.BO;
    const a = [];
    for (let r = 1; r <= bo.BOParams.RaceCount; r++) {
      a.push(this.getPL(r));
    }
    return a;
  }

  getPenaltyInfo(): object {
    const bo = this.BOManager.BO;
    const a: { [index: string]: string[] } = {};
    for (let r = 1; r <= bo.BOParams.RaceCount; r++) {
      a['R' + r] = this.getPL(r);
    }
    return a;
  }

  getEventDataJson(): EventDataJson {
    const bo = this.BOManager.BO;
    const o: EventDataJson = new EventDataJson();
    let temp: any;

    o.EventParams = this.getEventParams();
    o.EventProps = this.getEventProps();
    o.NameTable = this.getNames();
    o.StartList = this.getStartList();
    o.FleetList = this.getFleetList();
    o.FinishInfo = this.getFinishList();

    if (bo.BOParams.ITCount > 0 || bo.EventProps.IsTimed) {
      temp = this.getTimeLists();
      if (temp) {
        o.TimingInfo = temp;
      }
    }

    o.PenaltyInfo = this.getPenaltyLists();
    return o;
  }

  getRaceDataJson(r: number): RaceDataJson {
    const o: RaceDataJson = new RaceDataJson();
    o.FinishInfo = this.getRaceFinishList(r);
    o.TimingInfo = this.getTL(r);
    o.PenaltyInfo = this.getPL(r);
    return o;
  }

  getRaceData(r: number): string[] {
    const o: RaceDataJson = this.getRaceDataJson(r);
    return this.convertRaceDataJson(o);
  }

  convertRaceDataJson(o: RaceDataJson): string[] {
    const a: string[] = [];

    for (const s1 of o.FinishInfo) {
      a.push(s1);
    }

    for (const s2 of o.TimingInfo) {
      a.push(s2);
    }

    for (const s3 of o.PenaltyInfo) {
      a.push(s3);
    }

    return a;
  }

  getEventData(): string[] {
    const o: EventDataJson = this.getEventDataJson();
    return this.convertEventDataJson(o);
  }

  convertEventDataJson(o: EventDataJson): string[] {

    const a: string[] = [];

    for (const s1 of o.EventParams) {
      a.push(s1);
    }

    for (const s2 of o.EventProps) {
      a.push(s2);
    }

    if (o.NameTable.length > 2) {
      for (const s3 of o.NameTable) {
        a.push(s3);
      }
    }

    for (const s4 of o.StartList) {
      a.push(s4);
    }

    if (o.FleetList.length > 2) {
      for (const s5 of o.FleetList) {
        a.push(s5);
      }
    }

    for (const s6 of o.FinishInfo) {
      a.push(s6);
    }

    if (o.TimingInfo.length > 0) {
      for (const ti of o.TimingInfo) {
        for (const s7 of ti) {
          a.push(s7);
        }
      }
    }

    if (o.PenaltyInfo.length > 0) {
      for (const pi of o.PenaltyInfo) {
        if (pi.length > 0) {
          for (const s8 of pi) {
            a.push(s8);
      }
        }
      }
    }

    return a;
  }

}
