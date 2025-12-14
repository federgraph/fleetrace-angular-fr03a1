export class TEntry {
  static NextEntryID = 1;
  EntryID: number;
  SailID = 0;

  constructor() {
    this.EntryID = TEntry.NextEntryID;
    TEntry.NextEntryID++;
  }

  compareTo(that: TEntry): number {
    if (!that) {
      return -1;
    }
    if (this.equals(that)) {
      return 0;
    }
    return this.CompareSailID(that.SailID);
  }

  CompareSailID(snr: number): number {
    if (this.SailID < snr) {
      return -1;
    }
    if (this.SailID === snr) {
      return 0;
    }
    return 1;
  }

  equals(that: TEntry): boolean {
    if (this === that) {
      return true;
    }
    try {
      return this.EntryID === that.EntryID;
    } catch {
      return false;
    }
  }

  toString() {
    return 'E' + this.SailID.toString();
  }
}
