import { TRaceNode } from '../col/race/race-node';
import { TBO } from '../fr/fr-bo';
import { TRaceRowCollection } from '../col/race/race-row-collection';
import { TRaceRowCollectionItem } from '../col/race/race-row-collection-item';
import { TPTime } from './time';
import { TQProxy, TQProxy1 } from './q-proxy';
import { TRaceBO } from '../col/race/race-bo';

export class TCalcTP {
  private qn: TRaceNode;
  private FProxy: TQProxy;

  constructor(public BO: TBO) {
    this.FProxy = new TQProxy1();
  }

  private LoadProxy(qn: TRaceNode, channel: number): void {
    const cl: TRaceRowCollection = qn.Collection;
    this.FProxy.Count = cl.Count;
    for (let i = 0; i < cl.Count; i++) {
      const cr: TRaceRowCollectionItem = cl.Items[i];
      this.FProxy.Bib[i] = cr.Bib;
      this.FProxy.DSQGate[i] = cr.DG;
      this.FProxy.Status[i] = cr.QU.AsInteger;
      this.FProxy.OTime[i] = cr.IT[channel].OTime.AsInteger;
    }
  }

  private UnLoadProxy(qn: TRaceNode, channel: number): void {
    const cl: TRaceRowCollection = qn.Collection;
    if (this.FProxy.Count !== cl.Count) {
      return;
    }
    for (let i = 0; i < cl.Count; i++) {
      const cr: TRaceRowCollectionItem = cl.Items[i];
      cr.IT[channel].Behind.AsInteger = this.FProxy.TimeBehind[i];
      cr.IT[channel].ORank = this.FProxy.ORank[i];
      cr.IT[channel].Rank = this.FProxy.Rank[i];
      cr.IT[channel].PosR = this.FProxy.PosR[i];
      cr.IT[channel].PLZ = this.FProxy.PLZ[i];
      cr.ru.BestTime[channel] = this.FProxy.BestOTime;
      cr.ru.BestIndex[channel] = this.FProxy.BestIndex;
    }
  }

  private CalcQA(): void {
    for (let i = 0; i <= this.BO.BOParams.ITCount; i++) {
      this.LoadProxy(this.qn, i);
      this.FProxy.Calc();
      this.UnLoadProxy(this.qn, i);
    }
  }

  Calc(aqn: TRaceNode): void {
    this.qn = aqn;
    this.CalcQA();
  }

  UpdateDynamicBehind(bo: TRaceBO, cr: TRaceRowCollectionItem, channel: number): void {
    let cl: TRaceRowCollection;
    // let rd: TRaceNode;
    let refTime: TPTime;

    if (cr == null) {
      return;
    }
    const rd = cr.ru;

    // Zwischenzeiten
    if (channel > 0) {
      // TimeBehind in Bezug auf die Zwischenzeit des IT-Besten
      cr.IT[channel].BPL.UpdateQualiTimeBehind(
        rd.BestTime[channel],
        cr.IT[channel].OTime.AsInteger,
      );

      // TimeBehind in Bezug auf die Zwischenzeit des FT-Besten
      cl = rd.Collection;
      refTime = cl.Items[rd.BestIndex[0]].IT[channel].OTime;
      if (rd.BestIndex[0] !== cr.IndexOfRow && refTime.TimePresent) {
        cr.IT[channel].BFT.UpdateQualiTimeBehind(refTime.AsInteger, cr.IT[channel].OTime.AsInteger);
      } else {
        cr.IT[channel].BFT.Clear();
      }
    } else {
      // Zielzeit
      cr.FT.BPL.UpdateQualiTimeBehind(rd.BestTime[0], cr.FT.OTime.AsInteger);
    }
  }

  get HighestBibGoesFirst(): boolean {
    return this.FProxy.HighestBibGoesFirst;
  }
  set HighestBibGoesFirst(value: boolean) {
    this.FProxy.HighestBibGoesFirst = value;
  }
}
