import { IScoringModel } from "./scoring-model";
import { TRaceList } from "./scoring-race-list";
import { TRacePointsList } from "./scoring-race-points-list";
import { TSeriesPointsList } from "./scoring-series-points-list";
import { TEntryList } from "./scoring-entry-list";
import { TSeriesPoints } from "./scoring-series-points";

/**
 * covering class to run tied boats through a tiebreaker
 * looks thru seriespoints lists, gathers groups of tied boats and
 * calls an breakTies method to handle that group of tied boats
 * which delegates to concrete implementation
 */
export class TScoringTiebreaker {
    private fModel: IScoringModel;
    private fRaces: TRaceList;
    private racePoints: TRacePointsList;
    private seriesPoints: TSeriesPointsList;

    constructor(model: IScoringModel, rlist: TRaceList, rpl: TRacePointsList, spl: TSeriesPointsList) {
        this.fModel = model;
        this.fRaces = rlist;
        this.racePoints = rpl;
        this.seriesPoints = spl;
    }

    protected get Races(): TRaceList {
        return this.fRaces;
    }

    process(): void {
        const tiedBunch: TEntryList = new TEntryList();
        let basePoints: TSeriesPoints = this.seriesPoints[0];

        for (let i = 1; i < this.seriesPoints.Count; i++) {
            const newPoints: TSeriesPoints = this.seriesPoints[i];

            if (basePoints.Points === newPoints.Points) {
                // have a tie, see if starting a new group
                if (tiedBunch.Count === 0) {
                    tiedBunch.Add(basePoints.Entry);
                }
                tiedBunch.Add(newPoints.Entry);
            }
            else {
                // this one not tie, send bunch to tiebreaker resolution
                if (tiedBunch.Count > 0) {
                    this.breakTies(tiedBunch);
                    tiedBunch.Clear();
                }
                basePoints = newPoints;
            }
        }

        // at end of loop, see if we are tied at the bottom
        if (tiedBunch.Count > 0) {
            this.breakTies(tiedBunch);
        }
    }

    // public virtual void breakTies(EntryList tiedBunch)
    breakTies(tiedBunch: TEntryList): void {
        this.fModel.calculateTieBreakers(this.fRaces, tiedBunch, this.racePoints, this.seriesPoints);
    }

}
