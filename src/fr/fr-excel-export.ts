import { TStringList } from '../util/fb-strings';
import { TableID, TableToken } from './fr-excel-importer';
import { TBO } from './fr-bo';
import { TStammdatenRowCollection } from '../col/stammdaten/stammdaten-row-collection';
import { TStammdatenRowCollectionItem } from '../col/stammdaten/stammdaten-row-collection-item';
import { TEventRowCollectionItem, TEventRowCollection } from '../col/event/event-row-collection';
import { TEventRaceEntry } from '../col/event/event-race-entry';
import { TRaceRowCollection } from '../col/race/race-row-collection';
import { TRaceRowCollectionItem } from '../col/race/race-row-collection-item';
import { TTimePoint } from '../col/race/time-point';
import { TColCaptions } from '../grid/col-captions';

export class TExcelExporter {
    protected SL: TStringList;
    private SLToken: TStringList;
    Delimiter: string;

    constructor() {
        this.SL = new TStringList();
        this.SLToken = new TStringList();
        this.Delimiter = ';';

    }

    FillTable(tid: number, BO: TBO): void {
        switch (tid) {
            case TableID.NameList: this.GetNameList(BO); break;
            case TableID.StartList: this.GetStartList(BO); break;
            case TableID.FleetList: this.GetFleetList(BO); break;
            case TableID.FinishList: this.GetFinishList(BO); break;
            case TableID.ResultList: this.GetResultList(BO); break;
            case TableID.CaptionList: this.GetCaptionList(); break;
        }
    }

    private CopyLines(Memo: TStringList): void {
        for (let i = 0; i < this.SL.Count; i++) {
            Memo.Add(this.SL.Items(i));
        }
    }

    AddTimingSection(BO: TBO, Memo: TStringList, r: number): void {
        Memo.Add(TableToken.TimeListStart + '.R' + r.toString());
        this.GetTimeList(r, BO);
        this.CopyLines(Memo);
        Memo.Add(TableToken.TimeListEnd);
    }

    AddRaceFinishSection(BO: TBO, Memo: TStringList, r: number): void {
        // partial finish list with only one race and only Bib (without SNR)
        Memo.Add(TableToken.FinishListStart);
        this.GetRaceFinishList(BO, r);
        this.CopyLines(Memo);
        Memo.Add(TableToken.FinishListEnd);
    }

    AddSection(tid: number, BO: TBO, Memo: TStringList): void {
        switch (tid) {
            case TableID.NameList:
                Memo.Add(TableToken.NameListStart);
                this.GetNameList(BO);
                this.CopyLines(Memo);
                Memo.Add(TableToken.NameListEnd);
                break;

            case TableID.StartList:
                Memo.Add(TableToken.StartListStart);
                this.GetStartList(BO);
                this.CopyLines(Memo);
                Memo.Add(TableToken.StartListEnd);
                break;

            case TableID.FleetList:
                Memo.Add(TableToken.FleetListStart);
                this.GetFleetList(BO);
                this.CopyLines(Memo);
                Memo.Add(TableToken.FleetListEnd);
                break;

            case TableID.FinishList:
                Memo.Add(TableToken.FinishListStart);
                this.GetFinishList(BO);
                this.CopyLines(Memo);
                Memo.Add(TableToken.FinishListEnd);
                break;

            case TableID.ResultList:
                Memo.Add(TableToken.ResultListStart);
                this.GetResultList(BO);
                this.CopyLines(Memo);
                Memo.Add(TableToken.ResultListEnd);
                break;

            case TableID.TimeList:
                for (let r = 1; r <= BO.BOParams.RaceCount; r++) {
                    if (r > 0) {
                        this.SL.Add('');
                    }
                    Memo.Add(TableToken.TimeListStart + '.R' + r.toString());
                    this.GetTimeList(r, BO);
                    this.CopyLines(Memo);
                    Memo.Add(TableToken.TimeListEnd);
                    Memo.Add('');
                }
                break;

            case TableID.CaptionList:
                Memo.Add(TableToken.CaptionListStart);
                this.GetCaptionList();
                this.CopyLines(Memo);
                Memo.Add(TableToken.CaptionListEnd);
                break;

        }
    }

    AddLines(tableID: number, BO: TBO, Memo: TStringList): void {
        this.FillTable(tableID, BO);
        for (let i = 0; i < this.SL.Count; i++) {
            Memo.Add(this.SL.Items(i));
        }
    }

    GetString(tableID: number, BO: TBO): string {
        this.FillTable(tableID, BO);
        return this.SL.Text;
    }

    GetNameList(BO: TBO): void {
        let s: string;
        let cl: TStammdatenRowCollection;
        let cr: TStammdatenRowCollectionItem;

        this.SL.Clear();
        this.SLToken.Delimiter = this.Delimiter;
        cl = BO.EventNode.StammdatenRowCollection;
        if (cl.Count < 1) {
            return;
        }

        cr = cl.Items[0];

        // HeaderLine
        this.SLToken.Clear();
        this.SLToken.Add('SNR');
        for (let j1 = 1; j1 <= cr.FieldCount; j1++) {
            if (cr.GetFieldUsed(j1)) {
                this.SLToken.Add('N' + j1.toString());
            }
        }
        s = this.SLToken.DelimitedText;
        this.SL.Add(s);

        // Data Lines
        for (let i = 0; i < cl.Count; i++) {
            cr = cl.Items[i];
            this.SLToken.Clear();
            this.SLToken.Add(cr.SNR.toString());
            for (let j2 = 1; j2 <= cr.FieldCount; j2++) {
                if (!cr.GetFieldUsed(j2)) {
                    continue;
                }
                this.SLToken.Add(cr.getItem(j2));
            }
            s = this.SLToken.DelimitedText;
            this.SL.Add(s);
        }
    }

    GetStartList(BO: TBO): void {
        this.SL.Clear();
        this.SLToken.Delimiter = this.Delimiter;
        const cl: TEventRowCollection = BO.EventNode.Collection;
        if (cl.Count < 1) {
            return;
        }

        // HeaderLine
        this.SLToken.Clear();
        this.SLToken.Add('Pos');
        this.SLToken.Add('SNR');
        this.SLToken.Add('Bib');
        let s: string = this.SLToken.DelimitedText;
        this.SL.Add(s);

        // DataLines
        for (let i = 0; i < cl.Count; i++) {
            const cr: TEventRowCollectionItem = cl.Items[i];
            this.SLToken.Clear();
            this.SLToken.Add(cr.BaseID.toString());
            this.SLToken.Add(cr.SNR.toString());
            this.SLToken.Add(cr.Bib.toString());
            s = this.SLToken.DelimitedText;
            this.SL.Add(s);
        }
    }

    GetRaceFinishList(BO: TBO, r: number): void {
        let s: string;
        let cl: TEventRowCollection;
        let cr: TEventRowCollectionItem;
        let ere: TEventRaceEntry;

        this.SL.Clear();
        this.SLToken.Delimiter = this.Delimiter;
        cl = BO.EventNode.Collection;
        if (cl.Count < 1) {
            return;
        }

        // HeaderLine
        this.SLToken.Clear();
        // this.SLToken.Add('SNR');
        this.SLToken.Add('Bib');
        cr = cl.Items[0];
        this.SLToken.Add('R' + r.toString());
        s = this.SLToken.DelimitedText;
        this.SL.Add(s);

        // DataLines
        for (let i = 0; i < cl.Count; i++) {
            cr = cl.Items[i];
            this.SLToken.Clear();
            // this.SLToken.Add(cr.SNR.toString());
            this.SLToken.Add(cr.Bib.toString());
            ere = cr.Race[r];
            this.SLToken.Add(ere.OTime.toString());
            s = this.SLToken.DelimitedText;
            this.SL.Add(s);
        }
    }

    GetFinishList(BO: TBO): void {
        let s: string;
        let cl: TEventRowCollection;
        let cr: TEventRowCollectionItem;
        let ere: TEventRaceEntry;

        this.SL.Clear();
        this.SLToken.Delimiter = this.Delimiter;
        cl = BO.EventNode.Collection;
        if (cl.Count < 1) {
            return;
        }

        // HeaderLine
        this.SLToken.Clear();
        this.SLToken.Add('SNR');
        this.SLToken.Add('Bib');
        cr = cl.Items[0];
        for (let r1 = 1; r1 < cr.RCount; r1++) {
            this.SLToken.Add('R' + r1.toString());
        }
        s = this.SLToken.DelimitedText;
        this.SL.Add(s);

        // DataLines
        for (let i = 0; i < cl.Count; i++) {
            cr = cl.Items[i];
            this.SLToken.Clear();
            this.SLToken.Add(cr.SNR.toString());
            this.SLToken.Add(cr.Bib.toString());
            for (let r2 = 1; r2 < cr.RCount; r2++) {
                ere = cr.Race[r2];
                this.SLToken.Add(ere.OTime.toString());
            }
            s = this.SLToken.DelimitedText;
            this.SL.Add(s);
        }
    }

    GetFleetList(BO: TBO): void {
        let s: string;
        let cl: TEventRowCollection;
        let cr: TEventRowCollectionItem;
        let ere: TEventRaceEntry;

        this.SL.Clear();
        this.SLToken.Delimiter = this.Delimiter;
        cl = BO.EventNode.Collection;
        if (cl.Count < 1) {
            return;
        }

        // HeaderLine
        this.SLToken.Clear();
        this.SLToken.Add('SNR');
        this.SLToken.Add('Bib');
        cr = cl.Items[0];
        for (let r1 = 1; r1 < cr.RCount; r1++) {
            this.SLToken.Add('R' + r1.toString());
        }
        s = this.SLToken.DelimitedText;
        this.SL.Add(s);

        // Data Lines
        for (let i = 0; i < cl.Count; i++) {
            cr = cl.Items[i];
            this.SLToken.Clear();
            this.SLToken.Add(cr.SNR.toString());
            this.SLToken.Add(cr.Bib.toString());
            for (let r2 = 1; r2 < cr.RCount; r2++) {
                ere = cr.Race[r2];
                this.SLToken.Add(ere.Fleet.toString());
            }
            s = this.SLToken.DelimitedText;
            this.SL.Add(s);
        }
    }

    GetResultList(BO: TBO): void {
        let s: string;
        let cl: TEventRowCollection;
        let cr: TEventRowCollectionItem;
        let ere: TEventRaceEntry;

        this.SL.Clear();
        this.SLToken.Delimiter = this.Delimiter;
        cl = BO.EventNode.Collection;
        if (cl.Count < 1) {
            return;
        }

        // HeaderLine
        this.SLToken.Clear();
        this.SLToken.Add('SNR');
        this.SLToken.Add('Bib');
        this.SLToken.Add('N1');
        this.SLToken.Add('N2');
        this.SLToken.Add('N3');
        this.SLToken.Add('N4');
        this.SLToken.Add('N5');
        this.SLToken.Add('N6');
        cr = cl.Items[0];
        for (let r1 = 1; r1 < cr.RCount; r1++) {
            this.SLToken.Add('R' + r1.toString());
        }
        s = this.SLToken.DelimitedText;
        this.SL.Add(s);

        // Data Lines
        for (let i = 0; i < cl.Count; i++) {
            cr = cl.Items[i];
            this.SLToken.Clear();
            this.SLToken.Add(cr.SNR.toString());
            this.SLToken.Add(cr.Bib.toString());
            this.SLToken.Add(cr.FN);
            this.SLToken.Add(cr.LN);
            this.SLToken.Add(cr.SN);
            this.SLToken.Add(cr.NC);
            this.SLToken.Add(cr.GR);
            this.SLToken.Add(cr.PB);
            for (let r2 = 1; r2 < cr.RCount; r2++) {
                ere = cr.Race[r2];
                this.SLToken.Add(ere.OTime.toString());
            }
            s = this.SLToken.DelimitedText;
            this.SL.Add(s);
        }
    }

    GetTimeList(r: number, BO: TBO): void {
        let s: string;
        let cl: TRaceRowCollection;
        let cr: TRaceRowCollectionItem;
        let tp: TTimePoint;

        this.SL.Clear();
        this.SLToken.Delimiter = this.Delimiter;
        cl = BO.RNode[r].Collection;
        if (cl.Count < 1) {
            return;
        }

        // HeaderLine
        this.SLToken.Clear();
        this.SLToken.Add('SNR');
        this.SLToken.Add('Bib');
        cr = cl.Items[0];
        for (let i1 = 1; i1 < cr.ITCount; i1++) {
            this.SLToken.Add('IT' + i1.toString());
        }
        this.SLToken.Add('FT');
        s = this.SLToken.DelimitedText;
        this.SL.Add(s);

        // DataLines
        for (let i2 = 0; i2 < cl.Count; i2++) {
            cr = cl.Items[i2];
            this.SLToken.Clear();
            this.SLToken.Add(cr.SNR.toString());
            this.SLToken.Add(cr.Bib.toString());
            for (let t = 1; t < cr.ITCount; t++) {
                tp = cr.IT[t];
                this.SLToken.Add(tp.OTime.AsString);
            }
            tp = cr.IT[0];
            this.SLToken.Add(tp.OTime.AsString);
            s = this.SLToken.DelimitedText;
            this.SL.Add(s);
        }

    }

    GetCaptionList(): void {
        this.SL.Clear();
        this.SLToken.Clear();
        this.SLToken.Delimiter = this.Delimiter;
        this.SL.Text = TColCaptions.ColCaptionBag.Text;
    }

}

