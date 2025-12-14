import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EventProps, NameFieldSchemaStrings, ScoringSystemStrings } from '../shared/data-model';

import { TBOManager } from '../../bo/bo-manager';
import { MaterialModule } from '../material/material.module';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-form-event-props',
  imports: [MaterialModule, JsonPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './form-event-props.component.html',
  styleUrls: ['./form-event-props.component.css'],
})
export class FormEventPropsComponent implements OnInit {
  JsonVisible = false;
  form: FormGroup;
  formData: EventProps;

  systems = ScoringSystemStrings;
  schemas = NameFieldSchemaStrings;

  @Output() propsChanged = new EventEmitter<EventProps>();

  ngOnInit() {
    this.createForm();
  }

  public BOManager = inject(TBOManager);
  private fb = inject(FormBuilder);

  constructor() {
    this.formData = new EventProps();
  }

  createForm() {
    this.form = this.fb.group({
      props: this.fb.group(new EventProps()),
    });
  }

  patch() {
    const ep = this.BOManager.BO.EventProps;
    this.formData.eventName = ep.EventName;
    this.formData.scoringSystem = ep.ScoringSystem;
    this.formData.schemaCode = ep.SchemaCode;
    this.formData.isTimed = ep.IsTimed;

    this.form.patchValue({
      props: this.formData,
    });
  }

  submit() {
    const v = this.form.value;
    const ep = v.props as EventProps;
    this.propsChanged.emit(ep);
  }

  reset() {
    this.formData = new EventProps();
    this.rebuildForm();
  }

  rebuildForm() {
    this.form.reset({
      props: this.formData,
    });
  }

  toggleJson() {
    this.JsonVisible = !this.JsonVisible;
  }
}
