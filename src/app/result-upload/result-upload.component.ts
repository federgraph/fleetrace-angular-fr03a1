import { Component, OnInit, Input, inject } from '@angular/core';
import { TBOManager } from '../../bo/bo-manager';
import { JsonInfo } from '../shared/data-array';
import { JsonPipe } from '@angular/common';
import { ApiService } from '../shared/api.service';
import { RaceDataJson } from '../shared/data-model';
import { MaterialModule } from '../material/material.module';

@Component({
  selector: 'app-result-upload',
  imports: [MaterialModule, JsonPipe],
  templateUrl: './result-upload.component.html',
  styleUrls: ['./result-upload.component.scss'],
})
export class ResultUploadComponent implements OnInit {
  @Input() race = 1;

  Info = 'info';
  TestOutput: any = '';

  jsonInfo: JsonInfo;

  public BOManager = inject(TBOManager);
  private apiService = inject(ApiService);

  constructor() {
    this.jsonInfo = new JsonInfo(this.BOManager);
  }

  ngOnInit() {
    this.clear();
  }

  show() {
    this.Info = `show() called for race ${this.race}`;
    this.TestOutput = this.jsonInfo.getRaceDataJson(this.race);
  }

  post() {
    this.Info = `post() called for race ${this.race}`;
    const t: RaceDataJson = this.jsonInfo.getRaceDataJson(this.race);
    this.apiService.push3(t).subscribe((data) => (this.TestOutput = data.retvalue));
    this.TestOutput = '';
  }

  clear() {
    this.Info = 'info';
    this.TestOutput = 'Json Preview to be shown here.';
  }
}
