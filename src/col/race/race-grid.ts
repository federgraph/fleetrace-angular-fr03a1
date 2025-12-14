import { TBaseColProps, TColGrid } from '../../grid/col-grid';
import { TRaceNode } from './race-node';
import { TRaceRowCollection } from './race-row-collection';
import { TRaceRowCollectionItem } from './race-row-collection-item';
import { TRaceColProp } from './race-col-prop';
import { TSimpleHashGrid } from '../../grid/grid-cells';
import { TBO } from '../../fr/fr-bo';
import { TRaceBO } from './race-bo';

export class TRaceColProps extends TBaseColProps<
  TRaceColGrid,
  TRaceBO,
  TRaceNode,
  TRaceRowCollection,
  TRaceRowCollectionItem,
  TRaceColProps,
  TRaceColProp
> {
  constructor(
    public AOwner: TRaceColGrid,
    public override BO: TBO,
  ) {
    super(BO);
  }

  NewItem(): TRaceColProp {
    return new TRaceColProp(this, this.BO);
  }
}

export class TRaceColGrid extends TColGrid<
  TRaceColGrid,
  TRaceBO,
  TRaceNode,
  TRaceRowCollection,
  TRaceRowCollectionItem,
  TRaceColProps,
  TRaceColProp
> {
  constructor(public override BO: TBO) {
    super(BO);
  }

  NewColAvail(): TRaceColProps {
    return new TRaceColProps(this, this.BO);
  }
  NewColBO(): TRaceBO {
    return new TRaceBO(this.BO);
  }
  SetupGrid() {
    const cl = this.GetBaseRowCollection();

    // init RowCount, clear visible cells
    if (cl != null && cl.Count > 0) {
      this.Grid.RowCount = cl.FilteredCount + this.FirstRowIndex;
    } else {
      this.Grid.RowCount = this.FirstRowIndex;
    }

    this.Grid.ColCount = this.ColsActive.Count;

    for (let i = this.HeaderRowIndex; i < this.Grid.RowCount + this.HeaderRowIndex; i++) {
      this.Grid.ClearRow(i);
    }

    // init width of columns, show captions
    this.ShowHeader();

    this.Grid.SetupGrid(this);
  }
}

export class TSimpleRaceGrid extends TSimpleHashGrid<
  TRaceColGrid,
  TRaceBO,
  TRaceNode,
  TRaceRowCollection,
  TRaceRowCollectionItem,
  TRaceColProps,
  TRaceColProp
> {}
