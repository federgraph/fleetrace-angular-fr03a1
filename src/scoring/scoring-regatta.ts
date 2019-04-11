import { TEntryList } from "./scoring-entry-list";
import { TRaceList } from "./scoring-race-list";
import { TScoringManager } from "./scoring-manager";
import { TEntry } from "./scoring-entry";

export class TRegatta {
    static IsInFinalPhase = false;

    Entries: TEntryList;
    Races: TRaceList;

    Name = "";

    constructor(public ScoringManager: TScoringManager) {
        this.Entries = new TEntryList();
        this.Races = new TRaceList();
    }

    ScoreRegatta(): void {
        try {
            this.ScoringManager.scoreRegatta(this, this.Races);
        }
        catch (ex) {
            console.log("error in scoreRegatta " + ex.Message);
        }
    }

    compareTo(that: TRegatta): number {
        if (!that)
            return - 1;
        if (this === that)
            return 0;

        // return this.Name.compareTo(that.Name);            

        if (this.Name < that.Name)
            return -1;
        else if (this.Name > that.Name)
            return 1;
        else
            return 0;
    }

    toString(): string {
        return this.Name;
    }

    AddEntry(e: TEntry) {
        this.Entries.Add(e);
    }

}
