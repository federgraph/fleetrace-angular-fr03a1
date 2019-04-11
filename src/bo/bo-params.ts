import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TBOParams {

    IsAdapter = false;

    MaxStartlistCount = 128;
    MinStartlistCount = 1;
    StartlistCount = 1;

    MinRaceCount = 1;
    MaxRaceCount = 1;
    RaceCount = 1;

    MinITCount = 0;
    MaxITCount = 10;
    ITCount = 1;

    FieldCount = 6;

    DivisionName = "*";

    constructor() {
        this.MaxStartlistCount = 256;
        this.MinStartlistCount = 2;
        this.StartlistCount = 8;

        this.MinRaceCount = 1;
        this.MaxRaceCount = 20;
        this.RaceCount = 2;
        this.FieldCount = 6;

        this.MinITCount = 0;
        this.MaxITCount = 10;
        this.ITCount = 1;
    }

    equals(that: TBOParams): boolean {
        return (this.RaceCount === that.RaceCount &&
            this.ITCount === that.ITCount &&
            this.StartlistCount === that.StartlistCount);
    }

    Assign(o: TBOParams): void {
        this.IsAdapter = o.IsAdapter;

        this.MaxStartlistCount = o.MaxStartlistCount;
        this.MinStartlistCount = o.MinStartlistCount;
        this.StartlistCount = o.StartlistCount;

        this.MinRaceCount = o.MinRaceCount;
        this.MaxRaceCount = o.MaxRaceCount;
        this.RaceCount = o.RaceCount;

        this.MinITCount = o.MinITCount;
        this.MaxITCount = o.MaxITCount;
        this.ITCount = o.ITCount;

        this.DivisionName = o.DivisionName;
    }

    ForceWithinLimits(): void {
        if (this.RaceCount < this.MinRaceCount)
            this.RaceCount = this.MinRaceCount;
        if (this.RaceCount > this.MaxRaceCount)
            this.RaceCount = this.MaxRaceCount;

        if (this.ITCount < this.MinITCount)
            this.ITCount = this.MinITCount;
        if (this.ITCount > this.MaxITCount)
            this.ITCount = this.MaxITCount;

        if (this.StartlistCount < this.MinStartlistCount)
            this.StartlistCount = this.MinStartlistCount;
        if (this.StartlistCount > this.MaxStartlistCount)
            this.StartlistCount = this.MaxStartlistCount;
    }

    IsWithinLimits(): boolean {
        return this.RaceCount >= this.MinRaceCount
            && this.ITCount >= this.MinITCount
            && this.StartlistCount >= this.MinStartlistCount

            && this.RaceCount <= this.MaxRaceCount
            && this.ITCount <= this.MaxITCount
            && this.StartlistCount <= this.MaxStartlistCount;
    }

    get DivisionID(): number {
        switch (this.DivisionName) {
            case "Europe": return 1;
            case "Laser": return 2;
            case "Finn": return 3;
            case "470women": return 4;
            case "470men": return 5;
            case "49er": return 6;
            case "Tornado": return 7;
            case "Yngling": return 8;
            case "Star": return 9;
            case "MistralWomen": return 10;
            case "MistralMen": return 11;
            default: return 0;
        }

    }
}

