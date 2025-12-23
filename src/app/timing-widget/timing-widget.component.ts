import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ITimingParams } from '../shared/test-data';

@Component({
  selector: 'app-timing-widget',
  templateUrl: './timing-widget.component.html',
  styleUrls: ['./timing-widget.component.css'],
})
export class TimingWidgetComponent {
  @Input() race = 1;
  @Input() timepoint = 0;

  @Output() newTimeAvailable = new EventEmitter<ITimingParams>();

  bvM = 'M';
  bvP = 'P';

  bv0 = 0;
  bv1 = 1;
  bv2 = 2;
  bv3 = 3;
  bv4 = 4;
  bv5 = 5;
  bv6 = 6;
  bv7 = 7;
  bv8 = 8;
  bv9 = 9;

  offset = 0;

  updateBtnValue(delta: number) {
    if (delta < 0 && this.offset < 10) {
      return;
    }
    if (delta > 0 && this.offset > 80) {
      return;
    }

    this.bv0 += delta;
    this.bv1 += delta;
    this.bv2 += delta;
    this.bv3 += delta;
    this.bv4 += delta;
    this.bv5 += delta;
    this.bv6 += delta;
    this.bv7 += delta;
    this.bv8 += delta;
    this.bv9 += delta;

    this.offset += delta;
  }

  clickM() {
    this.updateBtnValue(-10);
  }
  clickP() {
    this.updateBtnValue(10);
  }

  click0() {
    this.clickBib(0);
  }
  click1() {
    this.clickBib(1);
  }
  click2() {
    this.clickBib(2);
  }
  click3() {
    this.clickBib(3);
  }
  click4() {
    this.clickBib(4);
  }
  click5() {
    this.clickBib(5);
  }
  click6() {
    this.clickBib(6);
  }
  click7() {
    this.clickBib(7);
  }
  click8() {
    this.clickBib(8);
  }
  click9() {
    this.clickBib(9);
  }

  clickBib(btn: number) {
    const bib = this.offset + btn;

    const t: ITimingParams = {
      race: this.race,
      tp: this.timepoint,
      bib: bib,
    };

    this.newTimeAvailable.emit(t);
  }
}
