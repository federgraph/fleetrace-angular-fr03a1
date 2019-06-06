import {Injectable} from '@angular/core';
import { Subscriber ,  Observable } from 'rxjs';

@Injectable()
export class WebsocketService {
  private ws: WebSocket;

  createObservableSocket(url: string, sub: Subscriber<any>): Observable<any> {
    this.ws = new WebSocket(url);
    return new Observable(observer => {
      this.ws.onmessage = event => observer.next(event.data);
      this.ws.onerror = event => observer.error(event);
      this.ws.onclose = event => observer.complete();
      this.ws.onopen = event => {
        sub.next();
        sub.complete();
      };
      return () => this.ws.close();
    });
  }

  send(message: any) {
    this.ws.send(JSON.stringify(message));
  }

}
