import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { TBOManager } from '../../bo/bo-manager';
import { TStringList } from '../../util/fb-strings';
import { JsonInfo } from '../shared/data-array';
import { EventDataJson } from '../shared/data-model';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss']
})
export class SaveComponent implements OnInit {

  option = 0;

  //save options
  readonly soStatic = 0;
  readonly soClipboard = 1;
  readonly soSession = 2;
  readonly soLocal = 3;
  readonly soAjax = 4;
  readonly soDB = 5;

  options = [
    'noop',
    'to clipboard',
    'to session storage',
    'to local storage',
    'upload to api service',
    'uplolad to firebase db'
  ];

  TestOutput: string;
  Info: string = "info";

  eventDataKey = 'fr-event-data';
  keyString = 'key "fr-event-data"';

  stagedCompactText: string;
  stagedJson: EventDataJson;
  stagedStringArray: string[];

  constructor(
    public BOManager: TBOManager, 
    public snackBar: MatSnackBar,
    private apiService: ApiService) {
  }

  ngOnInit() {
  }

  clear() {
    this.TestOutput = "";
    this.Info = "pre text cleared";
  }

  clearLocalStorage() {
    localStorage.clear();
    this.Info = "localStorage cleared";
  }

  removeKey() {
    localStorage.removeItem(this.eventDataKey);
    this.Info = `localStorage ${this.keyString} removed`;
  }

  getCompactText(): string {
    const SL = new TStringList();
    this.BOManager.BO.BackupToSLCompact(SL, true);
    return SL.Text;
  }

  getJson(): EventDataJson {
    const ji: JsonInfo = new JsonInfo(this.BOManager);
    return ji.getEventDataJson();
  }

  getStringArray(): string[] {
    const ji: JsonInfo = new JsonInfo(this.BOManager);
    return ji.getEventData();
  }

  stage() {
    this.TestOutput = "";
    this.Info = "";

    switch (this.option) {
      case this.soStatic:
        this.TestOutput = '';
        this.Info = 'noop selected, nothing to do';
        break;

      case this.soClipboard:
        this.stagedCompactText = this.getCompactText();
        this.TestOutput = this.stagedCompactText;
        this.Info = 'compact text staged';
        break;

      case this.soSession:
        this.stagedCompactText = this.getCompactText();
        this.TestOutput = this.stagedCompactText;
        this.Info = 'compact text staged';
        break;

      case this.soLocal:
        this.stagedCompactText = this.getCompactText();
        this.TestOutput = this.stagedCompactText;
        this.Info = 'compact text staged';
        break;

      case this.soAjax:
        this.stagedJson = this.getJson();
        this.TestOutput = JSON.stringify(this.stagedJson, null, 2);
        this.Info = 'event data json, staged for posting to api server';
        break;

      case this.soDB:
        this.stagedStringArray = this.getStringArray();
        this.TestOutput = JSON.stringify(this.stagedStringArray, null, 2);
        this.Info = 'event data string array, staged for saving to db';
        break;

      default:
        this.Info = 'invalid selection';
        break;
    }
  }

  save() {
    switch (this.option) {
      case this.soStatic:
        this.Info = "Nothing happend - you selected noop.";
        this.TestOutput = "";
        break;

      case this.soClipboard:
        if (this.TestOutput !== "") {
          this.copyToClipboard(this.TestOutput);
          this.Info = 'staged text copied to clipboard.';
          this.openSnackBar('copied to clipboard');
        }
        else {
          this.Info = "nothing staged for copying to clipboard";
          this.TestOutput = "";
        }
        break;

      case this.soSession:
        if (this.stagedCompactText !== "") {
          sessionStorage.setItem(this.eventDataKey, this.stagedCompactText);
          this.Info = 'compact text saved to session storage.';
          this.openSnackBar("saved to browser's session storage");
        }
        else {
          this.Info = "nothing staged for saving to localStorage";
          this.TestOutput = "";
        }
        break;

      case this.soLocal:
        if (this.stagedCompactText !== "") {
          localStorage.setItem(this.eventDataKey, this.stagedCompactText);
          this.Info = 'compact text saved to local storage.';
          this.openSnackBar("'saved to browser's local storage");
        }
        else {
          this.Info = "nothing staged for saving to localStorage";
          this.TestOutput = "";
        }
        break;

      case this.soAjax:
        this.Info = "saving to api service...";
        this.stagedJson = this.getJson();
        this.apiService.push2(this.stagedJson).subscribe(data => this.TestOutput = data.retvalue);    
        break;

      case this.soDB:
        this.Info = "saving to firebase NoSQL DB not implemented";
        break;

      default:
        this.Info = "invalid selection";
        break;
    }

  }

  openSnackBar(msg: string) {
    this.snackBar.open(msg, null, { duration: 1500 });
  }

  copyToClipboard(value: string) {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = value;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }

}
