import { TEntry } from './scoring-entry';
import { TScoringUtils } from './scoring-utils';


/**
 * abstract class,
 * is linked to an Entry,
 * contains position and points information,
 * implemented as RacePoints and SeriesPoints
 */
export abstract class TPoints {
    Entry: TEntry;
    Points: number;
    Position: number;

    constructor(entry: TEntry, points: number, pos: number) {
        this.Entry = entry;
        this.Points = points;
        this.Position = pos;
    }

    EqualsWithNull(left: object, right: object): boolean {
        try {
            // static equals method of object handles nulls without exception
            // return object.equals(left, right);
            return TScoringUtils.equals(left, right);
            // return left.equals(right);
        } catch {
            return (right == null);
        }
    }

    equals(that: TPoints): boolean {
        if (this === that) {
            return true;
        }
        if (!that) {
            return false;
        }

        if (this.Points !== that.Points) {
            return false;
        }
        if (this.Position !== that.Position) {
            return false;
        }
        if (!this.EqualsWithNull(this.Entry, that.Entry)) {
            return false;
        }
        return true;
    }

}
