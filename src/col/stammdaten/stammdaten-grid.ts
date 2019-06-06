import { TBaseColProps, TColGrid } from '../../grid/col-grid';
import { TStammdatenBO } from './stammdaten-bo';
import { TStammdatenNode } from './stammdaten-node';
import { TStammdatenRowCollection } from './stammdaten-row-collection';
import { TStammdatenRowCollectionItem } from './stammdaten-row-collection-item';
import { TStammdatenColProp } from './stammdaten-col-prop';
import { TSimpleHashGrid } from '../../grid/grid-cells';
import { TBO } from '../../fr/fr-bo';

export class TStammdatenColProps extends TBaseColProps<
    TStammdatenColGrid,
    TStammdatenBO,
    TStammdatenNode,
    TStammdatenRowCollection,
    TStammdatenRowCollectionItem,
    TStammdatenColProps,
    TStammdatenColProp> {
    constructor(public BO: TBO) {
        super(BO);
    }

    NewItem(): TStammdatenColProp {
        return new TStammdatenColProp(this, this.BO);
    }

}

export class TStammdatenColGrid extends TColGrid<
    TStammdatenColGrid,
    TStammdatenBO,
    TStammdatenNode,
    TStammdatenRowCollection,
    TStammdatenRowCollectionItem,
    TStammdatenColProps,
    TStammdatenColProp> {
    constructor(BO: TBO) {
        super(BO);
    }

    NewColAvail(): TStammdatenColProps {
        return new TStammdatenColProps(this.BO);
    }
    NewColBO(): TStammdatenBO {
        return new TStammdatenBO(this.BO);
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

export class TSimpleStammdatenGrid extends TSimpleHashGrid<
    TStammdatenColGrid,
    TStammdatenBO,
    TStammdatenNode,
    TStammdatenRowCollection,
    TStammdatenRowCollectionItem,
    TStammdatenColProps,
    TStammdatenColProp> {
}

