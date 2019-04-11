import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, } from 'rxjs/operators';
import { RaceDataJson, EventDataJson, ApiRetValue} from './data-model';

export class EventParams {
  raceCount: number;
  itCount: number;
  startlistCount: number;
}

export class TimingParams {
  race: number;
  tp: number;
  bib: number;
}

export class SimpleText {
  EventDataSimpleText: string[];
}
  
export class ConnectionStatus {
  connected: boolean;
  websockets: boolean;
}

const JsonOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

class QueryOptions {
  headers: HttpHeaders;
  params: HttpParams;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  AspNet: boolean = true;

  constructor(private http: HttpClient) { }

  //AngularID = 53
  getSimpleText(): Observable<SimpleText> {
    if (this.AspNet) {
      return this.http.get<SimpleText>('/api/Data/GetSimpleJson', {});
    }
    return this.http.get<SimpleText>('/api/get-simple-json', {});
  }

  //AngularID = 1
  inputWireConnect(): Observable<string> {
    if (this.AspNet) {
      return this.http.get('/api/Node/InputWireConnect', { responseType: 'text' });
    }
    return this.http.get('/api/input-wire-connect', { responseType: 'text' });
  }

  //AngularID = 2
  inputWireDisconnect(): Observable<string> {
    if (this.AspNet) {      
      return this.http.get('/api/Node/InputWireDisconnect', { responseType: 'text' });
    }
    return this.http.get('/api/input-wire-disconnect', { responseType: 'text' });
  }

  //AngularID = 51
  getConnectionStatus(): Observable<ConnectionStatus> {
    if (this.AspNet) {
      return this.http.get<ConnectionStatus>('/api/Node/InputConnectionStatus', {});
    }
    return this.http.get<ConnectionStatus>('/api/get-input-connection-status', {});
  }

  //AngularID = 3
  outputWireConnect(): Observable<string> {
    if (this.AspNet) {
      return this.http.get('/api/Node/OutputWireConnect', { responseType: 'text' });
    }
    return this.http.get('/api/output-wire-connect', { responseType: 'text' });
  }

  //AngularID = 4
  outputWireDisconnect(): Observable<string> {
    if (this.AspNet) {
      return this.http.get('/api/Node/OutputWireDisconnect', { responseType: 'text' });
    }
    return this.http.get('/api/output-wire-disconnect', { responseType: 'text' });
  }

  //AngularID = 52
  getOpuputConnectionStatus(): Observable<ConnectionStatus> {
    if (this.AspNet) {
      return this.http.get<ConnectionStatus>('/api/Node/OutputConnectionStatus', {});
    }
    return this.http.get<ConnectionStatus>('/api/get-output-connection-status', {});
  }

  //AngularID = 5
  queryParams(): Observable<EventParams> {
    if (this.AspNet) {
      return this.http.get<EventParams>('/api/Node/QueryParams', {});
    }
    return this.http.get<EventParams>('/api/query-params', {});
  }

  //AngularID = 6
  manageClear(): Observable<string> {
    if (this.AspNet) {
      return this.http.get('/api/Delphi/ManageClear', { responseType: 'text' });
    }
    return this.http.get('/api/manage-clear', { responseType: 'text' });
  }

  //AngularID = 7
  manageClearRace(race: number): Observable<string> {
    if (this.AspNet) {      
      return this.http.get(`/api/Delphi/ManageClearRace?race=${race}`, { responseType: 'text' });
    }
    return this.http.get(`/api/manage-clear-race?race=${race}`, { responseType: 'text' });
  }

  //AngularID = 8
  manageGoBackToRace(race: number): Observable<string> {
    if (this.AspNet) {
      return this.http.get(`/api/Delphi/ManageGoBackToRace?race=${race}`, { responseType: 'text' });
    }
    return this.http.get(`/api/manage-go-back-to-race?race=${race}`, { responseType: 'text' });
  }
  
  //AngularID = 9
  manageClearTimepoint(race: number, it: number): Observable<string> {
    if (this.AspNet) {
      return this.http.get(`/api/Delphi/ManageClearTimepoint?race=${race}&it=${it}`, { responseType: 'text' });
    }
    return this.http.get(`/api/manage-clear-timepoint?race=${race}&it=${it}`, { responseType: 'text' });
  }

  //AngularID = 10
  sendTime(race: number, it: number, bib: number): Observable<string> {
    if (this.AspNet) {
      return this.http.get(`/api/Delphi/Time?race=${race}&it=${it}&bib=${bib}`, { responseType: 'text' });
    }
    return this.http.get(`/api/widget/time?race=${race}&it=${it}&bib=${bib}`, { responseType: 'text' });
  }

  //AngularID = 11
  sendMsg(value: string): Observable<string> {
    if (this.AspNet) {
      return this.http.get(`/api/Delphi/SendMsg?value=${value}`, { responseType: 'text' });
    }
    return this.http.get(`/api/send-msg?value=${value}`, { responseType: 'text' });
  }

  //AngularID = 12
  requestNetto(): Observable<string> {
    //get-input-netto
    if (this.AspNet) {
      return this.http.get('/api/Node/Netto', {responseType: 'text'});
    }
    return this.http.get('/api/widget/netto', {responseType: 'text'});
  }

  //AngularID = 13
  requestOutputNetto(): Observable<string> {
    if (this.AspNet) {
      return this.http.get('/api/Node/OutputNetto', {responseType: 'text'});
    }
    return this.http.get('/api/widget/get-output-netto', {responseType: 'text'});
  }

  //AngularID = 14
  requestInputNetto(): Observable<string> {
    if (this.AspNet) {
      return this.http.get('/api/Node/InputNetto', {responseType: 'text'});
    }
    return this.http.get('/api/widget/get-input-netto', {responseType: 'text'});
  }

  //AngularID = 15
  requestNetto1(): Observable<string> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', 'http://localhost/3000');

    if (this.AspNet) {
      return this.http.get('api/Node/Netto', {
        "headers": headers,
        "responseType": 'text'
      });
    }

    return this.http.get('api/widget/netto', {
      "headers": headers,
      "responseType": 'text'
    });
  }

  //AngularID = 16
  pullEventData(): Observable<string> {
    if (this.AspNet) {
      return this.http.get('/api/Data/EventData', { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
    }
    return this.http.get('/api/event-data', { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
  }

  //AngularID = 17
  pullEventDataJson(): Observable<EventDataJson> {
    if (this.AspNet) {
      return this.http.get<EventDataJson>('/api/Data/EventDataJson', JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
    }
    return this.http.get<EventDataJson>('/api/event-data-json', JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  //AngularID = 18
  pullRaceDataJson(race: number): Observable<RaceDataJson> {
    let p: HttpParams = new HttpParams();
    p = p.set('race', race.toString());

    const o: QueryOptions =  new QueryOptions();
    o.headers = JsonOptions.headers;
    o.params = p;

    if (this.AspNet) {
      return this.http.get<RaceDataJson>('/api/Data/RaceDataJson', o)
      .pipe(
        catchError(this.handleError)
      );
    }
    return this.http.get<RaceDataJson>('/api/race-data-json', o)
      .pipe(
        catchError(this.handleError)
      );
  }

  //AngularID = 19
  pushEventData(value: string): Observable<ApiRetValue> {
    if (this.AspNet) {
      return this.http.post<ApiRetValue>('/api/Data/PushEventData', value, JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
    }
    return this.http.post<ApiRetValue>('/api/event-data', value, JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  //AngularID = 20
  pushEventDataJson(value: EventDataJson): Observable<ApiRetValue> {
    if (this.AspNet) {
      return this.http.post<ApiRetValue>('/api/Data/PushEventDataJson', value, JsonOptions)
      .pipe(
        catchError(this.handleError)
      );      
    }
    return this.http.post<ApiRetValue>('/api/event-data-json', value, JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  //AngularID = 21
  pushRaceDataJsonForRace(race: number, value: RaceDataJson): Observable<ApiRetValue> {
    let p: HttpParams = new HttpParams();
    p = p.set('race', race.toString());

    const o: QueryOptions =  new QueryOptions();
    o.headers = JsonOptions.headers;
    o.params = p;

    if (this.AspNet) {
      return this.http.post<ApiRetValue>('/api/Data/PushRaceDataJsonForRace', value, o)
      .pipe(
        catchError(this.handleError)
      );
    }
    return this.http.post<ApiRetValue>('/api/race-data-json', value, o)
      .pipe(
        catchError(this.handleError)
      );
  }
    
  //AngularID = 22
  pushRaceDataJson(value: RaceDataJson): Observable<ApiRetValue> {
    if (this.AspNet) {
      return this.http.post<ApiRetValue>('/api/Data/PushRaceDataJson', value, JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
    }
    return this.http.post<ApiRetValue>('/api/rd.json', value, JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  //AngularID = 23

  //AngularID = 24

  //AngularID = 25
  readFromSlot(id: number): Observable<string> {
    if (this.AspNet) {
      return this.http.get(`api/Slot/UD/${id}`, { responseType: 'text' });
    }
        return this.http.get(`ud${id}`, { responseType: 'text' });
  }

  //AngularID = 26
  push2(value: EventDataJson): Observable<ApiRetValue> {
    if (this.AspNet) {
      return this.http.post<ApiRetValue>('/api/Slot/2', value, JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
    }
    return this.http.post<ApiRetValue>('/ud/2', value, JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  //AngularID = 27
  push3(value: RaceDataJson): Observable<ApiRetValue> {
    if (this.AspNet) {
      return this.http.post<ApiRetValue>('/api/Slot/3', value, JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
    }
    return this.http.post<ApiRetValue>('/ud/3', value, JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  //AngularID = 28
  pull2(): Observable<EventDataJson> {
    if (this.AspNet) {
      return this.http.get<EventDataJson>('/api/Slot/2', JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
    }
    return this.http.get<EventDataJson>('/ud/2', JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  //AngularID = 29
  pull3(): Observable<RaceDataJson> {
    if (this.AspNet) {
      return this.http.get<RaceDataJson>('/api/Slot/3', JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
    }
    return this.http.get<RaceDataJson>('/ud/3', JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  //AngularID = 30
  getBackup(): Observable<string[]> {
    if (this.AspNet) {
      return this.http.get<string[]>('/api/Bridge/Backup', JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
    }
    return this.http.get<string[]>('/api/backup', JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  //AngularID = 31
  getBacklog(): Observable<string[]> {
    if (this.AspNet) {
      return this.http.get<string[]>('/api/Bridge/Backlog', JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
    }
    return this.http.get<string[]>('/api/backlog', JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  //AngularID = 32
  getBackupAndLog(): Observable<string[]> {
    if (this.AspNet) {
      return this.http.get<string[]>('/api/Bridge/BackupAndLog', JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
    }
    return this.http.get<string[]>('/api/backup-and-log', JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  //AngularID = 33
  getBackupString(): Observable<string> {
    if (this.AspNet) {
      return this.http.get('/api/Bridge/BackupString', { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
    }
    return this.http.get('/api/backup-string', { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
  }

  //AngularID = 34
  getBacklogString(): Observable<string> {
    if (this.AspNet) {
      return this.http.get('/api/Bridge/BacklogString', { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
    }
    return this.http.get('/api/backlog-string', { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
  }

  //AngularID = 35
  getBackupAndLogString(): Observable<string> {
    if (this.AspNet) {
      return this.http.get('/api/Bridge/BackupAndLogString', { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
    }
    return this.http.get('/api/backup-and-log-string', { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
  }
  
  //AngularID = 36
  getBackupAndLogJsonString(): Observable<string> {
    if (this.AspNet) {
      return this.http.get('/api/Bridge/BackupAndLogJsonString', { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
    }
    return this.http.get('/api/backup-and-log-json-string', { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
  }

  pushED(value: EventDataJson): Observable<ApiRetValue> {
    return this.http.post<ApiRetValue>('/api/ed.json', value, JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  pushRD(value: RaceDataJson): Observable<ApiRetValue> {
    return this.http.post<ApiRetValue>('/api/rd.json', value, JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  pullED(): Observable<EventDataJson> {
    return this.http.get<EventDataJson>('/api/ed.json', JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  pullRD(): Observable<RaceDataJson> {
    return this.http.get<RaceDataJson>('/api/rd.json', JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  replaceRaceDataJson(race: number, value: RaceDataJson): Observable<ApiRetValue> {
    let p: HttpParams = new HttpParams();
    p = p.set('race', race.toString());

    const o: QueryOptions =  new QueryOptions();
    o.headers = JsonOptions.headers;
    o.params = p;

    return this.http.post<ApiRetValue>('/api/replace-race-data', value, o)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  pushRJ(value: RaceDataJson): Observable<ApiRetValue> {
    return this.http.post<ApiRetValue>('/api/rd.json', value, JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  pushEJ(value: EventDataJson): Observable<ApiRetValue> {
    return this.http.post<ApiRetValue>('/api/ed.json', value, JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  uploadRaceDataJson(value: RaceDataJson): Observable<ApiRetValue> {
    return this.http.post<ApiRetValue>('/ud/3', value, JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  uploadEventDataJson(value: EventDataJson): Observable<ApiRetValue> {
    return this.http.post<ApiRetValue>('/ud/2', value, JsonOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  //AngularID = 37
  /**
   * @param mode layout 1 = finish, layout 2 = points
   */
  getEventTableJson(mode: number): Observable<string> {
    if (this.AspNet) {
      return this.http.get(`/api/Delphi/GetEventTableJson?mode=${mode}`, {responseType: 'text'});
    }
    return this.http.get(`/api/widget/get-event-table-json?mode=${mode}`, {responseType: 'text'});
  }

  //AngularID = 38
  getFinishTableJson(): Observable<string> {
    if (this.AspNet) {
      return this.http.get('/api/Widget/GetFinishTableJson', {responseType: 'text'});
    }
    return this.http.get('/api/widget/get-finish-table-json', {responseType: 'text'});
  }

  //AngularID = 39
  getPointsTableJson(): Observable<string> {
    if (this.AspNet) {
      return this.http.get('/api/Delphi/GetPointsTableJson', {responseType: 'text'});
    }
    return this.http.get('/api/widget/get-points-table-json', {responseType: 'text'});
  }

  //AngularID = 40
  getNarrowRaceTableJson(race: number, it: number): Observable<string> {
    if (this.AspNet) {
      return this.http.get(`/api/Delphi/GetNarrowRaceTableJson?race=${race}&it=${it}`, {responseType: 'text'});
    }
    return this.http.get(`/api/widget/get-narrow-race-table-json?race=${race}&it=${it}`, {responseType: 'text'});
  }

  //AngularID = 41
  getWideRaceTableJson(race: number, it: number): Observable<string> {
    if (this.AspNet) {    
      return this.http.get(`/api/Delphi/GetWideRaceTableJson?race=${race}&it=${it}`, {responseType: 'text'});
    }
    return this.http.get(`/api/widget/get-wide-race-table-json?race=${race}&it=${it}`, {responseType: 'text'});
  }

  //AngularID = 42
  getRaceTableJson(): Observable<string> {
    if (this.AspNet) {
      return this.http.get('/api/Delphi/GetRaceTableJson', {responseType: 'text'});
    }
    return this.http.get('/api/widget/get-race-table-json', {responseType: 'text'});
  }

  //AngularID = 43
  getRaceTableHtml(): Observable<string> {
    if (this.AspNet) {
      return this.http.get('/api/Delphi/GetRaceTableHtml', {responseType: 'text'});
    }
    return this.http.get('/api/widget/get-race-table-html', {responseType: 'text'});
  }

  //AngularID = 44
  getTime(race: number, it: number, bib: number): Observable<string> {
    if (this.AspNet) {      
      return this.http.get(`/api/Delphi/DoTime?race=${race}&it=${it}&bib=${bib}`, {responseType: 'text'});
    }
    return this.http.get(`/api/widget/do-time?race=${race}&it=${it}&bib=${bib}`, {responseType: 'text'});
  }

  //AngularID = 45
  getFinish(race: number, bib: number): Observable<string> {
    if (this.AspNet) {
      return this.http.get(`/api/Delphi/DoFinish?race=${race}&bib=${bib}`, {responseType: 'text'});
    }
    return this.http.get(`/api/widget/do-finish?race=${race}&bib=${bib}`, {responseType: 'text'});
  }

  //AngularID = 46
  getTimeAndTable(race: number, it: number, bib: number): Observable<string> {
    if (this.AspNet) {
      return this.http.get(`/api/Delphi/DoTimeForTable?race=${race}&it=${it}&bib=${bib}`, {responseType: 'text'});
    }
    return this.http.get(`/api/widget/do-time-for-table?race=${race}&it=${it}&bib=${bib}`, {responseType: 'text'});
  }

  //AngularID = 47
  getFinishAndTable(race: number, bib: number): Observable<string> {
    if (this.AspNet) {
      return this.http.get(`/api/Delphi/DoFinishForTable?race=${race}&bib=${bib}`, {responseType: 'text'});
    }
    return this.http.get(`/api/widget/do-finish-for-table?race=${race}&bib=${bib}`, {responseType: 'text'});
  }

  //AngularID = 48
  getTimingEventForTable(race: number, it: number, bib: number, option: number, mode: number): Observable<string> {
    if (this.AspNet) {
      return this.http
      .get(`/api/Delphi/DoTimingEventForTable?race=${race}&it=${it}&bib=${bib}&option=${option}&mode=${mode}`,
      {responseType: 'text'});
    }
    return this.http
    .get(`/api/widget/do-timing-event-for-table?race=${race}&it=${it}&bib=${bib}&option=${option}&mode=${mode}`,
    {responseType: 'text'});
  }

  //AngularID = 49
  getTimingEvent(race: number, it: number, bib: number, option: number): Observable<string> {
    if (this.AspNet) {
      return this.http
      .get(`/api/Delphi/DoTimingEvent?race=${race}&it=${it}&bib=${bib}&option=${option}`,
      {responseType: 'text'});
    }
    return this.http
    .get(`/api/widget/do-timing-event?race=${race}&it=${it}&bib=${bib}&option=${option}`,
    {responseType: 'text'});
  }

  //AngularID = 50
  /**
   * Trigger generation of time and/or  finish position on server.
   * But this version does not do status updates and it cannot do erasures.
   * */
  getTimingEventQuick(race: number, it: number, bib: number): Observable<string> {
    if (this.AspNet) {
      return this.http.get(`/api/Delphi/DoTimingEventQuick?race=${race}&it=${it}&bib=${bib}`, {responseType: 'text'});
    }
    return this.http.get(`/api/widget/do-timing-event-quick?race=${race}&it=${it}&bib=${bib}`, {responseType: 'text'});
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    }
    else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

}
