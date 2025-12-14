import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { EventParams } from '../shared/data-model';

import { TBOManager } from '../../bo/bo-manager';
import { MaterialModule } from '../material/material.module';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-form-event-params',
  imports: [ReactiveFormsModule, MaterialModule, JsonPipe],
  templateUrl: './form-event-params.component.html',
  styleUrls: ['./form-event-params.component.css'],
})
export class FormEventParamsComponent implements OnInit {
  JsonVisible = false;
  form: FormGroup;
  formData: EventParams;

  @Output() paramsChanged = new EventEmitter<EventParams>();

  ngOnInit() {
    this.createForm();
  }

  public BOManager = inject(TBOManager);
  private fb = inject(FormBuilder);

  constructor() {
    this.formData = new EventParams();
  }

  createForm() {
    this.form = this.fb.group({
      params: this.fb.group(new EventParams(), Validators.required),
    });

    this.form
      .get('params.raceCount')
      .setValidators([Validators.required, Validators.min(1), Validators.max(20)]);
    this.form
      .get('params.itCount')
      .setValidators([Validators.required, Validators.min(0), Validators.max(12)]);
    this.form
      .get('params.startlistCount')
      .setValidators([Validators.required, Validators.min(2), Validators.max(120)]);
  }

  patch() {
    const bop = this.BOManager.BO.BOParams;
    this.formData.createOption = 0;
    this.formData.raceCount = bop.RaceCount;
    this.formData.itCount = bop.ITCount;
    this.formData.startlistCount = bop.StartlistCount;

    this.form.patchValue({
      params: this.formData,
    });
  }

  submit() {
    const v = this.form.value;
    const ep = v.params as EventParams;
    this.paramsChanged.emit(ep);
  }

  reset() {
    this.formData = new EventParams();
    this.rebuildForm();
  }

  rebuildForm() {
    this.form.reset({
      params: this.formData,
    });
  }

  toggleJson() {
    this.JsonVisible = !this.JsonVisible;
  }
}
