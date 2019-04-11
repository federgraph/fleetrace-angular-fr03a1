import { TStammdatenRowCollectionItem } from "./stammdaten-row-collection-item";
import { TUtils } from "../../util/fb-classes";
import { TBaseColBO } from "../../grid/col-grid";
import { TStammdatenColGrid, TStammdatenColProps } from "./stammdaten-grid";
import { TStammdatenNode } from "./stammdaten-node";
import { TStammdatenRowCollection } from "./stammdaten-row-collection";
import { TStammdatenColProp } from "./stammdaten-col-prop";
import { TBO } from "../../fr/fr-bo";

export class TStammdatenBO extends TBaseColBO<
        TStammdatenColGrid,
        TStammdatenBO,
        TStammdatenNode,
        TStammdatenRowCollection,
        TStammdatenRowCollectionItem,
        TStammdatenColProps,
        TStammdatenColProp
        >
    {

        constructor(public BO: TBO)
        {
            super();
        }

        get FieldCount(): number
        {
            return this.BO.BOParams.FieldCount;
        }

        InitColsActive(g: TStammdatenColGrid): void
        {
            let cp: TStammdatenColProp;
            g.ColsActive.Clear();
            g.AddColumn("col_BaseID");

            cp = g.AddColumn("col_SNR");
            cp.OnFinishEdit = this.EditSNR;
            cp.ReadOnly = false;

            const fc: number = this.FieldCount;

            if (fc > 0)
            {
                cp = g.AddColumn("col_FN");
                cp.OnFinishEdit = this.EditFN;
                cp.ReadOnly = false;
            }

            if (fc > 1)
            {
                cp = g.AddColumn("col_LN");
                cp.OnFinishEdit = this.EditLN;
                cp.ReadOnly = false;
            }

            if (fc > 2)
            {
                cp = g.AddColumn("col_SN");
                cp.OnFinishEdit = this.EditSN;
                cp.ReadOnly = false;
            }

            if (fc > 3)
            {
                cp = g.AddColumn("col_NC");
                cp.OnFinishEdit = this.EditNC;
                cp.ReadOnly = false;
            }

            if (fc > 4)
            {
                cp = g.AddColumn("col_GR");
                cp.OnFinishEdit = this.EditGR;
                cp.ReadOnly = false;
            }

            if (fc > 5)
            {
                cp = g.AddColumn("col_PB");
                cp.OnFinishEdit = this.EditPB;
                cp.ReadOnly = false;
            }

            if (fc > TStammdatenRowCollection.FixFieldCount)
            {
                for (let i = TStammdatenRowCollection.FixFieldCount + 1; i <= fc; i++)
                {
                    cp = g.AddColumn("col_N" + i.toString());
                    cp.OnFinishEdit2 = this.EditNameColumn;
                    cp.ReadOnly = false;
                }
            }
        }

        EditSNR(cr: TStammdatenRowCollectionItem, value: string): string
        {
            if (cr == null) 
                return value;
            cr.SNR = TUtils.StrToIntDef(value, cr.SNR);
            const result = TUtils.IntToStr(cr.SNR);
            cr.Modified = true;
            return result;
        }

        EditFN(cr: TStammdatenRowCollectionItem, value: string): string
        {
            if (cr == null) 
                return value;
            cr.FN = value;
            return value;
        }

        EditLN(cr: TStammdatenRowCollectionItem, value: string): string
        {
            if (cr == null) 
                return value;
            cr.LN = value;
            return value;
        }

        EditSN(cr: TStammdatenRowCollectionItem, value: string): string
        {
            if (cr == null) 
                return value;
            cr.SN = value;
            return cr.SN;
        }

        EditNC(cr: TStammdatenRowCollectionItem, value: string): string
        {
            if (cr == null) 
                return value;
            cr.NC = value;
            return value;
        }

        EditGR(cr: TStammdatenRowCollectionItem, value: string): string
        {
            if (cr == null) return "";
            cr.GR = value;
            return value;
        }

        EditPB(cr: TStammdatenRowCollectionItem, value: string): string
        {
            if (cr == null) return "";
            cr.PB = value;
            return value;
        }

        EditNameColumn(cr: TStammdatenRowCollectionItem, value: string, ColName: string): string
        {
            if (cr == null) return "";
            let i: number;
            try
            {
                i = Number.parseInt(ColName.substring(5), 10); // 'col_N'x
            }
            catch
            {
                i = -1;
            }
            if (i > -1)
            {
                cr.setItem(i, value);
                cr.Modified = true;
            }
            return value;
        }

    }


