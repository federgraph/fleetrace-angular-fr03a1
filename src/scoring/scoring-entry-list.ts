import { TEntry } from './scoring-entry';
import { environment } from '../environments/environment';

export class TEntryList extends Array<TEntry> {

    constructor() {
        super();
        if (environment.wantES5) {
            Object.setPrototypeOf(this, TEntryList.prototype);
        }
    }

    Clear() {
        this.length = 0;
    }

    Add(e: TEntry) {
        this.push(e);
    }

    Contains(e: TEntry) {
        return this.includes(e);
    }

    get Count(): number { return this.length; }

    getDuplicateIDs(): TEntryList {
        this.sortSailId();
        const dupList: TEntryList = new TEntryList();

        let laste: TEntry = null;
        let lastid = -1;
        this.forEach((e: TEntry) => {
            const id: number = e.SailID;

            if (laste != null) {
                if (lastid === id) {
                    if (!dupList.includes(laste)) {
                        dupList.push(laste);
                    }
                    dupList.push(e);
                }
            }
            laste = e;
            lastid = id;
        });

        return dupList;
    }

    findId(snr: number): TEntryList {
        const list: TEntryList = new TEntryList();
        this.forEach((e: TEntry) => {
            if (e.SailID === snr) {
                list.push(e);
            }
        });
        return list;
    }

    CloneEntries(): TEntryList {
        const result: TEntryList = new TEntryList();
        this.forEach((e: TEntry) => {
            result.push(e);
        });
        return result;
    }

    sortSailId(): void {
        this.sort(this.compareSailID);
    }

    compareSailID(left: TEntry, right: TEntry): number {
        if (left == null && right == null) {
            return 0;
        }
        if (left == null) {
            return - 1;
        }
        if (right == null) {
            return 1;
        }
        return left.CompareSailID(right.SailID);
    }

}

