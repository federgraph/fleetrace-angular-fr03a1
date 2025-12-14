import { TBaseRowCollection } from '../../grid/col-grid';
import { TRaceColGrid, TRaceColProps } from './race-grid';
import { TRaceNode } from './race-node';
import { TRaceRowCollectionItem } from './race-row-collection-item';
import { TRaceColProp } from './race-col-prop';
import { TBO } from '../../fr/fr-bo';
import { TRaceBO } from './race-bo';

export class TRaceRowCollection extends TBaseRowCollection<
  TRaceColGrid,
  TRaceBO,
  TRaceNode,
  TRaceRowCollection,
  TRaceRowCollectionItem,
  TRaceColProps,
  TRaceColProp
> {
  constructor(n: TRaceNode, BO: TBO) {
    super(n, BO);
  }

  NewItem(): TRaceRowCollectionItem {
    const cr = new TRaceRowCollectionItem(this, this.BO);
    this.InitNewItemID(cr);
    return cr;
  }

  FindKey(SNR: number): TRaceRowCollectionItem {
    for (let i = 0; i < this.Count; i++) {
      const o: TRaceRowCollectionItem = this.Items[i];
      if (o != null && o.SNR === SNR) {
        return o;
      }
    }
    return null;
  }

  ClearTP(tp: number) {
    for (let i = 0; i < this.Count; i++) {
      this.Items[i].ClearTimePoint(tp);
    }
  }
}
