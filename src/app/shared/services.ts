import { ApiService } from './api.service';
import { TimingService } from './timing.service';
import { WebsocketService } from './websocket.service';

export const ONLINE_SERVICES = [ApiService, TimingService, WebsocketService];
