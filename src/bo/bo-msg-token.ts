import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })  
export class TMsgToken {
    cAppTitle = 'App';
   
    // atoms
    cTokenA = 'FR';
    cTokenB = '*';
    
    // composite
    cTokenModul = 'A.';
    cTokenSport = 'A.B.';

    cTokenRequest = "A.B.Request.";
    cTokenAnonymousRequest = 'A.*.Request.';
    cTokenCC = "A.B.CC.";

    cTokenOutput = 'A.B.Output.';
    cTokenAnonymousOutput = 'A.*.Output.';
    cTokenOutputXML = 'A.B.Output.XML.';
    cTokenOutputCSV = 'A.B.Output.CSV.';
    cTokenOutputHTM = 'A.B.Output.HTM.';

    readonly cTokenID = 'SNR';
    readonly cTokenBib = 'Bib';
    readonly cTokenCount = 'Count';
    readonly cTokenMsg = 'Msg';
    readonly cTokenXX = 'XX';

    // special
    readonly cTokenRace = 'W';
    readonly cTokenOption = 'Graph';
    
    cDefaultPortSet = 3;

    LongToken(t: string): string {
        // long tokens are disabled
        return t;
    }

    SetDivisionName(Value: string) {
        this.cTokenB = Value;
        this.cTokenSport = this.cTokenA + '.' + Value + '.';
        this.cTokenOutput = this.cTokenSport + 'Output.';
        this.cTokenAnonymousRequest = this.cTokenA + '.*.Request.';
        this.cTokenAnonymousOutput = this.cTokenA + '.*.Output.';
    }

    get DevisionName(): string {
        return this.cTokenB;
    }
    set DivisionName(value: string) {
        this.cTokenB = value;
        this.cTokenModul = this.cTokenA + ".";
        this.cTokenSport = this.cTokenModul + this.cTokenB + ".";
        this.cTokenCC = this.cTokenSport + "CC.";
        this.cTokenRequest = this.cTokenSport + "Request.";
        this.cTokenAnonymousRequest = this.cTokenModul + "*.Request.";
        this.cTokenOutput = this.cTokenSport + "Output.";
        this.cTokenOutputXML = this.cTokenOutput + "XML.";
        this.cTokenOutputCSV = this.cTokenOutput + "CSV.";
        this.cTokenOutputHTM = this.cTokenOutput + "HTM.";
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
