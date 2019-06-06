import { TBO } from '../fr/fr-bo';
import { TUtils } from '../util/fb-classes';
import { TStringList } from '../util/fb-strings';
import { TCollection, TCollectionItem } from './col-item';
import { TCellProp, TCellProps } from './grid-cell-prop';
import { ColorConst, TColGridColorRec, TColGridColorScheme, TColGridColors } from './grid-color';
import {
  TColAlignment,
  TColCaptionBag,
  TColGridColorClass,
  TColGridGlobals,
  TColType,
  TColor,
  TDisplayOrderList,
  TKeyEvent,
  TNotifyEvent,
  TTable,
  TTableRow,
  TTableCell
} from './grid-def';

export interface IColGrid<
  G extends TColGrid<G, B, N, C, I, PC, PI>,
  B extends TBaseColBO<G, B, N, C, I, PC, PI>,
  N extends TBaseNode<G, B, N, C, I, PC, PI>,
  C extends TBaseRowCollection<G, B, N, C, I, PC, PI>,
  I extends TBaseRowCollectionItem<G, B, N, C, I, PC, PI>,
  PC extends TBaseColProps<G, B, N, C, I, PC, PI>,
  PI extends TBaseColProp<G, B, N, C, I, PC, PI>> {

  FirstRowIndex: number;
  HeaderRowIndex: number;
  ColCount: number;
  RowCount: number;
  Enabled: boolean;
  FixedRows: number;
  Row: number;

  IsEditorMode: boolean;

  ClearRow(row: number): void;
  GetCells(c: number, r: number): string;
  SetCells(c: number, r: number, value: string): void;

  SetupGrid(colGrid: G): void;
  ShowData(): void;
  InvalidateGrid(): void;
  CancelEdit(): void;
}

/** row object, BaseID is the primary key */
export abstract class TBaseRowCollectionItem<
  G extends TColGrid<G, B, N, C, I, PC, PI>,
  B extends TBaseColBO<G, B, N, C, I, PC, PI>,
  N extends TBaseNode<G, B, N, C, I, PC, PI>,
  C extends TBaseRowCollection<G, B, N, C, I, PC, PI>,
  I extends TBaseRowCollectionItem<G, B, N, C, I, PC, PI>,
  PC extends TBaseColProps<G, B, N, C, I, PC, PI>,
  PI extends TBaseColProp<G, B, N, C, I, PC, PI>> {

  BaseID: number = 0;

  constructor(
    public Collection: C,
    public BO: TBO
  ) {
  }

  get ru(): N {
    return this.Collection.Node;
  }

  /** set Modified property of Collection.Node.Modified - ru.Modified */
  set Modified(value: boolean) {
    if (this.Collection != null && this.Collection.Node != null) {
      this.Collection.Node.Modified = value;
    }
  }

  get IndexOfRow(): number {
    return this.GetIndex();
  }

  protected abstract GetIndex(): number;

  protected SetIndex(value: number) {
    const CurIndex = this.GetIndex();
    if (CurIndex >= 0 && CurIndex !== value) {
      const t = this.Collection.Items;
      const x = CurIndex;
      const y = value;
      t.splice(y, 1, t.splice(x, 1, t[y])[0]);
    }
  }

  ClearList() {
    // virtual
  }

  ClearResult() {
    // virtual
  }

  IsInFilter(): boolean {
    return true;
  }

  UpdateCellProp(cp: PI, cellProp: TCellProp) {
    cellProp.Color = this.ColumnToColorDef(cp, cellProp.Color);
  }

  ColumnToColorDef(cp: PI, aColor: TColor): TColor {
    return aColor;
  }

  Assign(Source: I) {
    // virtual
  }

  get Index(): number { return this.GetIndex(); }
  set Index(value: number) { this.SetIndex(value); }
}

/**
 * table object, a collection of rows, owned by TBaseNode
 */
export abstract class TBaseRowCollection<
  G extends TColGrid<G, B, N, C, I, PC, PI>,
  B extends TBaseColBO<G, B, N, C, I, PC, PI>,
  N extends TBaseNode<G, B, N, C, I, PC, PI>,
  C extends TBaseRowCollection<G, B, N, C, I, PC, PI>,
  I extends TBaseRowCollectionItem<G, B, N, C, I, PC, PI>,
  PC extends TBaseColProps<G, B, N, C, I, PC, PI>,
  PI extends TBaseColProp<G, B, N, C, I, PC, PI>> {

  Items: Array<I>;

  constructor(
    public Node: N,
    public BO: TBO
  ) {
    this.Items = new Array<I>();
  }

  IndexOfRow(row: I): number {
    return this.Items.indexOf(row);
  }

  forEach(callback: (cr: I, index: number, cl: Array<I>) => void) {
    for (let i = 0; i < this.Items.length; i++) {
      callback(this.Items[i], i, this.Items);
    }
  }

  abstract NewItem(BO: TBO): I;

  protected InitNewItemID(cr: I) {
    cr.BaseID = this.Count + 1; // + 1 because not yet pushed to array
  }

  Clear() {
    this.Items = [];
  }

  Add(): I {
    const cr = this.NewItem(this.BO);
    this.Items.push(cr);
    return cr;
  }

  Delete(Index: number) {
    this.Items.splice(Index, 1);
    this.FixBaseIDs();
  }

  InsertItem(atIndex: number): I {
    const cr = this.NewItem(this.BO);
    this.Items.splice(atIndex, 0, cr);
    this.FixBaseIDs();
    return cr;
  }

  FixBaseIDs() {
    let cr: I;
    for (let i = 0; i < this.Count; i++) {
      cr = this.Items[i];
      cr.BaseID = i + 1;
    }
  }

  private GetCount(): number {
    return this.Items.length;
  }

  RemoveItem(Item: I) {
    const i = this.Items.indexOf(Item);
    if (i > -1 && i < this.Items.length) {
      this.Delete(i);
    } else if (i === this.Items.length) {
      this.Items.pop();
    }
  }

  GetItem(Index: number): I {
    return this.Items[Index];
  }

  SetItem(Index: number, Value: I) {
    this.Items[Index].Assign(Value);
  }

  Assign(Source: C) {
    if (Source) {
      this.Clear();
      for (let i = 0; i < Source.Count; i++) {
        this.Add().Assign(Source.Items[i]);
      }
      return;
    }
  }

  /** search for Item by BaseID
   * @param BaseID, the maintained number starting from 1 and counting up
   * @return null if not found
   */
  FindBase(BaseID: number): I {
    const result: I = null;
    for (let i = 0; i < this.Count; i++) {
      const cr = this.Items[i];
      if (BaseID === cr.BaseID) {
        return cr;
      }
    }
    return result;
  }

  ClearList() {
    for (let i = 0; i < this.Count; i++) {
      this.Items[i].ClearList();
    }
  }
  ClearResult() {
    for (let i = 0; i < this.Count; i++) {
      this.Items[i].ClearResult();
    }
  }

  get Count(): number { return this.GetCount(); }
  get FilteredCount(): number { return this.Count; }

}

/** Eventhandler definitions
 * - the Grid will fire these on the business object.
 * - these events pass the row object as parameter
 * - no need to indicate the column as parameter because
 * there will be a separate eventhandler for each editable field of a row.
 * The eventhandler can be assigned to the column object.
 * The eventhandler will usually be implemented in the business object.
 */

type TBaseSetTextEvent<I> = (cr: I, Value: string) => void;
type TBaseGetTextEvent<I> = (cr: I, value: string) => string;
type TBaseGetTextEvent2<I> = (cr: I, value: string, ColName: string) => string;
type TFinishEditCREvent<I> = (cr: I) => void;
type TCellSelectEvent = (Sender: object, ACol: number, ARow: number, canSelect: boolean) => boolean;
type TRowChangedEvent = (Sender: object, ARow: number) => {};

/**
 * This class defines column properties,
 * there will be one object for every field of the row object.
 * This is an abstract class, you need to override at least
 * - InitColsAvail
 * - GetTextDefault
 */
export class TBaseColProp<
  G extends TColGrid<G, B, N, C, I, PC, PI>,
  B extends TBaseColBO<G, B, N, C, I, PC, PI>,
  N extends TBaseNode<G, B, N, C, I, PC, PI>,
  C extends TBaseRowCollection<G, B, N, C, I, PC, PI>,
  I extends TBaseRowCollectionItem<G, B, N, C, I, PC, PI>,
  PC extends TBaseColProps<G, B, N, C, I, PC, PI>,
  PI extends TBaseColProp<G, B, N, C, I, PC, PI>> extends TCollectionItem<PC, PI> {

  private FNameID: string = '';
  NumID: number = 0; // for better performance of method GetTextDefault
  Caption: string = '';
  Width = 35;
  Alignment: TColAlignment;
  Visible = true;
  Sortable: boolean = false;
  ColType: TColType = TColType.colTypeInteger;
  Descending: boolean = false;
  ReadOnly: boolean = true;

  OnGetSortKey: TBaseGetTextEvent<I>;
  OnGetSortKey2: TBaseGetTextEvent2<I>;
  OnGetText: TBaseGetTextEvent<I>;
  OnSetText: TBaseSetTextEvent<I>;
  OnFinishEdit: TBaseGetTextEvent<I>;
  OnFinishEdit2: TBaseGetTextEvent2<I>;

  constructor(ACollection: PC) {
    super(ACollection);
    this.NameID = ''; // --> SetNameID
    this.Visible = true;
    this.Alignment = TColAlignment.taRightJustify;
    this.Width = 35;
    if (!TColGridGlobals.ColCaptionBag) {
      TColGridGlobals.ColCaptionBag = new TColCaptionBag();
    }
  }

  GetCaption(): string {
    return this.Caption;
  }

  SetNameID(Value: string) {
    let o: PC;
    o = this.Collection as PC;

    if (Value === '' || Value !== this.FNameID && o.IsDuplicateNameID(Value)) {
      this.FNameID = 'col_' + TUtils.IntToStr(this.ID);
      if (this.Caption === '' || this.Caption === this.FNameID) {
        this.Caption = Value;
      }
    } else {
      if (this.Caption === this.FNameID) {
        this.Caption = Value;
      }
      this.FNameID = Value;
    }
  }

  InitColsAvail() {
    // virtual
  }

  /**
   * This is just an example of how you override InitColsAvail.
   */
  TMyColProp_InitColsAvail() {

    let cp: PI;
    let ColsAvail: PC;

    if (typeof (this.Collection) === typeof (TBaseColProps)) {
      ColsAvail = this.Collection;
    } else {
      return;
    }

    // super().InitColsAvail();
    this.InitColsAvail();

    cp = ColsAvail.Add();
    cp.NameID = 'col_Run';
    cp.Caption = 'Run';
    cp.Width = 35;
    cp.Sortable = true;
    cp.Alignment = TColAlignment.taLeftJustify;

    // ...
  }

  GetTextDefault(cr: I, value: string): string {
    let result = '';
    if (!cr) {
      return result;
    }
    if (this.NumID === 0) {
      result = TUtils.IntToStr(cr.BaseID);
    }
    return result;
  }

  Assign(cp: PI) {

    if (cp) {
      this.FNameID = cp.FNameID;
      this.NumID = cp.NumID;
      this.Caption = cp.Caption;
      this.Width = cp.Width;
      this.Alignment = cp.Alignment;
      this.Visible = cp.Visible;
      this.Sortable = cp.Sortable;
      this.ColType = cp.ColType;
      this.Descending = cp.Descending;

      this.OnGetSortKey = cp.OnGetSortKey;
      this.OnGetSortKey2 = cp.OnGetSortKey2;
      this.OnGetText = cp.OnGetText;
      this.OnSetText = cp.OnSetText;
      this.ReadOnly = cp.ReadOnly;
      this.OnFinishEdit = cp.OnFinishEdit;
      this.OnFinishEdit2 = cp.OnFinishEdit2;
    }
  }

  GetSortKey(cr: I, sortKey: string): string {
    let SortKey = this.GetText(cr);

    // move down zero's and blanks,
    if (this.ColType === TColType.colTypeRank && (SortKey === '0' || SortKey === '')) {
      SortKey = TUtils.IntToStr(999 + cr.BaseID);
    } else if (this.ColType === TColType.colTypeString && SortKey === '') {
      SortKey = 'ZZZ' + TColGrid.LeadingZeros(3, TUtils.IntToStr(cr.BaseID));
    }

    let result = SortKey;
    if (this.OnGetSortKey) {
      result = this.OnGetSortKey(cr, SortKey);
    } else if (this.OnGetSortKey2) {
      result = this.OnGetSortKey2(cr, SortKey, this.NameID);
    }
    return result;
  }

  GetText(cr: I): string {
    let result = '';
    if (this.OnGetText) {
      result = this.OnGetText(cr, result);
    } else {
      result = this.GetTextDefault(cr, result);
    }
    return result;
  }

  get NameID(): string { return this.FNameID; }
  set NameID(value: string) { this.SetNameID(value); }
}

/** Container for column objects, the StringGrid will maintain two ColProps Collections.
 * - Available Columns
 * - Active Columns
 */
export abstract class TBaseColProps<
  G extends TColGrid<G, B, N, C, I, PC, PI>,
  B extends TBaseColBO<G, B, N, C, I, PC, PI>,
  N extends TBaseNode<G, B, N, C, I, PC, PI>,
  C extends TBaseRowCollection<G, B, N, C, I, PC, PI>,
  I extends TBaseRowCollectionItem<G, B, N, C, I, PC, PI>,
  PC extends TBaseColProps<G, B, N, C, I, PC, PI>,
  PI extends TBaseColProp<G, B, N, C, I, PC, PI>> extends TCollection<PC, PI> {

  private FSortColIndex: number = -1;
  UseCustomColCaptions: boolean = false;

  constructor(public BO: TBO) {
    super(BO);
  }

  private GetVisibleCount(): number {
    let result = 0;
    for (let i = 0; i < this.Count; i++) {
      if (this.GetItem(i).Visible) {
        result++;
      }
    }
    return result;
  }

  GetByName(NameIndex: string): PI {
    let cp: PI;
    for (let i = 0; i < this.Count; i++) {
      cp = this.GetItem(i);
      if (cp && cp.NameID === NameIndex) {
        return cp;
      }
    }
    return null;
  }

  GetItem(Index: number): PI {
    if (Index >= 0 && Index < this.Count) {
      return super.GetItem(Index);
    }
    return null;
  }

  SetItem(Index: number, value: PI) {
    super.SetItem(Index, value);
  }

  private SetSortColIndex(value: number) {
    if (value >= 0 && value < this.Count && this.GetItem(value).Sortable) {
      this.FSortColIndex = value;
    } else {
      this.FSortColIndex = -1;
    }
  }

  private GetSortColIndex(): number {
    let result = -1;
    if (this.FSortColIndex >= 0
      && this.FSortColIndex < this.Count
      && this.GetItem(this.FSortColIndex)
      && this.GetItem(this.FSortColIndex).Sortable) {
      result = this.FSortColIndex;
    } else {
      this.FSortColIndex = -1;
    }
    return result;
  }

  private GetGridName(): string {
    if (this.Grid != null) {
      return this.Grid.Name;
    }
    return '';
  }

  private GetCaptionOverride(cp: PI): string {
    let Node: N;
    let key: string;

    let result = '';

    // first try, Grid specific search
    if (this.GridName !== '') {
      key = this.GridName + '_' + cp.NameID;
      result = TColGridGlobals.ColCaptionBag.getCaption(key);
    }

    // second try, Table specific search
    if (result === '') {
      if (this.Grid) {
        Node = this.Grid.GetBaseNode();
        if (Node) {
          if (Node.NameID !== '') {
            key = Node.NameID + '_' + cp.NameID;
            result = TColGridGlobals.ColCaptionBag.getCaption(key);
          }
        }
      }
    }

    // third try, cross table, column name based
    if (result === '') {
      result = TColGridGlobals.ColCaptionBag.getCaption(cp.NameID);
    }

    // else use default
    if (result === '') {
      result = cp.Caption;
    }

    return result;
  }

  get Grid(): G {
    if (this.Owner !== null && typeof (this.Owner) === typeof (TColGrid)) {
      return this.Owner as G;
    }
    return null;
  }

  IsDuplicateNameID(s: string): boolean {
    let o: PI;
    for (let i = 0; i < this.Count; i++) {
      o = this.GetItem(i);
      if (o.NameID === s) {
        return true;
      }
    }
    return false;
  }

  Add(): PI {
    return super.Add();
  }

  Init() {
    let cp: PI;

    this.Clear();

    // BaseID
    cp = this.Add();
    cp.NameID = 'col_BaseID';
    cp.Caption = 'ID';
    cp.Width = 25;
    cp.Sortable = true;
    cp.NumID = 0; // default

    cp.InitColsAvail(); // virtual

    // if Owner is not null, memory for objects is managed
    // Owner is null for ColsActive, not null for ColsAvail
    if (this.Owner != null && this.UseCustomColCaptions) {
      this.InitCustomCaptions();
    }
  }

  InitCustomCaptions() {
    let cp: PI;
    for (let i = 0; i < this.Count; i++) {
      cp = this.GetItem(i);
      cp.Caption = this.GetCaptionOverride(cp);
    }
  }

  UpdateRow(AGrid: IColGrid<G, B, N, C, I, PC, PI>, ARow: number, cr: I) {
    for (let i = 0; i < this.Count; i++) {
      AGrid.SetCells(i, ARow, this.GetItem(i).GetText(cr));
    }
  }

  get VisibleCount(): number { return this.GetVisibleCount(); }
  get SortColIndex(): number { return this.GetSortColIndex(); }
  set SortColIndex(value: number) { this.SetSortColIndex(value); }
  get GridName(): string { return this.GetGridName(); }
}

/** The application may build a tree or list of Nodes with each Node having a BaseRowCollection */
export abstract class TBaseNode<
  G extends TColGrid<G, B, N, C, I, PC, PI>,
  B extends TBaseColBO<G, B, N, C, I, PC, PI>,
  N extends TBaseNode<G, B, N, C, I, PC, PI>,
  C extends TBaseRowCollection<G, B, N, C, I, PC, PI>,
  I extends TBaseRowCollectionItem<G, B, N, C, I, PC, PI>,
  PC extends TBaseColProps<G, B, N, C, I, PC, PI>,
  PI extends TBaseColProp<G, B, N, C, I, PC, PI>> {

  Collection: C;

  private FModified = false;
  private FOnModified: TNotifyEvent;

  NameID: string = '';
  Layout: number = 0;

  constructor(
    public ColBO: B,
    public BO: TBO,
  ) {
    this.Collection = this.NewCol();
  }

  abstract NewCol(): C;

  private SetOnModified(value: TNotifyEvent) {
    this.FOnModified = value;
  }

  protected SetModified(value: boolean) {
    this.FModified = value;
    if (value && this.OnModified) {
      this.OnModified(this);
    }
  }

  Calc() {
    // virtual
  }

  Clear() {
    this.Collection.Clear();
  }

  get Modified(): boolean { return this.FModified; }
  set Modified(value: boolean) { this.SetModified(value); }

  get OnModified(): TNotifyEvent { return this.FOnModified; }
  set OnModified(value: TNotifyEvent) { this.SetOnModified(value); }
}

/**
 * The ColBO (B) knows which Item (I) in which Node (N) is current.
 * The Grid may be able to highlight the current item.
 */
export class TBaseColBO<
  G extends TColGrid<G, B, N, C, I, PC, PI>,
  B extends TBaseColBO<G, B, N, C, I, PC, PI>,
  N extends TBaseNode<G, B, N, C, I, PC, PI>,
  C extends TBaseRowCollection<G, B, N, C, I, PC, PI>,
  I extends TBaseRowCollectionItem<G, B, N, C, I, PC, PI>,
  PC extends TBaseColProps<G, B, N, C, I, PC, PI>,
  PI extends TBaseColProp<G, B, N, C, I, PC, PI>> {

  protected FCurrentNode: N;
  protected FCurrentRow: I;

  GetCurrentRow(): I {
    return this.FCurrentRow;
  }

  SetCurrentRow(value: I) {
    // virtual, allows the StringGrid UI to reset the current row
    this.FCurrentRow = value;
  }

  GetCurrentNode(): N {
    return this.FCurrentNode;
  }

  SetCurrentNode(value: N) {
    // virtual
    this.FCurrentNode = value;
  }

  InitColsActive(StringGrid: G) {
    // virtual
    this.InitColsActiveLayout(StringGrid, 0);
  }

  InitColsActiveLayout(StringGrid: G, aLayout: number) {
    // virtual
  }

  get CurrentRow(): I { return this.GetCurrentRow(); }
  set CurrentRow(value: I) { this.SetCurrentRow(value); }

  get CurrentNode(): N { return this.GetCurrentNode(); }
  set CurrentNode(value: N) { this.SetCurrentNode(value); }
}

/**
 * The StringGrid can paint itself, it only needs to know what RowCollection to pull the data from.
 * You need to assign a function of the following type to the StringGrid.
 * Note that each RowCollection is owned by a node.
 */
type TGetBaseNodeFunction<N> = () => N;

/** for debugging only */
type TTraceProcedure = (s: string) => {};

type TCellClickEvent = (Sender: object, ACol: number, ARow: number) => {};

export abstract class TColGrid<
  G extends TColGrid<G, B, N, C, I, PC, PI>,
  B extends TBaseColBO<G, B, N, C, I, PC, PI>,
  N extends TBaseNode<G, B, N, C, I, PC, PI>,
  C extends TBaseRowCollection<G, B, N, C, I, PC, PI>,
  I extends TBaseRowCollectionItem<G, B, N, C, I, PC, PI>,
  PC extends TBaseColProps<G, B, N, C, I, PC, PI>,
  PI extends TBaseColProp<G, B, N, C, I, PC, PI>> {

  FColBODefault: B;
  FColsActiveDefault: PC;

  FColBO: B; // reference, don't create
  FColsAvail: PC; // use assign()
  FColsActive: PC; // reference, don't create

  OnGetBaseNode: TGetBaseNodeFunction<N>;
  OnTrace: TTraceProcedure;
  FOnEdit: TNotifyEvent;
  FOnFinishEditCR: TFinishEditCREvent<I>;
  FOnBaseClearContent: TNotifyEvent;
  OnMarkRow: TNotifyEvent;

  FOnKeyDown: TKeyEvent;

  FColorSchema: TColGridColorScheme = TColGridColorScheme.colorRed;

  FAutoInsert = false;
  FAutoDelete = false;
  FHeatSize = 1;

  FOnCellSelect: TCellSelectEvent;
  FOnCellClick: TCellClickEvent;
  CellProps: TCellProps;

  UseHTML = true;
  FMenuMode = false;
  FExcelStyle = false;

  FDefaultColor: TColor = 0;
  FAlternatingColor: TColor = 0;
  FEditableColor: TColor = 0;
  FAlternatingEditableColor: TColor = 0;
  FCurrentColor: TColor = 0;
  FTransColor: TColor = 0;
  FFocusColor: TColor = 0;

  FirstRowIndex = 1;
  HeaderRowIndex = 0;
  MenuMode = false;
  IsCollectionGrid = false;

  Name: string = '';
  DisplayOrder: TDisplayOrderList;
  Grid: IColGrid<G, B, N, C, I, PC, PI>;

  static LeadingZeros(LengthRequired: number, sIn: string): string {
    // place zeros in front
    const s = '0'.repeat(LengthRequired) + sIn;
    // then select LengthRequired characters from the right
    return s.substring(s.length - LengthRequired);
  }

  constructor(public BO: TBO) {
    this.CellProps = new TCellProps();
    this.ColorSchema = TColGridColors.GetColorScheme();
    this.DisplayOrder = new TDisplayOrderList();
    this.FColsAvail = this.NewColAvail();
    this.ColsAvail.Init();

    this.FColsActiveDefault = this.NewColAvail();
    this.FColsActive = this.FColsActiveDefault;

    this.FColBODefault = this.NewColBO();
    this.FColBO = this.FColBODefault;

    this.AddColumn('col_BaseID');
  }

  abstract NewColAvail(): PC;
  abstract NewColBO(): B;
  abstract SetupGrid(): void;

  NewTable(): TTable {

    let tr: TTableRow;
    let tc: TTableCell;
    let cp: PI;

    const t = new TTable();

    const sci = this.ColsActive.SortColIndex;
    const des = this.DisplayOrder.Descending;

    let st: string;
    let sc: string;
    let sa: string;

    for (let r = 0; r < this.Grid.RowCount; r++) {
      tr = new TTableRow();
      tr.align = 'left';

      for (let c = 0; c < this.Grid.ColCount; c++) {
        cp = this.ColsActive.Items[c];
        if (cp == null) {
          continue;
        }

        tc = new TTableCell();
        sc = this.CellProps.GetCellProp(c, r).HTMLColor;
        st = this.Grid.GetCells(c, r);

        if (cp.Alignment === TColAlignment.taRightJustify) {
          sa = 'right';
        } else {
          sa = 'left';
        }

        if (r === 0) {
          if (c === sci && des) {
            sc = '#9FA8DA'; // Primary, Indigo 200
          } else if (c === sci) {
            sc = '#F48FB1'; // Accent, Pink 200
          } else {
            sc = 'Beige';
          }

          tc.align = sa;
          tc.color = sc;
          tc.text = st;
          tc.th = true;
          tc.td = false;
          tr.Cols.push(tc);
        } else {
          tc.align = sa;
          tc.color = sc;
          tc.text = st;
          tc.th = false;
          tc.td = true;
          tr.Cols.push(tc);
        }
      }
      t.Rows.push(tr);
    }
    return t;
  }

  ShowHeader() {
    // ColCount is always >= 1, see TCustomGrid.SetColCount
    this.Grid.ColCount = this.ColsActive.VisibleCount;
    for (let i = 0; i < this.ColsActive.Count; i++) {
      const cp: PI = this.ColsActive.Items[i];
      if ((cp != null) && cp.Visible) {
        // this.Grid.Width[i] = cp.Width;
        if (!this.MenuMode) {
          this.Grid.SetCells(i, 0, cp.Caption);
        }
      }
    }
  }

  SetColsAvail(value: PC) {
    if (this.FColsAvail !== value) {
      if (this.FColsAvail) {
        this.FColsAvail.Assign(value);
      }
    }
  }

  GetColorPaint(): boolean {
    return this.ColsActive.SortColIndex === -1;
  }

  SetColorPaint(Value: boolean) {
    if (Value) {
      this.ColsActive.SortColIndex = -1;
    } else {
      this.ColsActive.SortColIndex = 0;
    }
    this.UpdateAll();
  }

  SetColorSchema(Value: TColGridColorScheme) {
    let t: TColGridColorRec;
    t = TColGridColors.GetGridColors(Value);
    this.FColorSchema = Value;
    this.FDefaultColor = t.DefaultColor;
    this.FAlternatingColor = t.AlternatingColor;
    this.FFocusColor = t.FocusColor;
    this.FEditableColor = t.EditableColor;
    this.FAlternatingEditableColor = t.AlternatingEditableColor;
    this.FCurrentColor = t.CurrentColor;
    this.FTransColor = t.TransColor;
  }

  UpdateCellProp(
    rd: N,
    cp: PI,
    IsSorted: boolean,
    ACol: number, ARow: number): TCellProp {

    let bc: TColor;
    let CellProp: TCellProp;
    let IsNormalRow: boolean;
    let cc: TColGridColorClass;

    let result = null;

    if (!rd) {
      return null;
    }
    if (!cp) {
      return null;
    }

    CellProp = this.CellProps.GetCellProp(ACol, ARow);
    CellProp.ShowGroup = false;
    CellProp.GroupColor = ColorConst.clFleetNone;

    bc = ColorConst.clBlank;
    cc = TColGridColorClass.Blank;

    if (ARow > this.HeaderRowIndex) {

      IsNormalRow = this.IsOddRow(ARow - 1);

      // alternating row color
      if (IsNormalRow) {
        bc = this.FDefaultColor;
        cc = TColGridColorClass.DefaultColor;
      } else {
        bc = this.FAlternatingColor;
        cc = TColGridColorClass.AlternatingColor;
      }

      // editable columns color
      if (cp.ReadOnly === false) {
        if (IsNormalRow) {
          bc = this.FEditableColor;
          cc = TColGridColorClass.EditableColor;
        } else {
          bc = this.FAlternatingEditableColor;
          cc = TColGridColorClass.AlternatingEditableColor;
        }
      }

      let cr: I;
      if (IsSorted) {
        // cr = this.lookupCR(rd, ARow);
        cr = this.lookupCR_fast(rd, ARow);
      } else {
        cr = rd.Collection.Items[ARow - this.FirstRowIndex];
      }

      if (cr != null) {
        if (this.ColBO.CurrentRow === cr) {
          if (cp.ReadOnly) {
            bc = this.FCurrentColor;
            cc = TColGridColorClass.EditableColor;
          } else {
            bc = this.FTransColor;
            cc = TColGridColorClass.AlternatingEditableColor;
          }
        }

        const TempColor: TColor = bc;
        CellProp.Color = bc;
        cr.UpdateCellProp(cp, CellProp);
        if (CellProp.HasGroup) {
          CellProp.ShowGroup = true;
        } else {
          CellProp.GroupColor = CellProp.Color;
        }
        bc = CellProp.Color;

        if (bc !== TempColor) {
          cc = TColGridColorClass.CustomColor;
        }
      }

      if (ARow === this.HeaderRowIndex) {
        bc = ColorConst.clHeader;
        cc = TColGridColorClass.HeaderColor;
      }
    }

    CellProp.HTMLColor = TColGridColors.HTMLColor(bc);
    CellProp.Color = bc;
    CellProp.Alignment = cp.Alignment;
    CellProp.ColorClass = cc;
    result = CellProp;

    return result;
  }

  lookupCR(rd: N, ARow: number) {
    const cpBaseID = this.ColsActive.GetByName('col_BaseID');
    if (cpBaseID) {
      const BaseID = TUtils.StrToIntDef(this.Grid.GetCells(cpBaseID.Index, ARow), -1);
      if (BaseID >= 0) {
        if (rd.Collection) {
          return rd.Collection.FindBase(BaseID);
        }
      }
    }
  }

  /**
   * Assume 'col_BaseID' is at Index 0 in ColsActive
   * @param rd the round, a Node; find RowCollectionItem I in the Collection C of this Node N
   * @param ARow the row
   */
  lookupCR_fast(rd: N, ARow: number): I {
    const BaseID = TUtils.StrToIntDef(this.Grid.GetCells(0, ARow), -1);
    return rd.Collection.FindBase(BaseID);
  }

  SetMenuMode(Value: boolean) {
    this.FMenuMode = Value;
    if (this.FMenuMode) {
      this.Grid.FixedRows = 0;
      this.HeaderRowIndex = -1;
      this.FirstRowIndex = 0;
    } else {
      this.Grid.FixedRows = 1;
      this.HeaderRowIndex = 0;
      this.FirstRowIndex = 1;
    }
    this.Grid.FirstRowIndex = this.FirstRowIndex;
    this.Grid.HeaderRowIndex = this.HeaderRowIndex;
  }

  GetActiveColor(): TColGridColorRec {
    const result = new TColGridColorRec();
    result.DefaultColor = this.FDefaultColor;
    result.AlternatingColor = this.FDefaultColor;
    result.FocusColor = this.FFocusColor;
    result.EditableColor = this.FEditableColor;
    result.AlternatingEditableColor = this.FAlternatingEditableColor;
    result.CurrentColor = this.FCurrentColor;
    result.TransColor = this.FTransColor;
    return result;
  }

  SetActiveColors(Value: TColGridColorRec) {
    this.FDefaultColor = Value.DefaultColor;
    this.FAlternatingColor = Value.DefaultColor;
    this.FFocusColor = Value.FocusColor;
    this.FEditableColor = Value.EditableColor;
    this.FAlternatingEditableColor = Value.AlternatingEditableColor;
    this.FCurrentColor = Value.CurrentColor;
    this.FTransColor = Value.TransColor;
    this.Grid.InvalidateGrid();
  }

  InitCellProp(ACol: number, ARow: number): TCellProp {
    const rd = this.GetBaseNode();
    if (!rd) {
      return null;
    }
    const cp = this.ColsActive.Items[ACol];
    if (!cp) {
      return null;
    }
    const IsSorted = this.ColsActive.SortColIndex !== -1;
    return this.UpdateCellProp(rd, cp, IsSorted, ACol, ARow);
  }

  InitCellProps() {
    let rd: N;
    let cp: PI;
    let IsSorted: boolean;

    this.CellProps.ColCount = this.Grid.ColCount;
    for (let c = 0; c < this.Grid.ColCount; c++) {
      rd = this.GetBaseNode();
      cp = this.ColsActive.Items[c];
      IsSorted = (this.ColsActive.SortColIndex !== -1);
      for (let r = 0; r < this.Grid.RowCount; r++) {
        this.UpdateCellProp(rd, cp, IsSorted, c, r);
      }
    }
  }

  protected Trace(s: string) {
    if (this.OnTrace) {
      this.OnTrace(s);
    }
  }

  get ColBO(): B { return this.FColBO; }

  GetBaseRowCollection(): C {
    const rd: N = this.GetBaseNode();
    if (rd) {
      return rd.Collection;
    }
    return null;
  }

  GetBaseNode(): N {
    if (this.OnGetBaseNode) {
      return this.OnGetBaseNode();
    } else {
      throw new Error('OnGetBaseNode not assigned.');
    }
  }

  AddColumn(aNameIndex: string): PI {
    // find column in ColsAvail and add to ColsActive
    const cp = this.ColsAvail.GetByName(aNameIndex);
    if (cp) {
      const result = this.ColsActive.Add();
      result.Assign(cp);
      return result;
    }
    return null;
  }

  /**
   * Update grid RowCount, but do not push any row data to the grid.
   */
  private UpdateGridRowCount(): C {
    // should never be in edit mode
    console.assert(this.Grid.IsEditorMode === false, 'unexpected state: CollectionGrid in edit mode');

    const cl = this.GetBaseRowCollection();
    console.assert(cl != null, 'RowCollection null in Grid');
    if (cl != null) {
      // check RowCount, sollte immer stimmen, wenn schon Zeilen vorhanden sind
      if (this.Grid.RowCount !== cl.Count + this.FirstRowIndex) {
        if (cl.Count > 0) {
          console.assert(this.Grid.RowCount === cl.Count + this.FirstRowIndex, 'unexpected state for Grid.RowCount');
          this.Grid.RowCount = cl.FilteredCount + this.FirstRowIndex;
        } else {
          this.Grid.RowCount = this.FirstRowIndex + 1;
        }
      }
    }
    return cl;
  }

  /**
   * Update rows using DisplayOrder. Will push data to the grid.
   */
  private UpdateGridRows(cl: C) {
    console.assert(cl != null, 'RowCollection null in Grid');
    if (cl != null) {
      let r = this.FirstRowIndex - 1; // r will be incremented before use
      let cr: I;
      for (let j = 0; j < cl.Count; j++) {
        let i = j;
        if (this.DisplayOrder.Count === cl.FilteredCount && j < this.DisplayOrder.Count) {
          i = this.DisplayOrder.GetDisplayIndex(j);
        }
        if (i < 0 || i > cl.Count - 1) {
          continue;
        }
        cr = cl.GetItem(i);
        if (cr.IsInFilter()) {
          ++r;
          if (this.ColsActive != null) {
            this.ColsActive.UpdateRow(this.Grid, r, cr);
          }
        }
      }
    }
  }

  ShowData() {
    if (this.IsCollectionGrid) {
      this.UpdateGridRowCount();
    } else {
      const cl = this.UpdateGridRowCount();
      this.UpdateGridRows(cl);
    }

    if (this.UseHTML) {
      this.InitCellProps();
    }

    this.Grid.ShowData();
  }

  UpdateAll() {
    this.Grid.CancelEdit();
    this.DisplayOrder.Clear();
    this.SetupGrid();
    this.InitDisplayOrder(this.ColsActive.SortColIndex);
    this.ShowData();
  }

  InitDisplayOrder(col: number) {
    // do it only sortable columns
    const cp: PI = this.ColsActive.Items[col];
    if (!cp || (!cp.Sortable)) {
      return;
    }

    // remember index of sorted column in ColsActive
    this.ColsActive.SortColIndex = cp.Index;

    // the collection to be sorted must be available of course
    const cl: C = this.GetBaseRowCollection();
    if (!cl) {
      return;
    }

    // update DisplayOrder
    this.DisplayOrder.Clear();

    let cr: I;
    let sortkey = '';
    for (let i = 0; i < cl.Count; i++) {
      cr = cl.Items[i];
      if (cr.IsInFilter) {
        sortkey = cp.GetSortKey(cr, sortkey);

        if (cp.ColType === TColType.colTypeString) {
          this.DisplayOrder.AddNumber(sortkey, i); // no leading zero's for string columns,
        } else {
          this.DisplayOrder.AddNumber(TColGrid.LeadingZeros(20, sortkey), i);
        }
      }
    }
    this.DisplayOrder.Sort();

    // Note: commented out, because (now and here) we control this manually from UI
    // this.DisplayOrder.Descending = cp.Descending;
  }

  AddRowCollectionItem() {
    let cl: C;
    let cr: I;

    cl = null;
    if (this.ColBO && this.ColBO.CurrentNode) {
      cl = this.ColBO.CurrentNode.Collection;
    }
    cr = cl.Add();
    this.UpdateAll();
    this.Grid.Enabled = cl.FilteredCount > 0;
  }

  /** Toggle the highlight of current row,
   * usually done with VK_F4 key stroke,
   * and call attached event handler,
   * if there is one.
   */
  MarkRowCollectionItem() {
    let cr: I;
    if (this.ColBO) {
      cr = this.GetRowCollectionItem(this.Grid.Row);
      if (cr === this.ColBO.CurrentRow) {
        this.ColBO.CurrentRow = null;
      } else {
        this.ColBO.CurrentRow = cr;
      }

      this.ShowData();
      if (this.OnMarkRow) {
        this.OnMarkRow(this);
      }
    }
  }

  /**
   * This method toggles between sorting of first column and no sorting.
   *
   * This will effect the visibility of the row highlight.
   * (ColorPaint = row highlight)
   *
   * Highlighting the current row only takes place if not sorted.
   *
   * The sortorder of the first column is the default sort order.
   * The values in this column are usually sorted by default (autoincremented numbers),
   * so that the Grid looks the same if sorted by first column or not sorted.
   *
   * Setting SortColIndex to 0 turns Sorting on and ColorPaint off.
   * Setting SortColIndex to -1 turns ColorPaint on and sorting off.
   *
   * Sorting and ColorPainting are dependent on each other.
   * There is one application where the highligting is done over a range of related rows
   * which only makes sense if the rows are drawn next to each other
   * as when sorted in default order, which is the same as no sorting.
   *
   * For some applications with only one current row it still makes sense
   * to highlight the current row only when not sorted, otherwise the highlight
   * will jump around if the 'current position' iterates over the rows.
   */
  ToggleColorPaint() {
    if (this.ColorPaint) { // ColsActive.SortColIndex = -1
      this.ColsActive.SortColIndex = 0; // turn ColorPaint off
    } else {
      this.ColsActive.SortColIndex = -1; // turn ColorPaint on
    }
    this.UpdateAll();
  }

  toString(): string {
    let result = '';
    try {
      const SL = new TStringList();
      this.Content(SL, ''); // may throw exception ?
      result = SL.Text;
    } catch {
      result = '';
    }
    return result;
  }

  Content(SL: TStringList, aCaption: string, wantHtmlTag: boolean = false) {
    let s: string;
    let cp: TBaseColProp<G, B, N, C, I, PC, PI>;
    let sColor: string;

    if (wantHtmlTag) {
      SL.Add('<html><head><tiltle>StringGrid</title></head><body>');
    }

    SL.Add('<table width="100 %" cellspacing="0" cellpadding="1">');
    if (aCaption !== '') {
      SL.Add('<caption>' + aCaption + '</caption>');
    }
    for (let r = 0; r < this.Grid.RowCount; r++) {
      SL.Add('<tr align="left">');
      for (let c = 0; c < this.Grid.ColCount; c++) {
        cp = this.FColsActive.GetItem(c);
        if (!cp) {
          continue;
        }

        s = this.Grid.GetCells(c, r);
        sColor = this.CellProps.GetCellProp(c, r).HTMLColor;
        if (s === '') {
          s = '&nbsp;';
        }
        if (r === 0) {
          if (cp.Alignment === TColAlignment.taRightJustify) {
            SL.Add('<th align="right">' + s + '</th>');
          } else {
            SL.Add('<th>' + s + '</th>');
          }
        } else {
          if (cp.Alignment === TColAlignment.taRightJustify) {
            SL.Add('<td bgcolor="' + sColor + '" align="right">' + s + '</td>');
          } else {
            SL.Add('<td bgcolor="' + sColor + '">' + s + '</td>');
          }
        }
      }
      SL.Add('</tr>');
    }
    SL.Add('</table>');

    if (wantHtmlTag) {
      SL.Add('</body></html>');
    }
  }

  /**
   * Find Item by row via BaseID (looking up the number in ID column)
   * @param row the row index (one item could render multiple rows)
   * @return Item if found or null
   */
  GetRowCollectionItem(row: number): I {
    if (this.ColsActive.Count === 0) {
      return null;
    }
    const cl = this.GetBaseRowCollection();
    if (!cl) {
      return null;
    }

    if (row > this.HeaderRowIndex && row <= cl.Count) {
      const cp = this.ColsActive.GetByName('col_BaseID');
      if (cp) {
        const bid = TUtils.StrToIntDef(this.Grid.GetCells(cp.Index, row), -1);
        return cl.FindBase(bid);
      }
    }
    return null;
  }

  SetColsActiveReference(Value: PC) {
    this.Grid.CancelEdit();
    if (Value) {
      this.FColsActive = Value;
    } else {
      this.FColsActive = this.FColsActiveDefault;
    }
    this.UpdateAll();
  }

  SetColBOReference(Value: B) {
    if (Value) {
      this.FColBO = Value;
    } else {
      this.FColBO = this.FColBODefault;
    }
  }

  IsOddRow(r: number): boolean {
    const t = Math.round((r + 1 + this.HeaderRowIndex) / this.FHeatSize);
    return TUtils.Odd(t);
  }

  get ColsActive(): PC { return this.FColsActive; }
  get ColorPaint(): boolean { return this.GetColorPaint(); }
  set ColorPaint(value: boolean) { this.SetColorPaint(value); }

  get ColsAvail(): PC { return this.FColsAvail; }
  set ColsAvail(value: PC) { this.SetColsAvail(value); }
  get ColorSchema(): TColGridColorScheme { return this.FColorSchema; }
  set ColorSchema(value: TColGridColorScheme) { this.SetColorSchema(value); }
}
