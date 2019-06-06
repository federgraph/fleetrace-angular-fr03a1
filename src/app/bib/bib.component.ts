import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { TBOManager } from '../../bo/bo-manager';
import { TEventRaceEntry } from '../../col/event/event-race-entry';

@Component({
  selector: 'app-bib-tab',
  templateUrl: './bib.component.html',
  styleUrls: ['./bib.component.css']
})
export class BibComponent implements OnInit, OnChanges {

  @Input() bib: number = 0;

  dn: string = '';
  nc: string = '';
  series: string = '';
  result: number = 0;

  constructor(public BOManager: TBOManager) {

  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.update();
  }

  clear() {
    this.dn = '';
    this.nc = '';
    this.series = '';
    this.result = 0;
  }

  update() {
    const cr = this.BOManager.BO.EventNode.FindBib(this.bib);
    if (!cr) {
      this.clear();
    } else {
      this.dn = cr.DN;
      this.nc = cr.NC;
      this.result = cr.GPosR;
      let t = '';
      let ere: TEventRaceEntry;
      for (let r = 1; r < cr.Race.length; r++) {
        ere = cr.Race[r];
        if (r > 1) {
          t += '-';
        }
        // t += ere.OTime;
        t += ere.RaceValue;
      }
      this.series = t;
    }
  }

}
