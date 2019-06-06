import { TStringList } from '../util/fb-strings';
import { TEventNode } from '../col/event/event-row-collection';

export class TCalcEventProxy {
    static ScoringResult = -1;
    static ScoringExceptionLocation = '';
    static ScoringExceptionMessage = '';

    WithTest: boolean = false;
    EventName: string = '';
    HighestBibGoesFirst: boolean = false;

    Calc(aqn: TEventNode): void {
    }

    GetScoringNotes(SL: TStringList): void {
        SL.Add('TCalcEventProxy.GetScoringNotes');
    }
}
