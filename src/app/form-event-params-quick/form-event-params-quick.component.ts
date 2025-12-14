import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { EventParams } from '../shared/data-model';
import { TBOManager } from '../../bo/bo-manager';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

@Component({
  selector: 'app-form-event-params-quick',
  imports: [FormsModule, MaterialModule],
  templateUrl: './form-event-params-quick.component.html',
  styleUrls: ['./form-event-params-quick.component.scss'],
})
export class FormEventParamsQuickComponent implements OnInit {
  newEvent = false;

  RaceCount = 2;
  ITCount = 0;
  StartlistCount = 8;

  @Output() paramsChanged = new EventEmitter<EventParams>();

  public BOManager = inject(TBOManager);

  constructor() {}

  ngOnInit() {
    this.patch();
  }

  noop() {}

  raceDelta(delta: number) {
    if (delta < 0 && this.RaceCount > 1) {
      this.RaceCount--;
    } else if (delta > 0 && this.RaceCount < 21) {
      this.RaceCount++;
    }
  }

  itDelta(delta: number) {
    if (delta < 0 && this.ITCount > 0) {
      this.ITCount--;
    } else if (delta > 0 && this.ITCount < 24) {
      this.ITCount++;
    }
  }

  slDelta(delta: number) {
    if (delta < 0 && this.StartlistCount > 2) {
      this.StartlistCount--;
    } else if (delta > 0 && this.StartlistCount < 200) {
      this.StartlistCount++;
    }
  }

  reset() {
    this.RaceCount = 2;
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

    if (this.newEvent) ep.createOption = 0;
    else ep.createOption = 1;

    ep.raceCount = this.RaceCount;
    ep.itCount = this.ITCount;
    ep.startlistCount = this.StartlistCount;

    this.paramsChanged.emit(ep);
  }
}
