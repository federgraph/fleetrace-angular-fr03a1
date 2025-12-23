import { TRacePoints } from './scoring-race-points';
import { TFinish } from './scoring-finish';
import { Constants, TRSPenalty } from './scoring-penalty';
import { TEntry } from './scoring-entry';
import { TRace } from './scoring-race';
import { TFinishPosition } from './scoring-finish-position';
import { TEntryList } from './scoring-entry-list';

export class TRacePointsList extends Array<TRacePoints> {
  constructor() {
    super();
  }

  get Count() {
    return this.length;
  }

  Clear() {
    this.length = 0;
  }

  Add(p: TRacePoints) {
    this.push(p);
  }

  AddRange(cl: TRacePointsList) {
    cl.forEach((cr) => this.Add(cr));
  }
  Remove(p: TRacePoints) {
    const i = this.indexOf(p);
    if (i > -1) {
      this.splice(i, 1);
    }
  }

  // RemoveAll(cl: Array<TRacePoints>) {
  //     cl.forEach( cr => this.Remove(cr) );
  // }

  /**
   * calculates number of valid finishers in this list of race points;
   * NOTE: if any of the finishes are null, returns 0;
   * NOTE: this is computationally intensive, if you can go straight
   * to the raw finish list, that is better
   */
  get NumberFinishers(): number {
    let n = 0;
    this.forEach((pts: TRacePoints) => {
      if (pts.Race == null) {
        // if race is null, then must be series standings, assume all valid
        n++;
      } else {
        const f: TFinish = pts.Race.getFinish(pts.Entry);
        if (f != null && f.FinishPosition != null && f.FinishPosition.isValidFinish()) {
          n++;
        }
      }
    });
    return n;
  }

  /**
   * calculates number of valid starters in this list of race points;
   * NOTE: if any of the finishes are null, returns 0;
   * NOTE: this is computationally intensive, if you can go straight;
   * to the raw finish list, that is better
   */
  get NumberStarters(): number {
    let n = 0;
    this.forEach((pts: TRacePoints) => {
      if (pts.Race == null) {
        // if race is null, then must be series standings, assume all valid
        n++;
      } else {
        const f: TFinish = pts.Race.getFinish(pts.Entry);
        if (f != null && f.FinishPosition != null) {
          if (f.FinishPosition.isValidFinish()) {
            n++;
          } else if (
            !(f.Penalty.hasPenalty(Constants.DNC) || f.Penalty.hasPenalty(Constants.DNS))
          ) {
            n++;
          }
        }
      }
    });
    return n;
  }

  equals(obj: object): boolean {
    if (!obj) {
      return false;
    }
    if (this === obj) {
      return true;
    }

    try {
      const that: TRacePointsList = obj as TRacePointsList;
      if (that.length !== this.length) {
        return false;
      }

      for (let i = 0; i < this.length; i++) {
        const rpThis = this[i];
        const rpThat: TRacePoints = that.findPoints(rpThis.Race, rpThis.Entry);
        if (rpThat == null) {
          return false;
        }
        if (!rpThis.equals(rpThat)) {
          return false;
        }
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * returns first (and hopefully only) item in list for specified race and entry
   */
  findPoints(r: TRace, e: TEntry): TRacePoints {
    for (const p of this) {
      if (
        (e == null || (p.Entry != null && p.Entry.equals(e))) &&
        (r == null || (p.Race != null && p.Race.equals(r)))
      ) {
        return p;
      }
    }
    return null;
  }

  findAllPointsForEntry(entry: TEntry): TRacePointsList {
    const list: TRacePointsList = new TRacePointsList();
    this.forEach((p: TRacePoints) => {
      if (p.Entry != null && p.Entry.equals(entry)) {
        list.Add(p);
      }
    });
    return list;
  }

  findAllPointsForRace(race: TRace): TRacePointsList {
    const list: TRacePointsList = new TRacePointsList();
    this.forEach((p: TRacePoints) => {
      if (p.Race != null && p.Race.equals(race)) {
        list.Add(p);
      }
    });
    return list;
  }

  /**generates a string of elements
   */
  override toString(): string {
    let s = 'rplist=(';

    let i = 0;
    this.forEach((p: TRacePoints) => {
      i++;
      s += p.toString();
      if (i < this.length) {
        s += ',';
      }
    });
    s += ')';
    return s;
  }

  /** calculates number of racers with specified penalty;
   * NOTE: if any of the finishes are null, returns 0;
   * NOTE: this is computationally intensive, if you can go straight;
   * to the raw finish list, that is better
   */
  getNumberWithPenalty(pen: number): number {
    let n = 0;
    this.forEach((pts: TRacePoints) => {
      try {
        const f: TFinish = pts.Race.getFinish(pts.Entry);
        if (f.hasPenaltyN(pen)) {
          n++;
        }
      } catch {
        // trop and ignore
      }
    });
    return n;
  }

  clearAllEntries(e: TEntry): void {
    this.forEach((p: TRacePoints) => {
      if (p.Entry != null && p.Entry.equals(e)) {
        this.Remove(p);
      }
    });
  }

  clearAllRaces(r: TRace) {
    this.forEach((p: TRacePoints) => {
      if (p.Race != null && p.Race.equals(r)) {
        this.Remove(p);
      }
    });
  }

  /**
   * clears old points for race, and creates a new set of them,
   * returns a RacePointsList of points for this race.
   * AND autoamtically adds DNC finishes for entries without finishes
   */
  initPoints(r: TRace, entries: TEntryList): TRacePointsList {
    this.clearAllRaces(r);
    const rList: TRacePointsList = new TRacePointsList();
    entries.forEach((e: TEntry) => {
      let f: TFinish = r.getFinish(e);
      if (f == null) {
        f = new TFinish(r, e);
        f.FinishPosition = new TFinishPosition(Constants.DNC);
        f.Penalty = new TRSPenalty(Constants.DNC);
        r.Finish = f;
      }
      const rp: TRacePoints = new TRacePoints(f.Race, f.Entry, Number.NaN, false);
      this.Add(rp);
      rList.Add(rp);
    });
    return rList;
  }

  sortPosition(): void {
    this.sort(this.ComparePosition);
  }

  ComparePosition(left: TRacePoints, right: TRacePoints): number {
    if (left == null && right == null) {
      return 0;
    }
    if (left == null) {
      return -1;
    }
    if (right == null) {
      return 1;
    }
    return left.Finish.FinishPosition.compareTo(right.Finish.FinishPosition);
  }

  sortFinishPosition(): void {
    this.sort(this.CompareFinishPosition);
  }

  CompareFinishPosition(left: TRacePoints, right: TRacePoints): number {
    if (left == null && right == null) {
      return 0;
    }
    if (left == null) {
      return -1;
    }
    if (right == null) {
      return 1;
    }

    if (left.Finish == null) {
      return -1;
    }
    if (right.Finish == null) {
      return 1;
    }

    return left.Finish.FinishPosition.compareTo(right.Finish.FinishPosition);
  }

  sortRace(): void {
    this.sort(this.CompareRace);
  }

  CompareRace(left: TRacePoints, right: TRacePoints): number {
    if (left == null && right == null) {
      return 0;
    }
    if (left == null) {
      return -1;
    }
    if (right == null) {
      return 1;
    }
    try {
      return left.Race.compareTo(right.Race);
    } catch {
      return 0;
    }
  }

  sortPoints(): void {
    this.sort(this.ComparePoints);
  }

  ComparePoints(left: TRacePoints, right: TRacePoints): number {
    if (left == null && right == null) {
      return 0;
    }
    if (left == null) {
      return -1;
    }
    if (right == null) {
      return 1;
    }
    const c1: number = left.compareTo(right);
    if (c1 !== 0) {
      return c1;
    }
    return left.Finish.FinishPosition.compareTo(right.Finish.FinishPosition);
  }

  CloneEntries(): TRacePointsList {
    const result: TRacePointsList = new TRacePointsList();
    this.forEach((p: TRacePoints) => {
      result.Add(p);
    });
    return result;
  }
}
