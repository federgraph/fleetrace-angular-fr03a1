import { TSeriesPoints } from './scoring-series-points';
import { TEntry } from './scoring-entry';
import { TEntryList } from './scoring-entry-list';
import { environment } from '../environments/environment';

export class TSeriesPointsList extends Array<TSeriesPoints> {
  constructor() {
    super();
    if (environment.wantES5) {
      Object.setPrototypeOf(this, TSeriesPointsList.prototype);
    }
  }

  get Count() {
    return this.length;
  }

  Add(p: TSeriesPoints) {
    this.push(p);
  }

  AddRange(cl: TSeriesPointsList) {
    cl.forEach((cr) => this.Add(cr));
  }

  Clear() {
    this.length = 0;
  }

  /**
   * Returns first (and hopefully only) value in list for entry.
   */
  findPoints(e: TEntry): TSeriesPoints | null {
    let p: TSeriesPoints;
    for (let i = 0; i < this.length; i++) {
      p = this[i];

      if (p.EqualsWithNull(p.Entry, e)) {
        return p;
      }
    }
    return null;
  }

  findAllPoints(e: TEntry): TSeriesPointsList {
    const list: TSeriesPointsList = new TSeriesPointsList();
    this.forEach((p: TSeriesPoints) => {
      if (p.Entry != null && p.Entry.equals(e)) {
        list.Add(p);
      }
    });
    return list;
  }

  /**generates a string of elements
   */
  override toString(): string {
    let sb = 'splist=(';
    let i = 0;
    this.forEach((o: object) => {
      i++;
      sb += o.toString();
      if (i < this.length) {
        sb += ',';
      }
    });
    sb += ')';
    return sb;
  }

  /**
   * Clears old list, adds a new seriespoint for each entry to self.
   * @param entries list of entries
   * @return copy of list
   */
  initPoints(entries: TEntryList): TSeriesPointsList {
    this.Clear();
    const list: TSeriesPointsList = new TSeriesPointsList();
    entries.forEach((e: TEntry) => {
      const sp: TSeriesPoints = new TSeriesPoints(e);
      this.Add(sp);
      list.Add(sp);
    });
    return list;
  }

  sortPosition(): void {
    this.sort(this.ComparePosition);
  }

  ComparePosition(left: TSeriesPoints, right: TSeriesPoints) {
    if (left == null && right == null) {
      return 0;
    }
    if (left == null) {
      return -1;
    }
    if (right == null) {
      return 1;
    }

    const ileft = left.Position;
    const iright = right.Position;

    if (ileft < iright) {
      return -1;
    }
    if (ileft > iright) {
      return 1;
    }
    return 0;
  }

  sortPoints() {
    this.sort(this.ComparePoints);
  }

  ComparePoints(left: TSeriesPoints, right: TSeriesPoints) {
    if (left == null && right == null) {
      return 0;
    }
    if (left == null) {
      return -1;
    }
    if (right == null) {
      return 1;
    }

    // need to compare by EntryID also, because Sort is not a stable sort,
    // order of elements is not preserved if elements are equal
    return left.compareTo(right);
  }
}
