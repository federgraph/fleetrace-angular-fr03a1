import { Component, OnInit, Input } from '@angular/core';
import { TBOManager } from '../../bo/bo-manager';
import { JsonInfo } from '../shared/data-array';
import { ApiService } from '../shared/api.service';
import { RaceDataJson } from '../shared/data-model';

@Component({
  selector: 'app-result-upload',
  templateUrl: './result-upload.component.html',
  styleUrls: ['./result-upload.component.scss']
})
export class ResultUploadComponent implements OnInit {

  @Input() race: number = 1;

  Info: string = 'info';
  TestOutput: any = '';

  jsonInfo: JsonInfo;

  constructor(public BOManager: TBOManager, private apiService: ApiService) {
    this.jsonInfo = new JsonInfo(BOManager);
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
    this.apiService.push3(t).subscribe(data => this.TestOutput = data.retvalue);
    this.TestOutput = '';
  }

  clear() {
    this.Info = 'info';
    this.TestOutput = 'Json Preview to be shown here.';
  }

}
