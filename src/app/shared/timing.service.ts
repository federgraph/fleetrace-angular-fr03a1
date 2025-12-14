import { map } from 'rxjs/operators';
import { inject, Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable, Subscriber } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class TimingService {
  wsurl: string;

  private webSocket = inject(WebsocketService);

  constructor() {
    if (environment.production) {
      this.wsurl = 'ws://' + window.location.hostname + ':3000';
    } else {
      this.wsurl = 'ws://' + environment.apiHost + ':3000';
    }
  }

  send(appId: number, msg: string) {
    this.webSocket.send({ id: appId, msg: msg });
  }

  watchRace(raceId: number): Observable<any> {
    const sub = Subscriber.create(() => this.webSocket.send({ id: raceId, msg: 'empty' }));

    return this.webSocket
      .createObservableSocket(this.wsurl, sub)
      .pipe(map((message) => JSON.parse(message)));
  }
}
