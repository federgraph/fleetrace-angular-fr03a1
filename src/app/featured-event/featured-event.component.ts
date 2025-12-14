import { Component, Output, EventEmitter, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IEventDataItem, TEventDataAsset } from '../shared/test-data';
import { MaterialModule } from '../material/material.module';

@Component({
  selector: 'app-featured-event',
  imports: [MaterialModule],
  templateUrl: './featured-event.component.html',
  styleUrls: ['./featured-event.component.scss'],
})
export class FeaturedEventComponent {
  Counter = 0;
  Info = 'info';
  Error = '';
  HasError = false;
  CurrentEventData: IEventDataItem;

  @Output() dataAvailable = new EventEmitter<IEventDataItem>();

  FeaturedUrl = '/api/event-data';

  private httpClient = inject(HttpClient);

  constructor() {
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
    this.httpClient.get(fn, { responseType: 'text' }).subscribe(
      (data) => this.onEventDataItemAvailable(data),
      (err: HttpErrorResponse) => {
        console.log('Error detected in loadEventDataItem.');
        this.Error = 'Got error, see console log for more detailed info.';
        this.HasError = true;
      },
    );
  }

  onEventDataItemAvailable(data: string) {
    if (data !== '') {
      this.CurrentEventData.EventData = data;
      this.dataAvailable.emit(this.CurrentEventData);
    } else {
      console.log('featured-event: cannot load event data item.');
    }
  }
}
