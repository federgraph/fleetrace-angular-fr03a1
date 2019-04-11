import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TBOManager } from '../../bo/bo-manager';
import { ApiService } from '../shared/api.service';
import { RaceDataJson, EventDataJson } from '../shared/data-model';
import { JsonInfo } from '../shared/data-array';
import { IEventDataItem } from '../shared/test-data';
import { TStringList } from 'src/util/fb-strings';

const consume_button_row_legend = `
--- consume button row ----
Pull E  = using EventDataText from api/event-data
Pull EJ = using EventDataJson from api/event-data-json
Pull RJ = using RaceDataJson from api/race-data-json

Clear = calling /api/manage-clear
cls = clear TestOutput variable
`;

const post_button_row_legend = `
--- post-button-row ---
Push E = posting EventDataText to /api/event-data
Push EJ = posting EventDataJSON to /api/event-data-json
Push RJ = posting RaceDataJSON to /api/race-data-json

UD 2 = posting EventDataJSON to /ud/2
UD 3 = posting RaceDataJSON to /ud/3
`;

const inspect_button_row_legend = ` 
--- test-button-row ---
event-data  = show EventDataText from /api/event-data
event-data-json = show EventDataJson from /api/event-data-json
race-data-json = show RaceDataJson for current Race from /api/race-data-json

ud/2 = show EventDataJson from /ud/2
ud/3 = show RaceDataJson from /ud/3
`;

const backup_button_row_legend = ` 
--- backup-button-row ---
backup = show json from /api/backup
backlog = show json from /api/backlog
backup + log = show json from /api/backup-and-log

b = show string from /api/backup-string
l = show string from /api/backlog-string
b + l = show string from /api/backup-and-log-string

(b+l).json = show string from /api/backup-and-log-json-string
`;

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit {

  oneRow = true;
  wantConsumeRow = false;
  wantPostRow = false;
  wantInspectRow = false;
  wantBackupRow = false;

  @Input() race: number = 1;
  @Output() eventDataAvailable: EventEmitter<IEventDataItem> = new EventEmitter();
  @Output() raceDataAvailable: EventEmitter<string[]> = new EventEmitter();
  @Output() notify: EventEmitter<number> = new EventEmitter();

  Info: string = "info";
  TestOutput: string = "";

  jsonInfo: JsonInfo;

  constructor(public BOManager: TBOManager,
    private apiService: ApiService) { 
      this.jsonInfo = new JsonInfo(BOManager);
  }

  ngOnInit() {
    //this.pullE();
  }

  onEventDataStringAvailable(data: string) {
    if (data !== "") {
      const ed: IEventDataItem = new IEventDataItem();
      ed.EventName = 'Current Event (pulled via api)';
      ed.EventData = data;
      this.TestOutput = 'emitting event data ...';      
      this.eventDataAvailable.emit(ed);
    }
    else {
      this.TestOutput = 'cannot load event data item from api server';      
    }
  }

  onEventDataJsonAvailable(data: EventDataJson) {
    const ML = new TStringList();
    ML.SL = this.jsonInfo.convertEventDataJson(data);
    this.onEventDataStringAvailable(ML.Text);
  }
  
  onRaceDataJsonAvailable(data: RaceDataJson) {
    const ML = new TStringList();
    ML.SL = this.jsonInfo.convertRaceDataJson(data);
    this.raceDataAvailable.emit(ML.SL);
  }

  // --- consume-button-row ---

  pullE() {
    this.Info = "using plain-text EventData from api/event-data";
    this.apiService.pullEventData().subscribe(data => this.onEventDataStringAvailable(data));
  }

  pullEJ() {
    this.Info = "using EventDataJson from api/event-data-json";
    this.apiService.pullEventDataJson().subscribe(data => this.onEventDataJsonAvailable(data));
  }

  pullRJ() {
    this.Info = "using RaceDataJson from api/race-data-json";
    this.apiService.pullRaceDataJson(this.race).subscribe(data => this.onRaceDataJsonAvailable(data));
  }

  clear() {
    this.Info = 'info';
    this.TestOutput = 'return value  to be shown here.';
    this.apiService.manageClear().subscribe(data => this.TestOutput = "called apiSerice.manageClear()");
    this.notify.emit(1);
  }

  cls() {
    this.Info = 'Info variable';
    this.TestOutput = "TestOuput variable";
  }

  // --- post-button-row ---

  pushE() {
    this.Info = "posting EventData to api/event-data";
    const t = this.BOManager.BO.Save();
    this.apiService.pushEventData(t).subscribe(data => this.TestOutput = data.retvalue);    
  }

  pushEJ() {
    this.Info = "posting EventDataJSON to api/event-data-json";
    const t = this.jsonInfo.getEventDataJson();
    this.apiService.pushEventDataJson(t).subscribe(data => this.TestOutput = data.retvalue);    
  }

  pushRJ() {
    this.Info = `posting RaceDataJSON for race ${this.race} to api/race-data-json`;
    const t: RaceDataJson = this.jsonInfo.getRaceDataJson(this.race);
    this.apiService.pushRaceDataJsonForRace(this.race, t).subscribe(data => this.TestOutput = data.retvalue);
  }

  pushED() {
    this.Info = "posting EventDataJSON to api/ed.json";
    const t = this.jsonInfo.getEventDataJson();
    this.apiService.pushED(t).subscribe(data => this.TestOutput = data.retvalue);    
  }

  pushRD() {
    this.Info = `posting RaceDataJSON for race ${this.race} to api/rd.json`;
    const t: RaceDataJson = this.jsonInfo.getRaceDataJson(this.race);
    this.apiService.pushRD(t).subscribe(data => this.TestOutput = data.retvalue);
  }

  push2() {
    this.Info = "posting EventDataJSON to ud/2";
    const t = this.jsonInfo.getEventDataJson();
    this.apiService.push2(t).subscribe(data => this.TestOutput = data.retvalue);
  }

  push3() {
    this.Info = `posting RaceDataJSON for race ${this.race} to ud/3`;
    const t: RaceDataJson = this.jsonInfo.getRaceDataJson(this.race);
    this.apiService.push3(t).subscribe(data => this.TestOutput = data.retvalue);
  }

  // --- inspect-button-row ---

  inspectE() {
    this.Info = "show plain-text EventData from api/event-data";
    this.apiService.pullEventData().subscribe(data => this.TestOutput = data);
  }

  inspectEJ() {
    this.Info = "show plain-text EventData from api/event-data";
    this.apiService.pullEventDataJson().subscribe(data => this.TestOutput = JSON.stringify(data, null, 2));
  }

  inspectRJ() {
    this.Info = "show RaceDataJson for current Race from api/race-data-json";
    this.apiService.pullRaceDataJson(this.race).subscribe(data => this.TestOutput = JSON.stringify(data, null, 2));
  }

  inspectED() {
    this.Info = "show EventDataJson from api/ed.json";
    this.apiService.pullED().subscribe(data => this.TestOutput = JSON.stringify(data, null, 2));
  }

  inspectRD() {
    this.Info = "show RaceDataJson from api/rd.json";
    this.apiService.pullRD().subscribe(data => this.TestOutput = JSON.stringify(data, null, 2));
  }

  inspect2() {
    this.Info = "show EventDataJson from ud/2";
    this.apiService.pull2().subscribe(data => this.TestOutput = JSON.stringify(data, null, 2));
  }

  inspect3() {
    this.Info = "show RaceDataJson from ud/3";
    this.apiService.pull3().subscribe(data => this.TestOutput = JSON.stringify(data, null, 2));
  }

  // --- backup-button-row ---

  getBackup() {
    this.Info = "show json from api/backup";
    this.apiService.getBackup().subscribe(data => this.TestOutput = JSON.stringify(data, null, 2));    
  }

  getBacklog() {
    this.Info = "show json from api/backlog";
    this.apiService.getBacklog().subscribe(data => this.TestOutput = JSON.stringify(data, null, 2));    
  }

  getBackupAndLog() {
    this.Info = "show json from api/backup-and-log";
    this.apiService.getBackupAndLog().subscribe(data => this.TestOutput = JSON.stringify(data, null, 2));    
  }

  getBackupString() {
    this.Info = "show string from api/backup-string";
    this.apiService.getBackupString().subscribe(data => this.TestOutput = data);    
  }

  getBacklogString() {
    this.Info = "show string from api/backlog-string";
    this.apiService.getBacklogString().subscribe(data => this.TestOutput = data);    
  }

  getBackupAndLogString() {
    this.Info = "show string from api/backup-and-log-string";
    this.apiService.getBackupAndLogString().subscribe(data => this.TestOutput = data);    
  }

  getBackupAndLogJsonString() {
    this.Info = "show string from api/backup-and-log-json-string";
    this.apiService.getBackupAndLogJsonString().subscribe(data => this.TestOutput = data);    
  }

  // --- legend buttons ----

  showConsumeLegend() {
    this.TestOutput = consume_button_row_legend;
  }

  showPostLegend() {
    this.TestOutput = post_button_row_legend;
  }

  showInspectLegend() {
    this.TestOutput = inspect_button_row_legend;
  }

  showBackupLegend() {
    this.TestOutput = backup_button_row_legend;
  }

  showMore() {
    this.oneRow = false;
    this.wantConsumeRow = true;
    this.wantPostRow = true;
    this.wantInspectRow = true;
    this.wantBackupRow = true;  
  }

  showLess() {
    this.oneRow = true;
    this.wantConsumeRow = false;
    this.wantPostRow = false;
    this.wantInspectRow = false;
    this.wantBackupRow = false;  
  }

}

