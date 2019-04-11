import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EventParams } from '../shared/data-model';
import { TBOManager } from '../../bo/bo-manager';

@Component({
  selector: 'app-form-event-params-quick',
  templateUrl: './form-event-params-quick.component.html',
  styleUrls: ['./form-event-params-quick.component.scss']
})
export class FormEventParamsQuickComponent implements OnInit {

  newEvent = false;

  RaceCount: number = 2;
  ITCount: number = 0;
  StartlistCount: number = 8;

  @Output() paramsChanged: EventEmitter<EventParams> = new EventEmitter();

  constructor(public BOManager: TBOManager) { }

  ngOnInit() {
    this.patch();
  }

  noop() {

  }

  raceDelta(delta: number) {
    if (delta < 0 && this.RaceCount > 1) {
      this.RaceCount--;
    }
    else if (delta > 0 && this.RaceCount < 21) {
      this.RaceCount++;
    }    
  }

  itDelta(delta: number) {
    if (delta < 0 && this.ITCount > 0) {
      this.ITCount--;
    }
    else if (delta > 0 && this.ITCount < 24) {
      this.ITCount++;
    }
  }

  slDelta(delta: number) {
    if (delta < 0 && this.StartlistCount > 2) {
      this.StartlistCount--;
    }
    else if (delta > 0 && this.StartlistCount < 200) {
      this.StartlistCount++;
    }
  }
  
  reset() {
    this.RaceCount= 2;
    this.ITCount = 0;
    this.StartlistCount = 8;
  }

  patch() {
    const bop = this.BOManager.BO.BOParams;
    this.RaceCount = bop.RaceCount;
    this.ITCount = bop.ITCount;
    this.StartlistCount = bop.StartlistCount;
  }

  submit() {
    const ep = new EventParams();
    
    if (this.newEvent)
      ep.createOption = 0;
    else
      ep.createOption = 1;

    ep.raceCount = this.RaceCount;
    ep.itCount = this.ITCount;
    ep.startlistCount = this.StartlistCount;
    
    this.paramsChanged.emit(ep);
  }

}
