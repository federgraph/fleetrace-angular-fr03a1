import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { EntryRow } from '../shared/data-model';

import { TBOManager } from '../../bo/bo-manager';
import { MaterialModule } from '../material/material.module';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-form-entry-row',
  imports: [MaterialModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './form-entry-row.component.html',
  styleUrls: ['./form-entry-row.component.css'],
})
export class FormEntryRowComponent implements OnInit {
  JsonVisible = false;
  form: FormGroup;
  formData: EntryRow;

  @Output() entryRowChanged = new EventEmitter<EntryRow>();
  @Output() entryDeleted = new EventEmitter<number>();

  public BOManager = inject(TBOManager);
  private fb = inject(FormBuilder);

  constructor() {
    this.formData = new EntryRow();
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      entry: this.fb.group(new EntryRow()),
    });

    this.form
      .get('entry.SNR')
      .setValidators([Validators.required, Validators.min(1), Validators.max(10000)]);
  }

  delete() {
    const ac = this.form.get('entry.SNR');
    if (ac.valid) {
      const snr = ac.value as number;
      const cr = this.BOManager.BO.StammdatenNode.Collection.FindKey(snr);
      if (cr) {
        cr.Collection.Delete(cr.Index);
        this.entryDeleted.emit(snr);
      }
    }
  }

  patch() {
    const ac = this.form.get('entry.SNR');
    if (ac.valid) {
      const snr = ac.value as number;
      const cr = this.BOManager.BO.StammdatenNode.Collection.FindKey(snr);
      if (cr) {
        console.assert(snr === cr.SNR);
        this.formData.SNR = cr.SNR;
        this.formData.N1 = cr.FN;
        this.formData.N2 = cr.LN;
        this.formData.N3 = cr.SN;
        this.formData.N4 = cr.NC;
        this.formData.N5 = cr.GR;
        this.formData.N6 = cr.PB;

        this.form.patchValue({
          entry: this.formData,
        });
      }
    }
  }

  submit() {
    const v = this.form.value;
    const o = v.entry as EntryRow;
    this.entryRowChanged.emit(o);
  }

  reset() {
    this.formData = new EntryRow();
    const snr = this.form.get('entry.SNR').value;
    if (snr && snr > 0) {
      this.formData.SNR = snr;
    }
    this.rebuildForm();
  }

  rebuildForm() {
    this.form.reset({
      entry: this.formData,
    });
  }

  toggleJson() {
    this.JsonVisible = !this.JsonVisible;
  }
}
