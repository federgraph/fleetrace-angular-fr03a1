import { TBaseRowCollection, TBaseNode, TBaseColProp, TBaseRowCollectionItem } from '../../grid/col-grid';
import { TEventColGrid, TEventColProps } from './event-grid';
import { TEventBO } from './event-bo';
import { StringBuilder } from '../../util/fb-strings';
import { TBO } from '../../fr/fr-bo';
import { TNotifyEvent, TColAlignment, TColType, TColor } from '../../grid/grid-def';
import { TColorMode, TEntryError, TFinishError, FleetColor } from './event-enums';
import { TStammdatenRowCollection } from '../stammdaten/stammdaten-row-collection';
import { TOTimeErrorList } from '../../fr/fr-error-list';
import { TEventRaceEntry } from './event-race-entry';
import { TUtils } from '../../util/fb-classes';
import { FieldNames } from '../stammdaten/stammdaten-fieldnames';
import { TColorRec, ColorConst } from '../../grid/grid-color';
import { TStammdatenRowCollectionItem } from '../stammdaten/stammdaten-row-collection-item';
import { TProps } from '../../util/fb-props';
import { TCellProp } from '../../grid/grid-cell-prop';
import { TEnumSet } from '../../util/fb-enumset';

export class TEventRowCollectionItem extends TBaseRowCollectionItem<
    TEventColGrid,
    TEventBO,
    TEventNode,
    TEventRowCollection,
    TEventRowCollectionItem,
    TEventColProps,
    TEventColProp
    > {
    SNR: number = 0;
    Bib: number = 0;

    Race: TEventRaceEntry[];
    GRace: TEventRaceEntry;
    Cup: number = 0;
    RA = 0; // Uniqua-Ranglistenpunkte
    QR = 0.0; // WM Qualifikations-Punkte
    isTied: boolean = false;
    isGezeitet: boolean = false;
    EntryErrors: TEnumSet = new TEnumSet(TEntryError.error_OutOfRange_SNR); // set of TEntryError;

    constructor(
        Collection: TEventRowCollection,
        BO: TBO) {
        super(Collection, BO);
        // let rc = this.RaceCount + 1;
        const rc = BO.BOParams.RaceCount + 1;
        this.Race = new Array<TEventRaceEntry>(rc);
        for (let i = 0; i < this.RCount; i++) {
            this.Race[i] = new TEventRaceEntry(this.BO.EventNode);
        }
        this.GRace = this.Race[0];
    }

    protected GetIndex(): number {
        if (this.Collection != null) {
            return this.Collection.Items.indexOf(this);
        }
        return -1;
    }

    private GetSDItem(): TStammdatenRowCollectionItem {
        return this.ru.StammdatenRowCollection.FindKey(this.SNR);
    }

    AssignRow(o: TEventRowCollectionItem): void {
        if (o != null) {
            this.SNR = o.SNR;
            this.Bib = o.Bib;
            for (let i = 0; i < this.Race.length; i++) {
                this.Race[i].Assign(o.Race[i]);
            }
        }
    }

    ClearList(): void {
        super.ClearList();
        this.Bib = this.BaseID;
        this.SNR = 1000 + this.Bib;
    }

    ClearResult(): void {
        let ere: TEventRaceEntry;
        super.ClearResult();
        for (let r = 1; r <= this.RaceCount; r++) {
            ere = this.Race[r];
            ere.Clear();
        }
    }

    UpdateCellProp(cp: TEventColProp, cellProp: TCellProp): void {
        let NumID: number;
        let r: number;
        cellProp.Color = this.ColumnToColorDef(cp, cellProp.Color);
        NumID = cp.NumID;
        if (this.ru.UseFleets) {
            if (TEventColProp.IsRaceNumID(NumID)) {
                r = TEventColProp.RaceIndex(NumID);
                if (this.ru.ColorMode === TColorMode.ColorMode_Error) {
                    cellProp.GroupColor = this.FleetColorBold(r, TColorRec.Black);
                }
            }
        }
    }

    ColumnToColorDef(cp: TEventColProp, aColor: TColor): TColor {
        const ColorMode: TColorMode = this.ru.ColorMode;
        if (ColorMode === TColorMode.ColorMode_None) {
            return TColorRec.White;
        } else {
            const NumID: number = cp.NumID;
            if (NumID === TEventColProp.NidBib) {
                return this.BibColor(aColor);
            } else if (NumID === TEventColProp.NidSNR) {
                return this.SNRColor(aColor);
            } else if (TEventColProp.IsRaceNumID(NumID)) {
                return this.RaceColor(NumID, aColor);
            } else {
                return aColor;
            }
        }
    }

    private FleetColorBold(r: number, aColor: TColor): TColor {
        const i: number = this.Race[r].Fleet;
        switch (i) {
            case 0: return FleetColor.clFleetMedalBold;
            case 1: return FleetColor.clFleetYellowBold;
            case 2: return FleetColor.clFleetBlueBold;
            case 3: return FleetColor.clFleetRedBold;
            case 4: return FleetColor.clFleetGreenBold;
            default: return aColor;
        }
    }

    private FleetColor(r: number, aColor: TColor): TColor {
        const i: number = this.Race[r].Fleet;
        switch (i) {
            case 0: return FleetColor.clFleetMedal;
            case 1: return FleetColor.clFleetYellow;
            case 2: return FleetColor.clFleetBlue;
            case 3: return FleetColor.clFleetRed;
            case 4: return FleetColor.clFleetGreen;
            default: return aColor;
        }
    }

    private BibColor(aColor: TColor): TColor {
        if (this.EntryErrors.IsMember(TEntryError.error_Duplicate_Bib)) {
            return TColorRec.Aqua;
        } else if (this.EntryErrors.IsMember(TEntryError.error_OutOfRange_Bib)) {
            return TColorRec.Aqua;
        }
        return aColor;
    }

    private SNRColor(aColor: TColor): TColor {
        if (this.EntryErrors.IsMember(TEntryError.error_Duplicate_SNR)) {
            return TColorRec.Aqua;
        } else if (this.EntryErrors.IsMember(TEntryError.error_OutOfRange_SNR)) {
            return TColorRec.Aqua;
        }
        return aColor;
    }

    private RaceErrorColor(r: number, aColor: TColor): TColor {
        if (this.Race[r].FinishErrors.IsMember(TFinishError.error_Duplicate_OTime)) {
            return ColorConst.clHellRot;
        } else if (this.Race[r].FinishErrors.IsMember(TFinishError.error_Contiguous_OTime)) {
            return TColorRec.Aqua;
        } else if (this.Race[r].FinishErrors.IsMember(TFinishError.error_OutOfRange_OTime_Max)) {
            return TColorRec.Olive;
        } else if (this.Race[r].FinishErrors.IsMember(TFinishError.error_OutOfRange_OTime_Min)) {
            return TColorRec.Olive;
        }
        return aColor;
    }

    private RaceColor(NumID: number, aColor: TColor): TColor {
        let result: TColor = aColor;
        const r: number = TEventColProp.RaceIndex(NumID);
        if (r > 0) {
            if (!this.BO.GetIsRacing(r)) {
                result = ColorConst.clBtnFace;
            } else if (this.ru.ColorMode === TColorMode.ColorMode_Error) {
                result = this.RaceErrorColor(r, aColor);
            } else if (this.ru.ColorMode === TColorMode.ColorMode_Fleet) {
                result = this.FleetColor(r, aColor);
            }
        }
        return result;
    }

    getRaceValue(Index: number): string {
        if ((Index >= 0) && (Index < this.Race.length)) {
            return this.Race[Index].RaceValue;
        }
        return '';
    }
    setRaceValue(Index: number, value: string) {
        if ((Index >= 0) && (Index < this.Race.length)) {
            this.Race[Index].RaceValue = value;
        }
    }


    get RCount(): number {
        return this.Race.length;
    }
    get RaceCount(): number {
        return this.BO.BOParams.RaceCount;
    }

    get FN(): string {
        const sd: TStammdatenRowCollectionItem = this.GetSDItem();
        if (sd != null) {
            return sd.FN;
        }
        return '';
    }

    get LN(): string {
        const sd: TStammdatenRowCollectionItem = this.GetSDItem();
        if (sd != null) {
            return sd.LN;
        }
        return '';
    }

    get SN(): string {
        const sd: TStammdatenRowCollectionItem = this.GetSDItem();
        if (sd != null) {
            return sd.SN;
        }
        return '';
    }

    get NC(): string {
        const sd: TStammdatenRowCollectionItem = this.GetSDItem();
        if (sd != null) {
            return sd.NC;
        }
        return '';
    }

    get GR(): string {
        const sd: TStammdatenRowCollectionItem = this.GetSDItem();
        if (sd != null) {
            return sd.GR;
        }
        return '';
    }

    get PB(): string {
        const sd: TStammdatenRowCollectionItem = this.GetSDItem();
        if (sd != null) {
            return sd.PB;
        }
        return '';
    }

    get DN(): string {
        const sd: TStammdatenRowCollectionItem = this.GetSDItem();
        if (sd != null) {
            return sd.DN;
        }
        return '';
    }

    get Props(): TProps {
        const sd: TStammdatenRowCollectionItem = this.GetSDItem();
        if (sd != null) {
            return sd.Props;
        }
        return null;
    }

    get GPoints(): string { return this.Race[0].Points; }
    get GTime1(): number { return this.Race[0].CTime1; }
    get GRank(): number { return this.Race[0].Rank; }
    get GPosR(): number { return this.Race[0].PosR; }
    get PLZ(): number { return this.Race[0].PLZ; }
}


export class TEventColProp extends TBaseColProp<
    TEventColGrid,
    TEventBO,
    TEventNode,
    TEventRowCollection,
    TEventRowCollectionItem,
    TEventColProps,
    TEventColProp
    > {

    static readonly NidSNR = 1;
    static readonly NidBib = 2;
    static readonly NidGPoints = 3;
    static readonly NidGRank = 4;
    static readonly NmidGPosR = 5;
    static readonly NidPLZ = 6;
    static readonly NidCup = 7;

    static readonly NidDN = 10;
    static readonly NidNF1 = 11;
    static readonly NidNF2 = 12;
    static readonly NidNF3 = 13;
    static readonly NidNF4 = 14;
    static readonly NidNF5 = 15;
    static readonly NidNF6 = 16;

    static NumID_Race(index: number): number {
        return 10000 + index * 1000;
    }
    static RaceIndex(numID: number): number {
        return Math.round((numID - 10000) / 1000);
    }
    static IsRaceNumID(numID: number): boolean {
        return numID > 10000;
    }

    constructor(
        cl: TEventColProps,
        public BO: TBO,
    ) {
        super(cl);
    }

    public GetSortKeyRace(cr: TEventRowCollectionItem, value: string, ColName: string): string {
        let v = value;
        const i: number = TUtils.StrToIntDef(ColName.substring(5, ColName.length), -1);
        if (i > 0) { // && (i <= RaceCount)
            const ere: TEventRaceEntry = cr.Race[i];
            if (cr.Race[i].OTime > 0) {
                v = TUtils.IntToStr(ere.OTime + ere.Fleet * 2000);
            } else {
                v = TUtils.IntToStr(999 + cr.BaseID + ere.Fleet * 2000);
            }
        }
        return v;
    }

    public GetSortKeyPoints(cr: TEventRowCollectionItem, value: string, ColName: string): string {
        let v: string = value;
        if (cr.ru.ShowPoints === TEventNode.LayoutFinish) {
            v = this.GetSortKeyRace(cr, value, ColName);
        } else { // default: if (cr.ru.ShowPoints == TEventNode.Layout_Points)
            const i: number = TUtils.StrToIntDef(ColName.substring(5), -1);
            if (i > 0) { // && (i <= RaceCount)
                if (cr.Race[i].CTime > 0) {
                    v = TUtils.IntToStr(cr.Race[i].CTime);
                } else {
                    v = TUtils.IntToStr(99 + cr.BaseID);
                }
            }
        }
        return v;
    }

    public GetSortKeyGPosR(cr: TEventRowCollectionItem, value: string, ColName: string): string {
        return TUtils.IntToStr(cr.GPosR);
    }

    public GetFieldCaptionDef(cl: TStammdatenRowCollection, index: number, def: string): string {
        return (cl != null) ? cl.GetFieldCaption(index) : def;
    }

    public InitColsAvail(): void {
        const ColsAvail: TEventColProps = this.Collection;

        ColsAvail.UseCustomColCaptions = true;

        let cp: TEventColProp;
        const scl: TStammdatenRowCollection = this.BO.StammdatenNode.Collection;

        // SNR
        cp = ColsAvail.Add();
        cp.NameID = 'col_SNR';
        cp.Caption = 'SNR';
        cp.Width = 50;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taRightJustify;
        cp.NumID = TEventColProp.NidSNR;

        // Bib
        cp = ColsAvail.Add();
        cp.NameID = 'col_Bib';
        cp.Caption = 'Bib';
        cp.Width = 35;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taRightJustify;
        cp.NumID = TEventColProp.NidBib;

        // FN
        cp = ColsAvail.Add();
        cp.NameID = 'col_FN';
        cp.Caption = this.GetFieldCaptionDef(scl, 1, FieldNames.FN);
        cp.Width = 80;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taLeftJustify;
        cp.ColType = TColType.colTypeString;
        cp.NumID = TEventColProp.NidNF1;

        // LN
        cp = ColsAvail.Add();
        cp.NameID = 'col_LN';
        cp.Caption = this.GetFieldCaptionDef(scl, 2, FieldNames.LN);
        cp.Width = 80;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taLeftJustify;
        cp.ColType = TColType.colTypeString;
        cp.NumID = TEventColProp.NidNF2;

        // SN
        cp = ColsAvail.Add();
        cp.NameID = 'col_SN';
        cp.Caption = this.GetFieldCaptionDef(scl, 3, FieldNames.SN);
        cp.Width = 80;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taLeftJustify;
        cp.ColType = TColType.colTypeString;
        cp.NumID = TEventColProp.NidNF3;

        // NC
        cp = ColsAvail.Add();
        cp.NameID = 'col_NC';
        cp.Caption = this.GetFieldCaptionDef(scl, 4, FieldNames.NC);
        cp.Width = 70;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taLeftJustify;
        cp.ColType = TColType.colTypeString;
        cp.NumID = TEventColProp.NidNF4;

        // GR
        cp = ColsAvail.Add();
        cp.NameID = 'col_GR';
        cp.Caption = this.GetFieldCaptionDef(scl, 5, FieldNames.GR);
        cp.Width = 80;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taLeftJustify;
        cp.ColType = TColType.colTypeString;
        cp.NumID = TEventColProp.NidNF5;

        // PB
        cp = ColsAvail.Add();
        cp.NameID = 'col_PB';
        cp.Caption = this.GetFieldCaptionDef(scl, 6, FieldNames.PB);
        cp.Width = 80;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taLeftJustify;
        cp.ColType = TColType.colTypeString;
        cp.NumID = TEventColProp.NidNF6;

        // DN
        cp = ColsAvail.Add();
        cp.NameID = 'col_DN';
        cp.Caption = 'DN';
        cp.Width = 180;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taLeftJustify;
        cp.ColType = TColType.colTypeString;
        cp.NumID = TEventColProp.NidDN;

        // Race[0] wird nicht angezeigt, nur Race[1]..Race[RCount-1]
        // bzw. Race[1]..Race[RaceCount]
        const rc: number = this.BO.BOParams.RaceCount;
        for (let i = 1; i <= rc; i++) {
            // Ri
            cp = ColsAvail.Add();
            cp.NameID = 'col_R' + i.toString();
            cp.Caption = 'R' + i.toString();
            cp.Width = 60;
            cp.Sortable = true;
            cp.Alignment = TColAlignment.taRightJustify;
            cp.ColType = TColType.colTypeRank;
            cp.OnGetSortKey2 = this.GetSortKeyPoints;
            cp.NumID = TEventColProp.NumID_Race(i) + 1; // 10000 + i * 1000 + 1;
        }

        // GPoints
        cp = ColsAvail.Add();
        cp.NameID = 'col_GPoints';
        cp.Caption = 'Pts'; // 'GPoints';
        cp.Width = 50;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taRightJustify;
        cp.ColType = TColType.colTypeRank;
        cp.OnGetSortKey2 = this.GetSortKeyGPosR;
        cp.NumID = TEventColProp.NidGPoints;

        // GRank
        cp = ColsAvail.Add();
        cp.NameID = 'col_GRank';
        cp.Caption = 'Rk'; // 'GRank';
        cp.Width = 50;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taRightJustify;
        cp.ColType = TColType.colTypeRank;
        cp.NumID = TEventColProp.NidGRank;

        // GPosR
        cp = ColsAvail.Add();
        cp.NameID = 'col_GPosR';
        cp.Caption = 'uP'; // 'GPosR';
        cp.Width = 50;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taRightJustify;
        cp.ColType = TColType.colTypeRank;
        cp.NumID = TEventColProp.NmidGPosR;

        // PLZ
        cp = ColsAvail.Add();
        cp.NameID = 'col_PLZ';
        cp.Caption = 'PLZ';
        cp.Width = 30;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taRightJustify;
        cp.ColType = TColType.colTypeRank;
        cp.NumID = TEventColProp.NidPLZ;

        // Cup
        cp = ColsAvail.Add();
        cp.NameID = 'col_Cup';
        cp.Caption = 'Cup';
        cp.Width = 45;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taRightJustify;
        cp.ColType = TColType.colTypeRank;
        cp.NumID = TEventColProp.NidCup;

    }

    public GetTextDefault(cr: TEventRowCollectionItem, value: string): string {
        let v = super.GetTextDefault(cr, value);

        if (this.NumID === TEventColProp.NidSNR) {
            v = cr.SNR.toString();
        } else if (this.NumID === TEventColProp.NidBib) {
            v = cr.Bib.toString();
        } else if (this.NumID === TEventColProp.NidDN) {
            v = cr.DN;
        } else if (this.NumID === TEventColProp.NidNF4) {
            v = cr.NC;
        } else if (this.NumID === TEventColProp.NidGPoints) {
            v = cr.GPoints;
        } else if (this.NumID === TEventColProp.NidGRank) {
            v = cr.GRank.toString();
        } else if (this.NumID === TEventColProp.NmidGPosR) {
            v = cr.GPosR.toString();
        } else if (this.NumID === TEventColProp.NidPLZ) {
            v = TUtils.IntToStr(cr.PLZ + 1);
        } else if (this.NumID === TEventColProp.NidCup) {
            v = cr.RA.toFixed(2);
        } else if (TEventColProp.IsRaceNumID(this.NumID)) {
            // Race[0] wird nicht angezeigt
            const i: number = TEventColProp.RaceIndex(this.NumID);
            v = cr.Race[i].RaceValue;
        } else if (this.NumID === TEventColProp.NidNF1) {
            v = cr.FN;
        } else if (this.NumID === TEventColProp.NidNF2) {
            v = cr.LN;
        } else if (this.NumID === TEventColProp.NidNF3) {
            v = cr.SN;
        } else if (this.NumID === TEventColProp.NidNF5) {
            v = cr.GR;
        } else if (this.NumID === TEventColProp.NidNF6) {
            v = cr.PB;
        }
        return v;
    }

    IsGroupCol(): boolean {
        if (this.BO.EventNode.UseFleets) {
            if (this.BO.EventNode.ColorMode === TColorMode.ColorMode_Error) {
                if (TEventColProp.IsRaceNumID(this.NumID)) {
                    return true;
                }
            }
        }
        return false;
    }

}

export class TEventRowCollection extends TBaseRowCollection<
    TEventColGrid,
    TEventBO,
    TEventNode,
    TEventRowCollection,
    TEventRowCollectionItem,
    TEventColProps,
    TEventColProp
    > {
    constructor(
        Node: TEventNode,
        BO: TBO,
    ) {
        super(Node, BO);
    }

    NewItem(): TEventRowCollectionItem {
        const cr = new TEventRowCollectionItem(this, this.BO);
        this.InitNewItemID(cr);
        return cr;
    }

    GetHashString(): string {
        const sb: StringBuilder = new StringBuilder('');
        let cr: TEventRowCollectionItem;
        for (let i = 0; i < this.Count; i++) {
            cr = this.Items[i];
            if (i === 0) {
                sb.AppendNumber(cr.GRank);
            } else {
                sb.AppendString('-');
                sb.AppendNumber(cr.GRank);
            }
        }
        return sb.toString();
    }

    FindKey(SNR: number): TEventRowCollectionItem {
        for (let i = 0; i < this.Count; i++) {
            const o: TEventRowCollectionItem = this.Items[i];
            if (o && o.SNR === SNR) {
                return o;
            }
        }
        return null;
    }

    get RCount(): number {
        if (this.Count > 0) {
            return this.GetItem(0).RCount;
        } else if (this.Node) {
            return this.Node.RaceCount + 1;
        } else {
            return -1;
        }
    }

    FleetCount(r: number): number {
        let temp: number;
        let fc = 0;
        for (let i = 0; i < this.Count; i++) {
            temp = this.Items[i].Race[r].Fleet;
            if (temp > fc) {
                fc = temp;
            }
        }
        return fc;
    }

    FillFleetList(FL: Array<TEventRowCollectionItem>, r: number, f: number): void {
        FL.length = 0;
        if (r > 0 && r < this.RCount) {
            let cr: TEventRowCollectionItem;
            for (let i = 0; i < this.Count; i++) {
                cr = this.Items[i];
                if (cr.Race[r].Fleet === f) {
                    FL.push(cr);
                }
            }
        }
    }

    ResetRace(r: number) {
        let cr: TEventRowCollectionItem;
        let f: number;
        let ere: TEventRaceEntry;

        if (r > 0 && r < this.RCount) {
            for (let i = 0; i < this.Count; i++) {
                cr = this.Items[i];
                ere = cr.Race[r];
                f = ere.Fleet;
                ere.Clear();
                ere.Fleet = f;
            }
            this.Node.Modified = true;
        }
    }

}

export class TEventNode extends TBaseNode<
    TEventColGrid,
    TEventBO,
    TEventNode,
    TEventRowCollection,
    TEventRowCollectionItem,
    TEventColProps,
    TEventColProp
    > {
    static readonly LayoutPoints = 0;
    static readonly LayoutFinish = 1;

    private FOnCalc: TNotifyEvent = null;
    private FShowPoints = 1;
    ShowPLZColumn = false;
    ShowPosRColumn = true;
    UseFleets = false;
    TargetFleetSize = 8;
    PartialCalcLastRace = 0;
    private FFirstFinalRace = 20;

    ColorMode: TColorMode = TColorMode.ColorMode_Error;

    StammdatenRowCollection: TStammdatenRowCollection;
    ErrorList: TOTimeErrorList;
    WebLayout: number = 0;

    constructor(
        ColBO: TEventBO,
        BO: TBO,
    ) {
        super(
            ColBO,
            BO,
        );
        this.ErrorList = new TOTimeErrorList(this.BO);
    }

    NewCol(): TEventRowCollection {
        return new TEventRowCollection(this, this.BO);
    }

    Load(): void {
        let o: TEventRowCollectionItem;
        this.Collection.Clear();

        o = this.Collection.Add();
        o.SNR = 1001;
        o.Bib = 1;

        o = this.Collection.Add();
        o.SNR = 1002;
        o.Bib = 2;

        o = this.Collection.Add();
        o.SNR = 1003;
        o.Bib = 3;
    }

    Init(RowCount: number): void {
        let o: TEventRowCollectionItem;
        this.Collection.Clear();

        for (let i = 0; i < RowCount; i++) {
            o = this.Collection.Add();
            o.SNR = 1001 + i;
            o.Bib = 1 + i;
        }
    }

    ClearRace(r: number): void {
        if (r >= 1 && r < this.RCount) {
            let ere: TEventRaceEntry;
            let f: number;
            this.Collection.forEach((cr: TEventRowCollectionItem) => {
                ere = cr.Race[r];
                f = ere.Fleet;
                ere.Clear();
                ere.Fleet = f;
            });
            this.Modified = true;
        }
    }

    CopyFleet(r: number): void {
        this.UseFleets = true;
        this.Collection.forEach((cr: TEventRowCollectionItem) => {
            if (r > 1 && r < this.RCount) {
                cr.Race[r].Fleet = cr.Race[r - 1].Fleet;
            }
        });
    }

    DisableFleet(r: number, f: number, b: boolean): void {
        if (r > 0 && r < this.RCount && this.UseFleets) {
            this.Collection.forEach((cr: TEventRowCollectionItem) => {
                if (cr.Race[r].Fleet === f) {
                    cr.Race[r].IsRacing = b;
                }
            });
        }
    }

    IsFinalRace(r: number): boolean {
        return (this.FirstFinalRace > 0 && r >= this.FirstFinalRace);
    }

    get FirstFinalRace(): number {
        if (this.FFirstFinalRace === 0) {
            return this.RCount;
        }
        return this.FFirstFinalRace;
    }
    set FirstFinalRace(value: number) {
        this.FFirstFinalRace = value;
    }


    FleetMaxProposed(r: number): number {
        let fc = 0;
        if (r > 0 && r < this.RCount && this.TargetFleetSize > 0) {
            const cl: TEventRowCollection = this.Collection;
            fc = cl.Count / this.TargetFleetSize; // cl.Count div TargetFleetSize;
            if (this.TargetFleetSize > 0 && cl.Count > 0) {
                while (this.TargetFleetSize * fc < cl.Count) {
                    fc++;
                }
            }
        }
        return fc;
    }

    FleetMax(r: number): number {
        let result = 0;
        if (r > 0 && r < this.RCount) {
            this.Collection.forEach((cr: TEventRowCollectionItem) => {
                if (cr.Race[r].Fleet > result) {
                    result = cr.Race[r].Fleet;
                }
            });
        }
        return result;
    }

    FillFleetList(r: number, f: number, L: Array<TEventRowCollectionItem>): number {
        const result = 0;
        if (r > 0 && r < this.RCount) {
            this.Collection.forEach((cr: TEventRowCollectionItem) => {
                if (cr.Race[r].Fleet === f) {
                    L.push(cr);
                }
            });
        }
        return result;
    }

    PartialCalc(r: number): void {
        this.PartialCalcLastRace = r;
        this.BO.CalcEV.Calc(this);
        this.Modified = false;
        if (this.OnCalc != null) {
            this.OnCalc(this);
        }
        this.ErrorList.CheckAll(this);
        this.PartialCalcLastRace = 0;
    }

    InitFleet(r: number): void {
        this.UseFleets = true;

        const fc = this.FleetMaxProposed(r);
        let f: number;
        let c: number;
        let upPhase: boolean;

        const cl: TEventRowCollection = this.Collection;
        let cr: TEventRowCollectionItem;
        for (let i = 0; i < cl.Count; i++) {
            cr = cl.Items[i];
            c = i % fc;

            // upPhase = not Odd(i div fc);
            upPhase = ((i / fc) % 2) >= 0;

            if (upPhase) {
                f = c + 1;
            } else {
                f = fc - c;
            }

            if (r === 1) {
                cr.Race[r].Fleet = f;
            } else if (r > 1 && r < this.RCount) {
                cr = cl.Items[cr.PLZ];
                cr.Race[r].Fleet = f;
            }
        }
    }

    InitFleetByFinishHack(r: number): void {
        let cl: TEventRowCollection;
        let cr: TEventRowCollectionItem;
        let ere: TEventRaceEntry;

        const fc: number = this.FleetMaxProposed(r);
        if (r > 0 && r < this.RCount && this.TargetFleetSize > 0 && fc > 0) {
            this.UseFleets = true;
            cl = this.Collection;
            // clear fleet assignment
            for (let j1 = 0; j1 < cl.Count; j1++) {
                cr = cl.Items[j1];
                ere = cr.Race[r];
                ere.Fleet = 0;
            }
            // generate new from existing finish position info
            // Fleet f, FinishPosition fp
            let f;
            for (let fp = 1; fp <= this.TargetFleetSize; fp++) {
                f = 1;
                for (let j2 = 0; j2 < cl.Count; j2++) {
                    cr = cl.Items[j2];
                    ere = cr.Race[r];
                    if (ere.OTime === fp && ere.Fleet === 0) {
                        ere.Fleet = f;
                        f++;
                    }
                    if (f === fc + 2) {
                        break;
                    }
                }
            }
        }
    }

    Calc(): void {
        this.BO.CalcEV.Calc(this);
        this.Modified = false;
        this.ErrorList.CheckAll(this);
        if (this.OnCalc != null) {
            this.OnCalc(this);
        }
    }

    FindBib(b: number): TEventRowCollectionItem {
        let cr: TEventRowCollectionItem;
        for (let i = 0; i < this.Collection.Count; i++) {
            cr = this.Collection.Items[i];
            if (cr.Bib === b) {
                return cr;
            }
        }
        return null;
    }

    FindSNR(b: number): TEventRowCollectionItem {
        let cr: TEventRowCollectionItem;
        for (let i = 0; i < this.Collection.Count; i++) {
            cr = this.Collection.Items[i];
            if (cr.SNR === b) {
                return cr;
            }
        }
        return null;
    }

    get OnCalc(): TNotifyEvent {
        return this.FOnCalc;
    }

    set OnCalc(value: TNotifyEvent) {
        this.FOnCalc = value;
    }

    get ShowPoints(): number {
        if (this.WebLayout > 0) {
            return this.WebLayout;
        }
        return this.FShowPoints;
    }
    set ShowPoints(value: number) {
        this.FShowPoints = value;
    }


    /** RCount = RaceCount + 1 */
    get RCount(): number {
        return this.RaceCount + 1;
    }

    get RaceCount(): number {
        if (this.BO != null) {
            return this.BO.BOParams.RaceCount;
        }
        return -1;
    }

}


