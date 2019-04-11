import { TBaseColProp } from "../../grid/col-grid";
import { TRaceColGrid, TRaceColProps } from "./race-grid";
import { TRaceNode } from "./race-node";
import { TRaceRowCollection } from "./race-row-collection";
import { TRaceRowCollectionItem } from "./race-row-collection-item";
import { TStammdatenRowCollection } from "../stammdaten/stammdaten-row-collection";
import { TColAlignment, TColType } from "../../grid/grid-def";
import { TUtils } from "../../util/fb-classes";
import { FieldNames } from "../stammdaten/stammdaten-fieldnames";
import { TTimePoint } from "./time-point";
import { TBO } from "../../fr/fr-bo";
import { TRaceBO } from "./race-bo";

export class TRaceColProp extends TBaseColProp<
        TRaceColGrid,
        TRaceBO,
        TRaceNode,
        TRaceRowCollection,
        TRaceRowCollectionItem,
        TRaceColProps,
        TRaceColProp
        >
    {
        protected static NumID_SNR = 1;
        protected static NumID_Bib = 2;
        protected static NumID_FN = 3;
        protected static NumID_LN = 4;
        protected static NumID_SN = 5;
        protected static NumID_NC = 6;
        protected static NumID_GR = 7;
        protected static NumID_PB = 8;

        protected static NumID_QU = 9;
        protected static NumID_DG = 10;
        protected static NumID_MRank = 11;
        protected static NumID_ST = 12;
        protected static NumID_FT = 13;

        protected static NumID_ORank = 14;
        protected static NumID_Rank = 15;
        protected static NumID_PosR = 16;
        protected static NumID_PLZ = 17;

        protected static NumID_Space = 18;
        
        constructor(cl: TRaceColProps, public BO: TBO)
        {
            super(cl);
        }

        static NumID_IT(index: number): number
        {
            return 10000 + index * 10;
        }

        static ITIndex(numID: number): number
        {
            return Math.floor( (numID - 10000) / 10);
        }

        static IsITNumID(numID: number): boolean
        {
            return numID > 10000;
        }
        
        GetFieldCaptionDef(cl: TStammdatenRowCollection, index: number, def: string): string
        {
            return (cl != null) ? cl.GetFieldCaption(index) : def;
        }

        InitColsAvail(): void
        {
            const ColsAvail: TRaceColProps = this.Collection;
            ColsAvail.UseCustomColCaptions = true;
            const ITCount: number = this.BO.BOParams.ITCount;
            let cp: TRaceColProp;
            const scl: TStammdatenRowCollection = this.BO.StammdatenNode.Collection;

            // Bib
            cp = ColsAvail.Add();
            cp.NameID = "col_Bib";
            cp.Caption = "Bib";
            cp.Width = 35;
            cp.Sortable = true;
            cp.Alignment = TColAlignment.taRightJustify;
            cp.NumID = TRaceColProp.NumID_Bib;

            // SNR
            cp = ColsAvail.Add();
            cp.NameID = "col_SNR";
            cp.Caption = "SNR";
            cp.Width = 50;
            cp.Sortable = true;
            cp.Alignment = TColAlignment.taRightJustify;
            cp.NumID = TRaceColProp.NumID_SNR;

            // FN
            cp = ColsAvail.Add();
            cp.NameID = "col_FN";
            cp.Caption = this.GetFieldCaptionDef(scl, 1, FieldNames.FN);
            cp.Width = 80;
            cp.Sortable = true;
            cp.Alignment = TColAlignment.taLeftJustify;
            cp.ColType = TColType.colTypeString;
            cp.NumID = TRaceColProp.NumID_FN;

            // LN
            cp = ColsAvail.Add();
            cp.NameID = "col_LN";
            cp.Caption = this.GetFieldCaptionDef(scl, 2, FieldNames.LN);
            cp.Width = 80;
            cp.Sortable = true;
            cp.Alignment = TColAlignment.taLeftJustify;
            cp.ColType = TColType.colTypeString;
            cp.NumID = TRaceColProp.NumID_LN;

            // SN
            cp = ColsAvail.Add();
            cp.NameID = "col_SN";
            cp.Caption = this.GetFieldCaptionDef(scl, 3, FieldNames.SN);
            cp.Width = 80; // 100
            cp.Sortable = true;
            cp.Alignment = TColAlignment.taLeftJustify;
            cp.ColType = TColType.colTypeString;
            cp.NumID = TRaceColProp.NumID_SN;

            // NC
            cp = ColsAvail.Add();
            cp.NameID = "col_NC";
            cp.Caption = this.GetFieldCaptionDef(scl, 4, FieldNames.NC);
            cp.Width = 35;
            cp.Sortable = true;
            cp.Alignment = TColAlignment.taLeftJustify;
            cp.ColType = TColType.colTypeString;
            cp.NumID = TRaceColProp.NumID_NC;

            // GR
            cp = ColsAvail.Add();
            cp.NameID = "col_GR";
            cp.Caption = this.GetFieldCaptionDef(scl, 5, FieldNames.GR);
            cp.Width = 50;
            cp.Sortable = true;
            cp.Alignment = TColAlignment.taLeftJustify;
            cp.ColType = TColType.colTypeString;
            cp.NumID = TRaceColProp.NumID_GR;

            // PB
            cp = ColsAvail.Add();
            cp.NameID = "col_PB";
            cp.Caption = this.GetFieldCaptionDef(scl, 6, FieldNames.PB);
            cp.Width = 50;
            cp.Sortable = true;
            cp.Alignment = TColAlignment.taLeftJustify;
            cp.ColType = TColType.colTypeString;
            cp.NumID = TRaceColProp.NumID_PB;

            // QU
            cp = ColsAvail.Add();
            cp.NameID = "col_QU";
            cp.Caption = "QU";
            cp.Width = 30;
            cp.Sortable = true;
            cp.Alignment = TColAlignment.taRightJustify;
            // cp.ColType = TColType.colTypeString;
            cp.NumID = TRaceColProp.NumID_QU;

            // DG
            cp = ColsAvail.Add();
            cp.NameID = "col_DG";
            cp.Caption = "DG";
            cp.Width = 30;
            cp.Sortable = true;
            cp.Alignment = TColAlignment.taRightJustify;
            cp.ColType = TColType.colTypeRank;
            cp.NumID = TRaceColProp.NumID_DG;

            // MRank
            cp = ColsAvail.Add();
            cp.NameID = "col_MRank";
            cp.Caption = "MRank";
            cp.Width = 45;
            cp.Sortable = true;
            cp.Alignment = TColAlignment.taRightJustify;
            cp.ColType = TColType.colTypeRank;
            cp.NumID = TRaceColProp.NumID_MRank;

            // ST
            cp = ColsAvail.Add();
            cp.NameID = "col_ST";
            cp.Caption = "ST";
            cp.Width = 80;
            cp.Sortable = true;
            cp.Alignment = TColAlignment.taRightJustify;
            // cp.ColType = TColType.colTypeRank;
            cp.NumID = TRaceColProp.NumID_ST;

            // IT
            let s: string;
            let sc: string;
            let NumIDBase: number;
            for (let i = 0; i <= ITCount; i++)
            {
                s = "col_IT" + i.toString();
                if (i === 0) // channel_FT
                    sc = "FT" + i.toString();
                else
                    sc = "IT" + i.toString();

                NumIDBase = TRaceColProp.NumID_IT(i); // 1000 + i * 100;

                // OTime
                cp = ColsAvail.Add();
                cp.NameID = s;
                cp.Caption = sc;
                cp.Width = 80;
                cp.Sortable = true;
                cp.Alignment = TColAlignment.taRightJustify;
                // cp.ColType = TColType.colTypeRank;
                cp.NumID = NumIDBase + 1;

                // Behind
                cp = ColsAvail.Add();
                cp.NameID = s + "B";
                cp.Caption = sc + "B";
                cp.Width = 80;
                cp.Sortable = true;
                cp.Alignment = TColAlignment.taRightJustify;
                // cp.ColType = TColType.colTypeRank;
                cp.NumID = NumIDBase + 2;

                // BFT
                cp = ColsAvail.Add();
                cp.NameID = s + "BFT";
                cp.Caption = sc + "BFT";
                cp.Width = 80;
                cp.Sortable = true;
                cp.Alignment = TColAlignment.taRightJustify;
                // cp.ColType = TColType.colTypeRank;
                cp.NumID = NumIDBase + 3;

                // BPL
                cp = ColsAvail.Add();
                cp.NameID = s + "BPL";
                cp.Caption = sc + "BPL";
                cp.Width = 80;
                cp.Sortable = true;
                cp.Alignment = TColAlignment.taRightJustify;
                // cp.ColType = TColType.colTypeRank;
                cp.NumID = NumIDBase + 4;

                // ORank
                cp = ColsAvail.Add();
                cp.NameID = s + "ORank";
                cp.Caption = sc + "ORank";
                cp.Width = 55;
                cp.Sortable = true;
                cp.Alignment = TColAlignment.taRightJustify;
                // cp.ColType = TColType.colTypeRank;
                cp.NumID = NumIDBase + 5;

                // Rank
                cp = ColsAvail.Add();
                cp.NameID = s + "Rank";
                cp.Caption = sc + "Rank";
                cp.Width = 55;
                cp.Sortable = true;
                cp.Alignment = TColAlignment.taRightJustify;
                // cp.ColType = TColType.colTypeRank;
                cp.NumID = NumIDBase + 6;

                // PosR
                cp = ColsAvail.Add();
                cp.NameID = s + "PosR";
                cp.Caption = sc + "PosR";
                cp.Width = 55;
                cp.Sortable = true;
                cp.Alignment = TColAlignment.taRightJustify;
                // cp.ColType = TColType.colTypeRank;
                cp.NumID = NumIDBase + 7;

                // PLZ
                cp = ColsAvail.Add();
                cp.NameID = s + "PLZ";
                cp.Caption = sc + "PLZ";
                cp.Width = 50;
                cp.Sortable = true;
                cp.Alignment = TColAlignment.taRightJustify;
                // cp.ColType = TColType.colTypeRank;
                cp.NumID = NumIDBase + 8;
            }

            // OTime
            cp = ColsAvail.Add();
            cp.NameID = "col_FT";
            cp.Caption = "FT";
            cp.Width = 80;
            cp.Sortable = true;
            cp.Alignment = TColAlignment.taRightJustify;
            // cp.ColType = TColType.colTypeRank;
            cp.NumID = TRaceColProp.NumID_FT;

            // ORank
            cp = ColsAvail.Add();
            cp.NameID = "col_ORank";
            cp.Caption = "ORank";
            cp.Width = 45;
            cp.Sortable = true;
            cp.Alignment = TColAlignment.taRightJustify;
            cp.ColType = TColType.colTypeRank;
            cp.NumID = TRaceColProp.NumID_ORank;

            // Rank
            cp = ColsAvail.Add();
            cp.NameID = "col_Rank";
            cp.Caption = "Rank";
            cp.Width = 45;
            cp.Sortable = true;
            cp.Alignment = TColAlignment.taRightJustify;
            cp.ColType = TColType.colTypeRank;
            cp.NumID = TRaceColProp.NumID_Rank;

            // PosR
            cp = ColsAvail.Add();
            cp.NameID = "col_PosR";
            cp.Caption = "PosR";
            cp.Width = 35;
            cp.Sortable = true;
            cp.Alignment = TColAlignment.taRightJustify;
            cp.ColType = TColType.colTypeRank;
            cp.NumID = TRaceColProp.NumID_PosR;

            // PLZ
            cp = ColsAvail.Add();
            cp.NameID = "col_PLZ";
            cp.Caption = "PLZ";
            cp.Width = 30;
            cp.Sortable = true;
            cp.Alignment = TColAlignment.taRightJustify;
            // cp.ColType = TColType.colTypeRank;
            cp.NumID = TRaceColProp.NumID_PLZ;

            // Space
            cp = ColsAvail.Add();
            cp.NameID = "col_Space";
            cp.Caption = "";
            cp.Width = 10;
            cp.Sortable = false; // true;
            cp.Alignment = TColAlignment.taRightJustify;
            // cp.ColType = TColType.colTypeRank;
            cp.NumID = TRaceColProp.NumID_Space;
        }

        GetTextDefault(cr: TRaceRowCollectionItem, value: string): string
        {
            let v = super.GetTextDefault(cr, value);

            if (this.NumID === TRaceColProp.NumID_SNR)
                v = cr.SNR.toString();

            else if (this.NumID === TRaceColProp.NumID_Bib)
                v = cr.Bib.toString();

            else if (this.NumID === TRaceColProp.NumID_FN)
                v = cr.FN;

            else if (this.NumID === TRaceColProp.NumID_LN)
                v = cr.LN;

            else if (this.NumID === TRaceColProp.NumID_SN)
                v = cr.SN;

            else if (this.NumID === TRaceColProp.NumID_NC)
                v = cr.NC;

            else if (this.NumID === TRaceColProp.NumID_GR)
                v = cr.GR;

            else if (this.NumID === TRaceColProp.NumID_PB)
                v = cr.PB;

            else if (this.NumID === TRaceColProp.NumID_QU)
                v = cr.QU.toString();

            else if (this.NumID === TRaceColProp.NumID_DG)
                v = cr.DG.toString();

            else if (this.NumID === TRaceColProp.NumID_MRank)
                v = cr.MRank.toString();

            else if (this.NumID === TRaceColProp.NumID_ST)
                v = cr.ST.toString();

            else if (this.NumID === TRaceColProp.NumID_FT)
                v = cr.FT.OTime.toString();

            else if (this.NumID === TRaceColProp.NumID_ORank)
                v = cr.FT.ORank.toString();

            else if (this.NumID === TRaceColProp.NumID_Rank)
                v = cr.FT.Rank.toString();

            else if (this.NumID === TRaceColProp.NumID_PosR)
                v = cr.FT.PosR.toString();

            else if (this.NumID === TRaceColProp.NumID_PLZ)
                v = TUtils.IntToStr(cr.FT.PLZ + 1);

            else if (TRaceColProp.IsITNumID(this.NumID))
            {
                const i: number = TRaceColProp.ITIndex(this.NumID);
                const TP: TTimePoint = cr.IT[i];
                const BaseNumID: number = TRaceColProp.NumID_IT(i);
                if (TP != null)
                {
                    if (this.NumID === BaseNumID + 1)
                        v = TP.OTime.toString();
                    else if (this.NumID === BaseNumID + 2)
                        v = TP.Behind.toString();
                    else if (this.NumID === BaseNumID + 3)
                        v = TP.BFT.toString();
                    else if (this.NumID === BaseNumID + 4)
                        v = TP.BPL.toString();
                    else if (this.NumID === BaseNumID + 5)
                        v = TP.ORank.toString();
                    else if (this.NumID === BaseNumID + 6)
                        v = TP.Rank.toString();
                    else if (this.NumID === BaseNumID + 7)
                        v = TP.PosR.toString();
                    else if (this.NumID === BaseNumID + 8)
                        v = TUtils.IntToStr(TP.PLZ + 1);
                }
            }
            return v;
        }

    }


