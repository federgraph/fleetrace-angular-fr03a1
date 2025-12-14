import { TBaseNode } from '../../grid/col-grid';
import { TStammdatenColGrid, TStammdatenColProps } from './stammdaten-grid';
import { TStammdatenBO } from './stammdaten-bo';
import { TStammdatenRowCollection } from './stammdaten-row-collection';
import { TStammdatenRowCollectionItem } from './stammdaten-row-collection-item';
import { TStammdatenColProp } from './stammdaten-col-prop';
import { TBO } from '../../fr/fr-bo';

export class TStammdatenNode extends TBaseNode<
  TStammdatenColGrid,
  TStammdatenBO,
  TStammdatenNode,
  TStammdatenRowCollection,
  TStammdatenRowCollectionItem,
  TStammdatenColProps,
  TStammdatenColProp
> {
  constructor(
    public override ColBO: TStammdatenBO,
    public override BO: TBO,
  ) {
    super(ColBO, BO);
  }

  NewCol(): TStammdatenRowCollection {
    return new TStammdatenRowCollection(this.BO, this);
  }

  Load(): void {
    // let o: TStammdatenRowCollectionItem;
    this.Collection.Clear();
    const o = this.Collection.Add();
    o.SNR = 1001;
    o.FN = 'FN';
    o.LN = 'LN';
    o.SN = 'SN';
    o.NC = 'GER';
  }

  Init(RowCount: number): void {
    let o: TStammdatenRowCollectionItem;
    this.Collection.Clear();

    for (let i = 0; i < RowCount; i++) {
      o = this.Collection.Add();
      o.SNR = 1001 + i;
    }
  }
}
