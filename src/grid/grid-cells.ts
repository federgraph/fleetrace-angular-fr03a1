import {
  IColGrid,
  TColGrid,
  TBaseColBO,
  TBaseNode,
  TBaseRowCollection,
  TBaseRowCollectionItem,
  TBaseColProps,
  TBaseColProp,
} from './col-grid';

export class TCell {
  c: number;
  r: number;
  constructor(ac = 0, ar = 0) {
    this.c = ac;
    this.r = ar;
  }
  toString() {
    return `(${this.c},${this.r})`;
  }
  get value(): string {
    return `(${this.c},${this.r})`;
  }
}

export class TGridCells {
  key: TCell = new TCell(0, 0);
  DefaultValue = '';

  map: Map<string, string>;

  constructor() {
    this.map = new Map<string, string>();
  }

  GetCells(ACol: number, ARow: number): string {
    this.key.c = ACol;
    this.key.r = ARow;
    const k = this.key.value;
    if (this.map.has(k)) {
      const result = this.map.get(k);
      if (result) {
        return result;
      }
    } else {
      return this.DefaultValue;
    }
    return '';
  }

  SetCells(ACol: number, ARow: number, value: string) {
    this.key.c = ACol;
    this.key.r = ARow;
    const k = this.key.value;
    if (this.map.has(k)) {
      this.map.set(k, value);
    } else {
      this.map.set(k, value);
    }
  }
}

export class TSimpleHashGrid<
  G extends TColGrid<G, B, N, C, I, PC, PI>,
  B extends TBaseColBO<G, B, N, C, I, PC, PI>,
  N extends TBaseNode<G, B, N, C, I, PC, PI>,
  C extends TBaseRowCollection<G, B, N, C, I, PC, PI>,
  I extends TBaseRowCollectionItem<G, B, N, C, I, PC, PI>,
  PC extends TBaseColProps<G, B, N, C, I, PC, PI>,
  PI extends TBaseColProp<G, B, N, C, I, PC, PI>,
>
  extends TGridCells
  implements IColGrid<G, B, N, C, I, PC, PI>
{
  [index: string]: any;

  FirstRowIndex = 0;
  HeaderRowIndex = 0;
  FixedRows = 0;

  ColCount = 0;
  RowCount = 0;
  Col = 0;
  Row = 0;
  HasFixedRow = false;
  Enabled = true;
  IsEditorMode = false;

  constructor() {
    super();
    this.DefaultValue = '';
  }

  // GetCells(c: number, r: number): string {
  //     return super.GetCells(c, r);
  // }
  // SetCells(c: number, r: number, value: string): void {
  //     super.SetCells(c, r, value);
  // }

  InvalidateGrid() {}

  getColWidth(ACol: number) {
    return 35;
    // return fColWidth[ACol];
  }
  setColWidth(ACol: number, value: number) {
    // fColWidth[ACol] = value;
  }

  ClearRow(ARow: number): void {
    const key = new TCell();
    key.r = ARow;
    for (let i = 0; i < this.ColCount; i++) {
      key.c = i;
      this[key.value] = '';
    }
  }

  CancelEdit(): void {
    this.IsEditorMode = false;
  }

  UpdateInplace(value: string): void {
    this[new TCell(this.Col, this.Row).value] = value;
  }

  SetupGrid(colGrid: G): void {
    // virtual
  }

  ShowData(): void {
    // virtual
  }

  GetBaseID(ARow: number): number {
    // virtual
    return -1;
  }
}
