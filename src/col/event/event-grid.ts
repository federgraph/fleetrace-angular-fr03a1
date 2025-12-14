import { TBaseColProps, TColGrid } from '../../grid/col-grid';
import {
  TEventRowCollectionItem,
  TEventRowCollection,
  TEventNode,
  TEventColProp,
} from './event-row-collection';
import { TEventBO } from './event-bo';
import { TSimpleHashGrid } from '../../grid/grid-cells';
import { TBO } from '../../fr/fr-bo';

/*
RCount = BO.BOParams.RaceCount + 1;

Race[0] --> series results
Race[1] ... Race[RCount-1] --> race-results

BO.RNode[0] --> series results
BO.RNode[1] ... BO.RNode[RaceCount] --> race results
*/

export class TEventColProps extends TBaseColProps<
  TEventColGrid,
  TEventBO,
  TEventNode,
  TEventRowCollection,
  TEventRowCollectionItem,
  TEventColProps,
  TEventColProp
> {
  constructor(
    public AOwner: TEventColGrid,
    public override BO: TBO,
  ) {
    super(BO);
  }

  NewItem(): TEventColProp {
    return new TEventColProp(this, this.BO);
  }
}

export class TEventColGrid extends TColGrid<
  TEventColGrid,
  TEventBO,
  TEventNode,
  TEventRowCollection,
  TEventRowCollectionItem,
  TEventColProps,
  TEventColProp
> {
  constructor(public override BO: TBO) {
    super(BO);
  }

  NewColAvail(): TEventColProps {
    return new TEventColProps(this, this.BO);
  }

  NewColBO(): TEventBO {
    return new TEventBO(this.BO);
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

export class TSimpleEventGrid extends TSimpleHashGrid<
  TEventColGrid,
  TEventBO,
  TEventNode,
  TEventRowCollection,
  TEventRowCollectionItem,
  TEventColProps,
  TEventColProp
> {}
