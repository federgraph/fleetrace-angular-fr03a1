import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TIniImage {
  PortIn: number = 3427;
  PortOut: number = 3428;
  SearchForUsablePorts: boolean = false;
  ScoringProvider: number = 0;
}
