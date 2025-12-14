import { TBaseRowCollectionItem } from '../../grid/col-grid';
import { TStammdatenColGrid, TStammdatenColProps } from './stammdaten-grid';
import { TStammdatenBO } from './stammdaten-bo';
import { TStammdatenNode } from './stammdaten-node';
import { TStammdatenRowCollection } from './stammdaten-row-collection';
import { TStammdatenColProp } from './stammdaten-col-prop';
import { TProps, TProp } from '../../util/fb-props';
import { TBO } from '../../fr/fr-bo';

export class TStammdatenRowCollectionItem extends TBaseRowCollectionItem<
  TStammdatenColGrid,
  TStammdatenBO,
  TStammdatenNode,
  TStammdatenRowCollection,
  TStammdatenRowCollectionItem,
  TStammdatenColProps,
  TStammdatenColProp
> {
  SNR: number;

  private FFN = '';
  private FLN = '';
  private FSN = '';
  private FNC = '';
  private FGR = '';
  private FPB = '';
  private FDN = '';

  Props: TProps = new TProps();

  constructor(
    cl: TStammdatenRowCollection,
    public override BO: TBO,
  ) {
    super(cl, BO);
    this.SNR = 1001 + this.Collection.Count; // 1001, becasuse not yet pushed to collection
  }

  protected GetIndex(): number {
    if (this.Collection != null) {
      return this.Collection.Items.indexOf(this);
    }
    return -1;
  }

  override Assign(e: TStammdatenRowCollectionItem): void {
    if (e) {
      this.SNR = e.SNR;
      this.FN = e.FN;
      this.LN = e.LN;
      this.SN = e.SN;
      this.NC = e.NC;
      this.GR = e.GR;
      this.PB = e.PB;

      this.Props.Assign(e.Props);
    }
  }

  override ClearList() {
    this.FFN = '';
    this.FLN = '';
    this.FSN = '';
    this.FNC = '';
    this.FGR = '';
    this.FPB = '';
    this.FDN = '';
  }

  get FN(): string {
    return this.FFN;
  }
  set FN(value: string) {
    this.FFN = value;
    this.CalcDisplayName();
  }

  get LN(): string {
    return this.FLN;
  }
  set LN(value: string) {
    this.FLN = value;
    this.CalcDisplayName();
  }

  get SN(): string {
    return this.FSN;
  }
  set SN(value: string) {
    this.FSN = value;
    this.CalcDisplayName();
  }

  get NC(): string {
    return this.FNC;
  }
  set NC(value: string) {
    this.FNC = value;
    this.CalcDisplayName();
  }

  get GR(): string {
    return this.FGR;
  }
  set GR(value: string) {
    this.FGR = value;
    this.CalcDisplayName();
  }

  get PB(): string {
    return this.FPB;
  }
  set PB(value: string) {
    this.FPB = value;
    this.CalcDisplayName();
  }

  get DN(): string {
    return this.FDN;
  }
  set DN(value: string) {
    this.FDN = value;
    // this.CalcDisplayName(); //endless loop, CalcDisplayName will set DN
  }

  getItem(index: number): string {
    switch (index) {
      case 1:
        return this.FFN;
      case 2:
        return this.FLN;
      case 3:
        return this.FSN;
      case 4:
        return this.FNC;
      case 5:
        return this.FGR;
      case 6:
        return this.FPB;
      default: {
        if (index > 0 && index <= this.FieldCount) {
          let p = new TProp();
          p = this.Props.GetProp(index, p);
          return p.Value;
        }
        break;
      }
    }
    return '';
  }
  setItem(index: number, value: string) {
    switch (index) {
      case 1:
        this.FFN = value;
        break;
      case 2:
        this.FLN = value;
        break;
      case 3:
        this.FSN = value;
        break;
      case 4:
        this.FNC = value;
        break;
      case 5:
        this.FGR = value;
        break;
      case 6:
        this.FPB = value;
        break;
      default: {
        if (index > 0 && index <= this.FieldCount) {
          const p = new TProp();
          p.Key = 'N' + index.toString();
          p.Value = value;
          this.Props.SetProp(index, p);
        }
        break;
      }
    }
    this.CalcDisplayName();
  }

  GetFieldUsed(f: number): boolean {
    for (let i = 0; i < this.Collection.Count; i++) {
      if (this.Collection.Items[i].getItem(f) !== '') {
        return true;
      }
    }
    return false;
  }

  CalcDisplayName(): void {
    this.Collection.CalcDisplayName(this);
  }

  get FieldCount(): number {
    return this.BO.BOParams.FieldCount;
  }
}
