import { Component, OnInit, Input } from '@angular/core';
import { TBOManager } from '../../bo/bo-manager';
import {
  EventDataJson,
  EventParamsJson,
  EventPropsJson,
  NameTableJson,
  StartListJson,
  FinishInfoJson,
  FleetListJson } from '../shared/data-model';
import { TExcelExporter } from '../../fr/fr-excel-export';
import { JsonInfo } from '../shared/data-array';

@Component({
  selector: 'app-json-info',
  templateUrl: './json-info.component.html',
  styleUrls: ['./json-info.component.css']
})
export class JsonInfoComponent implements OnInit {

  @Input() race: number = 1;

  output: any = 'Json Output to be shown here.';

  ee: TExcelExporter;

  jsonInfo: JsonInfo;

  constructor(public BOManager: TBOManager) {
    this.ee = new TExcelExporter();
    this.jsonInfo = new JsonInfo(BOManager);
  }

  ngOnInit() {

  }

  eventParams() {
    const o: EventParamsJson = new EventParamsJson;
    o.EventParams = this.jsonInfo.getEventParams();
    this.output = o;
  }

  eventProps() {
    const o: EventPropsJson = new EventPropsJson;
    o.EventProps = this.jsonInfo.getEventProps();
    this.output = o;
  }

  nameTable() {
    const o: NameTableJson = new NameTableJson;
    o.NameTable = this.jsonInfo.getNames();
    this.output = o;
  }

  startList(): void {
    const o: StartListJson = new StartListJson;
    o.StartList = this.jsonInfo.getStartList();
    this.output = o;
  }

  finishList(): void {
    const o: FinishInfoJson = new FinishInfoJson;
    o.FinishInfo = this.jsonInfo.getFinishList();
    this.output = o;
  }

  fleetList(): void {
    const o: FleetListJson = new FleetListJson;
    o.FleetList = this.jsonInfo.getFleetList();
    this.output = o;
  }

  timeList(): void {
    const bo = this.BOManager.BO;
    if (bo.BOParams.ITCount > 0 || bo.EventProps.IsTimed) {
      this.output = this.jsonInfo.getTL(this.race);
    }
    else {
      this.output = "no timing";
    }
  }

  timeLists(): void {
    const bo = this.BOManager.BO;
    if (bo.BOParams.ITCount > 0 || bo.EventProps.IsTimed) {
      this.output = this.jsonInfo.getTimeLists();
    }
    else {
      this.output = "no timing";
    }
  }

  penaltyList(): void {
    const a = this.jsonInfo.getPL(this.race);
    a.unshift("PenaltyList.Begin.R" + this.race);
    a.push("PenaltyList.End.R" + this.race);
    const o: { [index: string]: string[] } = {};
    o["R" + this.race] = a;
    this.output = o;
  }

  penaltyLists(): void {
    this.output = this.jsonInfo.getPenaltyLists();
  }

  raceData(): void {
    this.output = this.jsonInfo.getRaceDataJson(this.race);
  }

  eventData(): void {
    this.output = this.jsonInfo.getEventDataJson();
  }

  eventDataArray() {
    const includeEmptyList = false;

    const o: EventDataJson = this.jsonInfo.getEventDataJson();
    const a: string[] = [];

    for (const s1 of o.EventParams)
      a.push(s1);

    for (const s2 of o.EventProps)
      a.push(s2);

    if (o.NameTable.length > 2 || includeEmptyList)
      for (const s3 of o.NameTable)
        a.push(s3);

    for (const s4 of o.StartList)
      a.push(s4);

    if (o.FleetList.length > 2 || includeEmptyList)
      for (const s5 of o.FleetList)
        a.push(s5);

    for (const s6 of o.FinishInfo)
      a.push(s6);

    if (o.TimingInfo.length > 0)
      for (const ti of o.TimingInfo)
        for (const s7 of ti)
          a.push(s7);

    if (o.PenaltyInfo.length > 0)
      for (const pi of o.PenaltyInfo) {
        if (pi.length > 0)
          for (const s8 of pi)
            a.push(s8);
      }

    this.output = a;
  }

}
