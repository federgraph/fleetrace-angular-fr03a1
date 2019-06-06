import { environment } from '../environments/environment';

export class TEnumSet extends Array<boolean> {

    Count: number;

    constructor(highestIndex: number) {
        super();
        if (environment.wantES5) {
            Object.setPrototypeOf(this, TEnumSet.prototype);
        }
        this.Count = highestIndex + 1;
    }

    init(): void {
        this.length = this.Count;
        for (let i = 0; i < this.Count; i++) {
            this[i] = false;
        }
    }

    Clear(): void {
        this.init();
    }

    Assign(source: TEnumSet): void {
        this.Count = source.Count;
        this.init();

        source.forEach((value, index) => {
            this[index] = value;
        });
    }

    IsMember(index: number): boolean {
        if (index > -1 && index < this.Count && index < this.length) {
            return this[index];
        }
        return false;
    }

    get IsEmpty(): boolean {
        for (const b of this) {
            if (b) {
                return false;
            }
        }
        return true;
    }

    Include(index: number): void {
        if (this.IsValidIndex) {
            this[index] = true;
        }
    }

    Exclude(index: number): void {
        if (this.IsValidIndex) {
            this[index] = false;
        }
    }

    IsValidIndex(index: number): boolean {
        if (index > -1 && index < this.Count && index < this.length) {
            return true;
        }
        return false;
    }

}
