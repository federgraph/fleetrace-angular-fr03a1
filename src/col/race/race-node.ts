import { TBaseNode } from '../../grid/col-grid';
import { TRaceRowCollection } from './race-row-collection';
import { TRaceRowCollectionItem } from './race-row-collection-item';
import { TRaceColGrid, TRaceColProps } from './race-grid';
import { TBO } from '../../fr/fr-bo';
import { TStammdatenRowCollection } from '../stammdaten/stammdaten-row-collection';
import { TNotifyEvent } from '../../grid/grid-def';
import { TRaceColProp } from './race-col-prop';
import { TPTime } from '../../calc/time';
import { TBOParams } from '../../bo/bo-params';
import { TRaceBO } from './race-bo';

export class TRaceNode extends TBaseNode<
  TRaceColGrid,
  TRaceBO,
  TRaceNode,
  TRaceRowCollection,
  TRaceRowCollectionItem,
  TRaceColProps,
  TRaceColProp
> {
  OnCalc: TNotifyEvent;
  BOParams: TBOParams;
  StammdatenRowCollection: TStammdatenRowCollection; // shortcut
  Index: number;
  BestTime: number[];
  BestIndex: number[];
  ST: TPTime = new TPTime();
  IsRacing = true;

  constructor(
    public override ColBO: TRaceBO,
    public override BO: TBO,
  ) {
    super(ColBO, BO);

    const o: TBO = this.BO;
    this.BOParams = o.BOParams; // nicht erzeugt, nur Referenz kopiert
    this.StammdatenRowCollection = o.StammdatenNode.Collection;
    // ..einiges wird in TBO.Init gesetzt, wo der RaceNode erzeugt wird
    this.BestTime = new Array<number>(this.BOParams.ITCount + 1);
    this.BestIndex = new Array<number>(this.BOParams.ITCount + 1);
    for (let i = 0; i < this.BOParams.ITCount + 1; i++) {
      this.BestTime[i] = 0;
      this.BestIndex[i] = 0;
    }
  }

  NewCol(): TRaceRowCollection {
    return new TRaceRowCollection(this, this.BO);
  }

  Load(): void {
    let o: TRaceRowCollectionItem;
    this.Collection.Clear();

    o = this.Collection.Add();
    o.SNR = 1001;
    o.Bib = 1;

    o = this.Collection.Add();
    o.SNR = 1002;
    o.Bib = 2;

    o = this.Collection.Add();
    o.SNR = 1003;
    o.Bib = 3;
  }

  Init(RowCount: number): void {
    let o: TRaceRowCollectionItem;
    this.Collection.Clear();

    for (let i = 0; i < RowCount; i++) {
      o = this.Collection.Add();
      o.SNR = 1001 + i;
      o.Bib = 1 + i;
    }
  }

  FindSNR(SNR: number): TRaceRowCollectionItem {
    if (SNR === 0) {
      return null;
    }
    const cl: TRaceRowCollection = this.Collection;
    let cr: TRaceRowCollectionItem;
    for (let i = 0; i < cl.Count; i++) {
      cr = cl.Items[i];
      if (cr.SNR === SNR) {
        return cr;
      }
    }
    return null;
  }

  FindBib(Bib: number): TRaceRowCollectionItem {
    if (Bib === 0) {
      return null;
    }
    const cl: TRaceRowCollection = this.Collection;
    let cr: TRaceRowCollectionItem;
    for (let i = 0; i < cl.Count; i++) {
      cr = cl.Items[i];
      if (cr.Bib === Bib) {
        return cr;
      }
    }
    return null;
  }

  CopyToMRank(): void {
    const cl: TRaceRowCollection = this.Collection;
    let cr: TRaceRowCollectionItem;
    for (let i = 0; i < cl.Count; i++) {
      cr = cl.Items[i];
      cr.MRank = cr.FT.PosR;
    }
  }

  CopyFromMRank(): void {
    const cl: TRaceRowCollection = this.Collection;
    let cr: TRaceRowCollectionItem;
    for (let i = 0; i < cl.Count; i++) {
      cr = cl.Items[i];
      if (cr.MRank === 0) {
        cr.FT.OTime.Clear();
      } else {
        cr.FT.OTime.Parse(cr.MRank.toString());
      }
      cr.Modified = true;
    }
  }

  override Calc(): void {
    this.BO.CalcTP.Calc(this);
    this.Modified = false;
    if (this.OnCalc != null) {
      this.OnCalc(this);
    }
  }
}
