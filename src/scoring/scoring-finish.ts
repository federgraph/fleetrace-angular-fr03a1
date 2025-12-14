import { TRace } from './scoring-race';
import { TEntry } from './scoring-entry';
import { TFinishPosition } from './scoring-finish-position';
import { TRSPenalty, Constants } from './scoring-penalty';

export class TFinish {
  static NextFinishID = 1;
  private FinishID: number;
  Fleet = 0;
  IsRacing = true;

  Race: TRace;
  Entry: TEntry;
  private fPosition: TFinishPosition;
  private fPenalty: TRSPenalty;

  constructor(
    inRace: TRace,
    inEntry: TEntry,
    inOrder: TFinishPosition = new TFinishPosition(Constants.NOF),
    inPenalty: TRSPenalty = new TRSPenalty(Constants.NOF),
  ) {
    this.FinishID = TFinish.NextFinishID;
    TFinish.NextFinishID++;
    this.Race = inRace;
    this.Entry = inEntry;
    this.fPosition = inOrder;
    this.fPenalty = inPenalty == null ? new TRSPenalty() : inPenalty;
    if (this.fPenalty.isFinishPenalty()) {
      this.fPosition = new TFinishPosition(this.fPenalty.Penalty);
    }
  }

  get FinishPosition(): TFinishPosition {
    return this.fPosition;
  }
  set FinishPosition(value: TFinishPosition) {
    this.fPosition = value;
    if (TRSPenalty.IsFinishPenalty(value.intValue())) {
      this.Penalty.FinishPenalty = value.intValue();
    }
  }

  get Penalty(): TRSPenalty {
    return this.fPenalty;
  }
  set Penalty(value: TRSPenalty) {
    if (value == null) {
      value = new TRSPenalty();
    }
    this.fPenalty = value;
  }

  /**
   * sorts based on finishes WITHOUT regard to penalites except for non-finishing penalties
   */
  compareTo(that: TFinish): number {
    return this.fPosition.compareTo(that.fPosition);
  }

  equals(that: TFinish): boolean {
    if (this === that) {
      return true;
    }
    if (this.Entry == null ? that.Entry != null : !this.Entry.equals(that.Entry)) {
      return false;
    }
    if (this.fPenalty == null ? that.fPenalty != null : !this.fPenalty.equals(that.fPenalty)) {
      return false;
    }
    return true;
  }

  toString(): string {
    let sb = '';
    if (this.Entry == null) {
      sb += '<null entry>';
    } else {
      sb += this.Entry.toString();
      sb += '/ ';
      if (this.fPosition != null) {
        sb += this.fPosition.toString();
      }
      if (this.fPenalty != null) {
        sb += '[';
        sb += this.fPenalty.toString();
        sb += ']';
      }
    }
    return sb.toString();
  }

  isNoFinish(): boolean {
    return this.fPosition.isNoFinish();
  }

  hasPenalty(): boolean {
    return this.fPenalty.Penalty !== Constants.NOP;
  }

  HasPenalty(pen: TRSPenalty): boolean {
    return this.fPenalty.Penalty === pen.Penalty;
  }

  hasPenaltyN(ipen: number): boolean {
    return this.fPenalty.Penalty === ipen;
  }
}
