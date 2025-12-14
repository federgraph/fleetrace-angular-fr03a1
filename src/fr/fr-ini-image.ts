import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TIniImage {
  PortIn = 3427;
  PortOut = 3428;
  SearchForUsablePorts = false;
  ScoringProvider = 0;
}
