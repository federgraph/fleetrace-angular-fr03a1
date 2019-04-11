import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { TEventDataMenu } from '../shared/asset-menu';
import { TEventDataAsset, IEventDataItem, IEventDataFolder } from '../shared/test-data';

@Component({
  selector: 'app-test-data',
  templateUrl: './test-data.component.html',
  styleUrls: ['./test-data.component.css']
})
export class TestDataComponent {
  EDM: TEventDataMenu;

  Folder: string;
  Items: Array<string> = [];

  CurrentEventAsset: TEventDataAsset;
 
  @Output() dataAvailable: EventEmitter<IEventDataItem> = new EventEmitter();

  constructor(private httpClient: HttpClient) {
    this.EDM = new TEventDataMenu();
    this.CurrentEventAsset = new TEventDataAsset();
  }
 
  selectFolder(menu: IEventDataFolder) {
    this.Folder = menu.Folder;
    this.Items = menu.Items;
  }

  loadEvent(en: string) {
    // this.CurrentEventAsset.EventName = en;
    // const pn = this.EDM.Path;
    // this.loadAssetText(`/assets/${pn}/${this.Folder}/${en}.txt`);    
  }
  
  loadAssetText(fn: string): void {
    this.httpClient.get(fn, {responseType: 'text'}).subscribe(
        data => this.onAssetAvailable(data),
        (err: HttpErrorResponse) => console.log(`Got error: ${err}`)
     );    
  }

  /**async event handler, used loadEvent() */
  onAssetAvailable(data: string) {
    if (data !== "") {
      this.CurrentEventAsset.EventData = data;
      this.dataAvailable.emit(this.CurrentEventAsset);
    }
    else {
      console.log("test data component: cannot load asset data.");
    }
  }

}
