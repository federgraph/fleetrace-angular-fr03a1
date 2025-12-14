import { TRace } from './scoring-race';
import { TRaceList } from './scoring-race-list';
import { TRacePointsList } from './scoring-race-points-list';
import { TEntryList } from './scoring-entry-list';
import { TSeriesPointsList } from './scoring-series-points-list';
import { TRSPenalty } from './scoring-penalty';

/**
 * Interface that any scoring system must implement so that it can be managed by ScoringManager
 */
export interface IScoringModel {
  getName(): string;
  getID(): number;

  /**
   * pulls parameters from the sourceModel
   * @param value the originating model from which parameters are drawn
   */
  setAttributes(value: IScoringModel): void;

  /**
   * Given a Race and a list of Entries, calculates the RacePoints objects
   * The entries should be assumed to represent a single class within the Race
   * scoreRace can assume that an Entry without a finish in the Race is DNC
   * but should recognize that the Race may well have finishers not in the Entries.
   *
   * Can assume:
   * (1) that any 'NoFinish penalties' have been properly passed
   *     thru to the FinishPosition.
   * (2) FinishPosition is otherwise sound and matches finishtimes if any
   * (3) All items in Entry list should be valid racers in the Race
   * (4) None of race, entries, or points is null
   *
   * @param race the Race to be scored
   * @param points >a list of racepoints in which the points should be stored
   * @param positionOnly when true do NOT recalculate race points, do race position only
   */
  scoreRace(race: TRace, points: TRacePointsList, positionOnly: boolean): void;

  /**
   * Given a list or races, entries, points lists..
   * calculates the overall series points.
   * Assume that each individual race has already been calculated,
   * and that throwouts have already been designated in the points objects.
   * Do not worry about tiebreakers.
   *
   * @param races list of races involved in the series
   * @param entries list of entries whose series totals are to be calculated
   * @param points list of points for all races and entries (and maybe more)
   * @param series map in which (key=entry, value=Double) series points are to be calculated.
   */
  scoreSeries(
    races: TRaceList,
    entries: TEntryList,
    points: TRacePointsList,
    series: TSeriesPointsList,
  ): void;

  /**
   * resolve ties among a group of tied boats.  A tie that is breakable
   * should have .01 point increments added as appropriate.
   * Assume that each individual race and series points have calculated, and that
   * throwouts have already been designated in the points objects.
   *
   * @param races list of involved races, in the order they were sailed
   * @param entries list of tied entries
   * @param points list of points for all races and entries (and maybe more!)
   * @param series map containing series points for the entries, prior to handling ties (and maybe more)
   */
  calculateTieBreakers(
    races: TRaceList,
    entries: TEntryList,
    points: TRacePointsList,
    series: TSeriesPointsList,
  ): void;

  /**
   * Given a penalty, returns the number of points to be assigned.
   * Do NOT handle AVG, it will be dealt with by ScoringManager.
   * Note that the race could be null, and basePts might be 0 or NaN
   *
   * @param p the Penalty to be calculated
   * @param rpList the RacePointsList of the points being calculated
   * @param basePts the points calculated before applying a penalty
   */
  getPenaltyPoints(p: TRSPenalty, rpList: TRacePointsList, basePts: number): number;

  /**
   * Calculates throwouts... its also the responsibility of the ScoringModel to manage the setting of throwout criteria
   *
   * @param list list of the RacePoints for all races of one entry for which throwouts should be considered
   */
  calcThrowouts(pointsList: TRacePointsList): void;

  /**
   * Sorts a list of series points from best to worst
   */
  sortSeries(seriesPoints: TSeriesPointsList): void;
}
