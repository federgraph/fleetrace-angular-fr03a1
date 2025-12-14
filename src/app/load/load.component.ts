import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TBOManager } from '../../bo/bo-manager';
import { TTestData, IEventDataItem } from '../shared/test-data';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, MaterialModule],
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss'],
})
export class LoadComponent implements OnInit {
  option = 0;

  // load options
  readonly loStatic = 0;
  readonly loSession = 1;
  readonly loLocal = 2;
  readonly loAjax = 3;
  readonly loDB = 4;

  options = [
    'from static variable',
    'from session storage',
    'from local storage',
    'from localhost:3000',
    'from firebase db',
  ];

  TestOutput: string;

  EventName = 'imported data';
  EventData = '';

  Info = 'info';

  ok = false;

  eventDataKey = 'fr-event-data';
  keyString = 'key "fr-event-data"';

  @Output() dataLoaded = new EventEmitter<IEventDataItem>();

  public BOManager = inject(TBOManager);
  public snackBar = inject(MatSnackBar);

  constructor() {}

  ngOnInit() {}

  clear() {
    this.TestOutput = '';
    this.Info = 'pre text cleared';
  }

  load() {
    this.ok = false;
    this.Info = '';
    this.TestOutput = '';
    this.EventData = '';

    let t = '';

    switch (this.option) {
      case this.loStatic:
        this.EventData = TTestData.DefaultExample;
        this.ok = true;
        this.TestOutput = this.EventData;
        this.Info = 'default example retrieved from static variable.';
        break;

      case this.loSession:
        t = sessionStorage.getItem(this.eventDataKey);

        if (t === undefined) {
          this.Info = this.keyString + ' not found in sessionStorage, item undefined';
        } else if (t === null) {
          this.Info = this.keyString + ' not found in sessionStorage, item is null.';
        } else if (t === '') {
          this.Info = this.keyString + ' has no data, item is empty';
        } else {
          this.ok = true;
          this.EventData = t;
          this.TestOutput = this.EventData;
          this.Info = this.keyString + ' retrieved from session storage';
          this.openSnackBar(this.Info);
        }
        break;

      case this.loLocal:
        t = localStorage.getItem(this.eventDataKey);

        if (t === undefined) {
          this.Info = this.keyString + ' not found in localStorage, item undefined';
        } else if (t === null) {
          this.Info = this.keyString + ' not found in localStorage, item is null.';
        } else if (t === '') {
          this.Info = this.keyString + ' has no data, item';
        } else {
          this.ok = true;
          this.EventData = t;
          this.TestOutput = this.EventData;
          this.Info = this.keyString + ' retrieved from local storage';
          this.openSnackBar(this.Info);
        }
        break;

      case this.loAjax:
        this.Info = 'loading event data from localhost:3000 not implemented';
        break;

      case this.loDB:
        this.Info = 'loading event data from firebase NoSQL DB not implemented';
        break;

      default:
        this.Info = 'invalid selection';
        break;
    }
  }

  read() {
    if (this.ok && this.TestOutput !== '') {
      const ed = new IEventDataItem();
      ed.EventName = this.EventName;
      ed.EventData = this.TestOutput;
      this.dataLoaded.emit(ed);
    } else {
      this.Info = 'nothing to read, load data first';
    }
  }

  openSnackBar(msg: string) {
    this.snackBar.open(msg, null, { duration: 1500 });
  }
}
