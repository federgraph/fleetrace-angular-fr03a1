import { TPoints } from './scoring-points';
import { TRace } from './scoring-race';
import { TFinish } from './scoring-finish';
import { TEntry } from './scoring-entry';
import { TRSPenalty, Constants } from './scoring-penalty';
import { TScoringUtils } from './scoring-utils';

/**
 * Contains points information on an entry in a race
 * This is separated from the Finish object because
 * when fleet scoring gets implemented
 * an entry could have more than one score for a single finish
 */
export class TRacePoints extends TPoints {
  public static NextRacePointID = 1;
  RacePointID: number;

  Race: TRace;
  IsThrowout: boolean;

  private fFinish: TFinish;

  /**
   * for debugging so boat's SailID pops up in debugger listing
   */
  protected aSailID = 0;

  constructor(race: TRace, entry: TEntry, points: number, throwout: boolean) {
    super(entry, points, 0);
    this.RacePointID = TRacePoints.NextRacePointID;
    TRacePoints.NextRacePointID++;

    if (entry != null) {
      this.aSailID = entry.SailID;
    }
    this.Race = race;
    this.IsThrowout = throwout;
    this.fFinish = null;
  }

  isTied(lastrp: TRacePoints): boolean {
    // can throw NullpointerException
    const f: TFinish = this.Finish;
    return (
      lastrp != null &&
      f.FinishPosition.intValue() !== 0 && // && f.CorrectedTime != SailTime.NOTIME
      !f.hasPenalty() &&
      !lastrp.Finish.hasPenalty() &&
      f.FinishPosition.intValue() === lastrp.Finish.FinishPosition.intValue() // && lastrp.Finish.CorrectedTime == f.CorrectedTime
    );
  }

  get Finish(): TFinish | null {
    if (this.fFinish == null) {
      if (this.Race == null) {
        return null;
      }
      if (this.Entry == null) {
        return null;
      }
      this.fFinish = this.Race.getFinish(this.Entry);
    }
    return this.fFinish;
  }

  /**
   * compares based on the points, ignores the throwout
   */
  compareTo(that: TPoints): number {
    if (that == null) {
      return -1;
    }
    try {
      if (this.Points < that.Points) {
        return -1;
      } else if (this.Points > that.Points) {
        return 1;
      }
      return 0;
    } catch {
      return -1;
    }
  }

  override equals(that: TRacePoints): boolean {
    if (this === that) {
      return true;
    }
    if (!super.equals(that)) {
      return false;
    }
    if (this.IsThrowout !== that.IsThrowout) {
      return false;
    }
    if (!this.EqualsWithNull(this.Race, that.Race)) {
      return false;
    }
    return true;
  }

  override toString(): string {
    return this.ToStringB(true);
  }

  ToStringB(showPts: boolean) {
    const finish: TFinish = this.Finish;
    const penalty: TRSPenalty = finish.Penalty;
    let sb = '';

    let didPts = false;
    if (showPts || !finish.hasPenalty() || penalty.isOtherPenalty()) {
      const s = TScoringUtils.toStringF2(this.Points);
      sb += s;
      didPts = true;
    }

    if (penalty.isDsqPenalty()) {
      const ptemp: TRSPenalty = finish.Penalty.Clone();
      ptemp.clearPenalty(Constants.NF);
      if (didPts) {
        sb += '/';
      }
      sb += ptemp.ToStringB(false);
    } else if (finish.hasPenalty()) {
      if (didPts) {
        sb += '/';
      }
      sb += penalty.ToStringB(false);
    }

    if (this.IsThrowout) {
      sb = '[' + sb;
      sb += ']';
    }
    return sb;
  }

  get IsMedalRace(): boolean {
    if (this.Finish == null || this.Race == null) {
      return false;
    }
    return this.Finish.Fleet === 0 && this.Race.IsFinalRace;
  }
}
