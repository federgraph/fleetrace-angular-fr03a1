import { TRace } from './scoring-race';
import { TRacePointsList } from './scoring-race-points-list';
import { TRacePoints } from './scoring-race-points';
import { TFinish } from './scoring-finish';
import { TRSPenalty, Constants } from './scoring-penalty';
import { TScoringLowPoint } from './scoring-low-point';

/**
 * altes DSV Punktsystem
 * 1.6 - 2.9 - 4.0 - 5.0 - ...
 */
export class TScoringBonusPointDSV extends TScoringLowPoint {
  override getID(): number {
    return 2;
  }
  override getName(): string {
    return 'Bonus Point DSV';
  }

  protected override scoreRace1(
    r: TRace,
    points: TRacePointsList,
    firstIs75: boolean,
    positionOnly: boolean,
  ): void {
    // sort points on finishposition sorted top to bottom by finish
    points.sortFinishPosition();

    let pts = 0;

    // position within the divsion (as opposed to within the fleet)
    let divPosition = 1;

    // loop thru the race's finishes, for each finish in the list, set the points
    points.forEach((rp: TRacePoints) => {
      const f: TFinish = rp.Finish;
      let basePts: number = pts;
      rp.Position = divPosition++;

      if (f.FinishPosition.isValidFinish() && !f.Penalty.isDsqPenalty()) {
        // increment points to be assigned to next guy if this
        // guy is a valid finisher and not disqualified
        if (pts === 0) {
          pts = 16;
        } else if (pts === 16) {
          pts = 29;
        } else if (pts === 29) {
          pts = 40;
        } else {
          pts = pts + 10;
        }
      } else {
        rp.Position = f.FinishPosition.intValue();
      }
      if (f.hasPenalty()) {
        basePts = this.getPenaltyPoints(f.Penalty, points, basePts);
      }
      if (!positionOnly) {
        rp.Points = basePts / 10.0;
      }
    });

    if (!positionOnly) {
      // look for ties - must be done with correctedtime
      let lastrp: TRacePoints = null;
      const tied: TRacePoints[] = new Array<TRacePoints>();
      points.forEach((rp: TRacePoints) => {
        if (rp.isTied(lastrp)) {
          // boats are tied if neither has a penalty
          // and the current boat has a valid corrected time,
          // and its the same as the last corrected time
          if (tied.length === 0) {
            tied.push(lastrp);
          }
          tied.push(rp);
        } else if (tied.length > 0) {
          // coming out of set of tied boats, reset their points and clear out
          this.setTiedPoints(tied);
          tied.length = 0;
        }
        lastrp = rp;
      });
      // if processing tieds at end of loop
      if (tied.length > 0) {
        this.setTiedPoints(tied);
      }
    }
  }

  override getPenaltyPoints(p: TRSPenalty, rpList: TRacePointsList, basePts: number): number {
    let nEntries = 0;
    if (rpList != null) {
      nEntries = rpList.Count;
    }

    let result: number = super.getPenaltyPoints(p, rpList, basePts);

    if (p.hasPenalty(Constants.DNS)) {
      result = nEntries;
    } else if (p.hasPenalty(Constants.DNC)) {
      result = nEntries;
    } else if (p.hasPenalty(Constants.DNF)) {
      result = nEntries;
    } else if (p.isDsqPenalty()) {
      result = nEntries;
    }

    return result * 10;
  }
}
