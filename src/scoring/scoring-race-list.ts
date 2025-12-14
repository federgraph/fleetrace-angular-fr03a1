import { TRace } from './scoring-race';

export class TRaceList extends Array<TRace> {
  constructor() {
    super();
    Object.setPrototypeOf(this, TRaceList.prototype);
  }

  get Count(): number {
    return this.length;
  }

  Add(r: TRace) {
    this.push(r);
  }
}
