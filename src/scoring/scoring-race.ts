import { TFinishList } from './scoring-finish-list';
import { TFinish } from './scoring-finish';
import { TEntry } from './scoring-entry';
import { Constants, TRSPenalty } from './scoring-penalty';

export class TRace {
  static NextRaceID = 1;
  RaceID: number;

  NameID = 0;
  IsRacing = false;

  FinishList: TFinishList;

  HasFleets = false;
  TargetFleetSize = 8;
  IsFinalRace = false;

  constructor(inNameID: number) {
    this.RaceID = TRace.NextRaceID;
    TRace.NextRaceID++;
    this.NameID = inNameID;
    this.FinishList = new TFinishList();
  }

  /**
   * Adds or replaces the finish for value.Entry in this race.
   * Ignores the finish if value.Entry is not valid entrant.
   */
  set Finish(value: TFinish) {
    const e: TEntry = value.Entry;
    if (e == null || !this.isSailing(e)) {
      return;
    }
    const oldFinish: TFinish = this.FinishList.findEntry(e);
    if (oldFinish != null) {
      this.FinishList.Remove(oldFinish);
    }
    this.FinishList.push(value);
  }

  compareTo(that: TRace): number {
    if (this.equals(that)) {
      return 0;
    }
    if (this.NameID < that.NameID) {
      return -1;
    } else if (this.NameID === that.NameID) {
      return 0;
    }
    return 1;
  }

  equals(that: TRace): boolean {
    if (this === that) {
      return true;
    }
    try {
      return this.RaceID === that.RaceID;
    } catch {
      return false;
    }
  }

  /**
   * Return true if the specified entry should be sailing in the race.
   */
  isSailing(e: TEntry): boolean {
    return true;
  }

  toString(): string {
    if (this.NameID === 0) {
      return 'R?'; // Util.getString('noname');
    }
    return 'R' + this.NameID.toString();
  }

  /**
   * Returns the finish for entry e in this race.
   * May return null if entry e was not a valid entrant in this race.
   * If e is valid entrant but does not hae a finish, a finish with FinishPosition of NOFINISH is created and returned.
   */
  getFinish(e: TEntry): TFinish {
    if (!this.isSailing(e)) {
      return null;
    }
    let f: TFinish = this.FinishList.findEntry(e);
    if (f == null) {
      f = new TFinish(this, e);
      f.Penalty = new TRSPenalty(Constants.NOF);
    }
    return f;
  }
}
