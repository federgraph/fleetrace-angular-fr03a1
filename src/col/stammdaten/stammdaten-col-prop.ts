import { TBaseColProp } from '../../grid/col-grid';
import { TColAlignment, TColType } from '../../grid/grid-def';
import { TStammdatenColGrid, TStammdatenColProps } from './stammdaten-grid';
import { TStammdatenBO } from './stammdaten-bo';
import { TStammdatenNode } from './stammdaten-node';
import { TStammdatenRowCollection } from './stammdaten-row-collection';
import { TStammdatenRowCollectionItem } from './stammdaten-row-collection-item';
import { FieldNames } from './stammdaten-fieldnames';
import { TBO } from '../../fr/fr-bo';

export class TStammdatenColProp extends TBaseColProp<
  TStammdatenColGrid,
  TStammdatenBO,
  TStammdatenNode,
  TStammdatenRowCollection,
  TStammdatenRowCollectionItem,
  TStammdatenColProps,
  TStammdatenColProp
> {
  protected static readonly NidSNR = -1;
  protected static readonly NidFN = 1;
  protected static readonly NidLN = 2;
  protected static readonly NidSN = 3;
  protected static readonly NidNC = 4;
  protected static readonly NidGR = 5;
  protected static readonly NidPB = 6;

  constructor(
    cl: TStammdatenColProps,
    public BO: TBO,
  ) {
    super(cl);
  }

  GetFieldCount(): number {
    let i: number;
    i = this.BO.BOParams.FieldCount;
    if (i < TStammdatenRowCollection.FixFieldCount) {
      i = TStammdatenRowCollection.FixFieldCount;
    }
    return i;
  }

  GetFieldCaptionDef(cl: TStammdatenRowCollection, index: number, def: string): string {
    return cl != null ? cl.GetFieldCaption(index) : def;
  }

  GetStammdatenRowCollection(): TStammdatenRowCollection {
    const n: TStammdatenNode = this.GetStammdatenNode();
    return n != null ? n.Collection : null;
  }

  GetStammdatenNode(): TStammdatenNode {
    return this.BO.StammdatenNode;
  }

  override InitColsAvail(): void {
    const ColsAvail: TStammdatenColProps = this.Collection;

    let cp: TStammdatenColProp;
    const cl: TStammdatenRowCollection = this.GetStammdatenRowCollection();

    // SNR
    cp = ColsAvail.Add();
    cp.NameID = 'col_SNR';
    cp.Caption = 'SNR';
    cp.Width = 40;
    cp.Sortable = true;
    cp.Alignment = TColAlignment.taRightJustify;
    cp.NumID = TStammdatenColProp.NidSNR;

    // FN
    cp = ColsAvail.Add();
    cp.NameID = 'col_FN';
    cp.Caption = this.GetFieldCaptionDef(cl, 1, FieldNames.FN);
    cp.Width = 80;
    cp.Sortable = true;
    cp.Alignment = TColAlignment.taLeftJustify;
    cp.ColType = TColType.colTypeString;
    cp.NumID = TStammdatenColProp.NidFN;

    // LN
    cp = ColsAvail.Add();
    cp.NameID = 'col_LN';
    cp.Caption = this.GetFieldCaptionDef(cl, 2, FieldNames.LN);
    cp.Width = 80;
    cp.Sortable = true;
    cp.Alignment = TColAlignment.taLeftJustify;
    cp.ColType = TColType.colTypeString;
    cp.NumID = TStammdatenColProp.NidLN;

    // SN
    cp = ColsAvail.Add();
    cp.NameID = 'col_SN';
    cp.Caption = this.GetFieldCaptionDef(cl, 3, FieldNames.SN);
    cp.Width = 80;
    cp.Sortable = true;
    cp.Alignment = TColAlignment.taLeftJustify;
    cp.ColType = TColType.colTypeString;
    cp.NumID = TStammdatenColProp.NidSN;

    // NC
    cp = ColsAvail.Add();
    cp.NameID = 'col_NC';
    cp.Caption = this.GetFieldCaptionDef(cl, 4, FieldNames.NC);
    cp.Width = 35;
    cp.Sortable = true;
    cp.Alignment = TColAlignment.taLeftJustify;
    cp.ColType = TColType.colTypeString;
    cp.NumID = TStammdatenColProp.NidNC;

    // GR
    cp = ColsAvail.Add();
    cp.NameID = 'col_GR';
    cp.Caption = this.GetFieldCaptionDef(cl, 5, FieldNames.GR);
    cp.Width = 55;
    cp.Sortable = true;
    cp.Alignment = TColAlignment.taLeftJustify;
    cp.ColType = TColType.colTypeString;
    cp.NumID = TStammdatenColProp.NidGR;

    // PB
    cp = ColsAvail.Add();
    cp.NameID = 'col_PB';
    cp.Caption = this.GetFieldCaptionDef(cl, 6, FieldNames.PB);
    cp.Width = 35;
    cp.Sortable = true;
    cp.Alignment = TColAlignment.taLeftJustify;
    cp.ColType = TColType.colTypeString;
    cp.NumID = TStammdatenColProp.NidPB;

    const fieldCount: number = this.GetFieldCount();
    if (fieldCount > TStammdatenRowCollection.FixFieldCount) {
      for (let i = TStammdatenRowCollection.FixFieldCount + 1; i <= fieldCount; i++) {
        cp = ColsAvail.Add();
        cp.NameID = 'col_N' + i.toString();
        cp.Caption = this.GetFieldCaptionDef(cl, i, 'N' + i.toString());
        cp.Width = 60;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taLeftJustify;
        cp.ColType = TColType.colTypeString;
        cp.NumID = i;
      }
    }
  }

  override GetTextDefault(cr: TStammdatenRowCollectionItem, value: string): string {
    let v = super.GetTextDefault(cr, value);

    if (this.NumID === TStammdatenColProp.NidSNR) {
      v = cr.SNR.toString();
    } else if (this.NumID === TStammdatenColProp.NidFN) {
      v = cr.FN;
    } else if (this.NumID === TStammdatenColProp.NidLN) {
      v = cr.LN;
    } else if (this.NumID === TStammdatenColProp.NidSN) {
      v = cr.SN;
    } else if (this.NumID === TStammdatenColProp.NidNC) {
      v = cr.NC;
    } else if (this.NumID === TStammdatenColProp.NidGR) {
      v = cr.GR;
    } else if (this.NumID === TStammdatenColProp.NidPB) {
      v = cr.PB;
    } else if (this.NumID > TStammdatenRowCollection.FixFieldCount) {
      v = cr.getItem(this.NumID);
    }
    return v;
  }
}
