import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IEventDataMenu, TEventDataAsset, IEventDataItem } from '../shared/test-data';

@Component({
  selector: 'app-event-menu',
  templateUrl: './event-menu.component.html',
  styleUrls: ['./event-menu.component.css']
})
export class EventMenuComponent implements OnInit {
  EDM: IEventDataMenu;

  CurrentEventData: IEventDataItem;

  eventMenu$: Observable<IEventDataMenu>;
  eventMenuSubscription: Subscription;
  eventMenuError: string = '';

  @Output() dataAvailable: EventEmitter<IEventDataItem> = new EventEmitter();

  constructor(private httpClient: HttpClient) {
    this.CurrentEventData = new TEventDataAsset();
    this.eventMenu$ = this.httpClient.get<IEventDataMenu>('/api/event-menu-json');
  }

  ngOnInit() {
    this.eventMenuSubscription = this.eventMenu$
      .subscribe(
        data => this.EDM = data,
        (err: HttpErrorResponse) =>
          this.eventMenuError = `Cannot load event-menu-json. Got ${err.message}`
      );
  }

  loadEvent(dn: string, en: string, i: number) {
    this.CurrentEventData.EventName = en;
    const pn = this.EDM.Path;
    this.loadEventDataItem(`/${pn}/${dn}/${i + 1}`);
  }

  loadEventDataItem(fn: string): void {
    this.httpClient.get(fn, {responseType: 'text'}).subscribe(
      data => this.onEventDataItemAvailable(data),
      (err: HttpErrorResponse) => console.log(`Got error: ${err}`)
    );
  }

  onEventDataItemAvailable(data: string) {
    if (data !== '') {
      this.CurrentEventData.EventData = data;
      this.dataAvailable.emit(this.CurrentEventData);
    } else {
      console.log('event-menu.component: cannot load event data item.');
    }
  }

  printEventMenu(): string {
    if (this.EDM) {
      return JSON.stringify(this.EDM, null, 2);
    } else {
      return 'EDM is null or undefined.';
    }
  }

}
