import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IEventDataItem, TEventDataAsset } from '../shared/test-data';

@Component({
  selector: 'app-featured-event',
  templateUrl: './featured-event.component.html',
  styleUrls: ['./featured-event.component.scss']
})
export class FeaturedEventComponent {

  Counter: number = 0;
  Info: string = "info";
  Error: string = "";
  HasError: boolean = false;
  CurrentEventData: IEventDataItem;

  @Output() dataAvailable: EventEmitter<IEventDataItem> = new EventEmitter();

  FeaturedUrl = '/api/event-data';

  constructor(private httpClient: HttpClient) { 
    this.CurrentEventData = new TEventDataAsset();
  }

  show() {
    this.Info = this.FeaturedUrl;
    this.Error = '';
    this.HasError = false;
  }

  clear() {
    this.Info = 'info';
    this.Error = '';
    this.HasError = false;
  }

  loadEvent() {
    this.Counter++;
    this.Info = `loadEvent called (${this.Counter}).`;
    this.Error = '';
    this.HasError = false;
    this.CurrentEventData.EventName = 'Featured Event';
    this.loadEventDataItem(this.FeaturedUrl);
  }
  
  loadEventDataItem(fn: string): void {
    this.httpClient.get(fn, {responseType: 'text'}).subscribe(    
      data => this.onEventDataItemAvailable(data), 
      (err: HttpErrorResponse) => {
        console.log('Error detected in loadEventDataItem.');
        this.Error = 'Got error, see console log for more detailed info.';
        this.HasError = true;
      }
    );    
  }

  onEventDataItemAvailable(data: string) {
    if (data !== "") {
      this.CurrentEventData.EventData = data;
      this.dataAvailable.emit(this.CurrentEventData);
    }
    else {
      console.log("featured-event: cannot load event data item.");
    }
  }

}
