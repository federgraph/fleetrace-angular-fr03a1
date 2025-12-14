import { TBaseRowCollectionItem } from '../../grid/col-grid';
import { TStammdatenRowCollectionItem } from '../stammdaten/stammdaten-row-collection-item';
import { TPTime } from '../../calc/time';
import { TRaceRowCollection } from './race-row-collection';
import { TRaceColGrid, TRaceColProps } from './race-grid';
import { TRaceNode } from './race-node';
import { TRaceColProp } from './race-col-prop';
import { TPenaltyISAF } from '../../calc/penalty-isaf';
import { TTimePoint } from './time-point';
import { TBO } from '../../fr/fr-bo';
import { TRaceBO } from './race-bo';

export class TRaceRowCollectionItem extends TBaseRowCollectionItem<
  TRaceColGrid,
  TRaceBO,
  TRaceNode,
  TRaceRowCollection,
  TRaceRowCollectionItem,
  TRaceColProps,
  TRaceColProp
> {
  Bib = -1;
  SNR = -1;
  private FQU: TPenaltyISAF;
  DG = 0;
  IT: TTimePoint[];
  FT: TTimePoint;
  MRank = 0;

  constructor(
    cl: TRaceRowCollection,
    public override BO: TBO,
  ) {
    super(cl, BO);
    this.FQU = new TPenaltyISAF();
    this.IT = new Array<TTimePoint>(this.BO.BOParams.ITCount + 1);
    for (let i = 0; i < this.ITCount; i++) {
      this.IT[i] = new TTimePoint();
    }
    this.FT = this.IT[0];
  }

  protected GetIndex(): number {
    if (this.Collection != null) {
      return this.Collection.Items.indexOf(this);
    }
    return -1;
  }

  override Assign(Source: TRaceRowCollectionItem): void {
    if (Source != null) {
      const o: TRaceRowCollectionItem = Source as TRaceRowCollectionItem;
      this.Bib = o.Bib;
      this.SNR = o.SNR;
      this.QU.Assign(o.QU);
      this.DG = o.DG;
      this.MRank = o.MRank;
      this.ST.Assign(o.ST);
      for (let i = 0; i < this.ITCount; i++) {
        this.IT[i].Assign(o.IT[i]);
      }
    }
  }

  override ClearList(): void {
    super.ClearList();
    this.Bib = this.BaseID;
    this.SNR = 1000 + this.Bib;
  }

  override ClearResult(): void {
    super.ClearResult();
    this.ST.Clear();
    this.DG = 0;
    this.MRank = 0;
    this.QU.Clear();
    for (let i = 0; i < this.ITCount; i++) {
      this.IT[i].Clear();
    }
  }

  ClearTimePoint(tp: number): void {
    if (tp >= 0 && tp < this.ITCount) {
      // super.ClearResult();
      // this.ST.Clear();
      // this.DG = 0;
      if (tp === 0) {
        this.MRank = 0;
      }
      // this.QU.Clear();
      this.IT[tp].Clear();
    }
  }

  private GetSDItem(): TStammdatenRowCollectionItem {
    return this.ru.StammdatenRowCollection.FindKey(this.SNR);
  }

  get ST(): TPTime {
    return this.ru.ST;
  }
  set ST(value: TPTime) {
    if (value != null) {
      this.ru.ST.Assign(value);
    }
  }

  getTimePoint(Index: number) {
    // this[int Index]
    // property IT[Index: Integer]: TTimePoint read GetIT;
    if (Index >= 0 && Index <= this.ITCount) {
      return this.IT[Index];
    }
    return null;
  }

  get ITCount(): number {
    return this.IT.length;
  }

  get FN(): string {
    const sd: TStammdatenRowCollectionItem = this.GetSDItem();
    if (sd != null) {
      return sd.FN;
    }
    return '';
  }

  get LN(): string {
    const sd: TStammdatenRowCollectionItem = this.GetSDItem();
    if (sd != null) {
      return sd.LN;
    }
    return '';
  }

  get SN(): string {
    const sd: TStammdatenRowCollectionItem = this.GetSDItem();
    if (sd != null) {
      return sd.SN;
    }
    return '';
  }

  get NC(): string {
    const sd: TStammdatenRowCollectionItem = this.GetSDItem();
    if (sd != null) {
      return sd.NC;
    }
    return '';
  }

  get GR(): string {
    const sd: TStammdatenRowCollectionItem = this.GetSDItem();
    if (sd != null) {
      return sd.GR;
    }
    return '';
  }

  get PB(): string {
    const sd: TStammdatenRowCollectionItem = this.GetSDItem();
    if (sd != null) {
      return sd.PB;
    }
    return '';
  }

  get QU(): TPenaltyISAF {
    return this.FQU;
  }
  set QU(value: TPenaltyISAF) {
    if (value != null) {
      this.QU.Assign(value);
    }
  }
}
