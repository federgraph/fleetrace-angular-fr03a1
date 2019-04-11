import { 
    TBaseColProps, 
    TColGrid, 
    TBaseRowCollectionItem, 
    TBaseRowCollection, 
    TBaseColProp, 
    TBaseNode, 
    TBaseColBO } from "../../grid/col-grid";
    
import { TColAlignment } from "../../grid/grid-def";
import { TUtils } from "../../util/fb-classes";
import { TSimpleHashGrid } from "../../grid/grid-cells";

export enum NameValueFieldType {
    FTInteger,
    FTString,
    FTBoolean
}

export class TNameValueColProps extends TBaseColProps<
    TNameValueColGrid,
    TNameValueBO,
    TNameValueNode,
    TNameValueRowCollection,
    TNameValueRowCollectionItem,
    TNameValueColProps,
    TNameValueColProp> {
    constructor() {
        super(null);
    }

    NewItem(): TNameValueColProp {
        return new TNameValueColProp(this);
    }

}

export class TNameValueColGrid extends TColGrid<
    TNameValueColGrid,
    TNameValueBO,
    TNameValueNode,
    TNameValueRowCollection,
    TNameValueRowCollectionItem,
    TNameValueColProps,
    TNameValueColProp
    >
{
    constructor() {
        super(null);
    }

    NewColAvail(): TNameValueColProps {
        return new TNameValueColProps();
    }
    NewColBO(): TNameValueBO {
        return new TNameValueBO();
    }
    SetupGrid() {
        this.Grid.SetupGrid(this);
    }
    
}

export class TSimpleNameValueGrid extends TSimpleHashGrid<
    TNameValueColGrid,
    TNameValueBO,
    TNameValueNode,
    TNameValueRowCollection,
    TNameValueRowCollectionItem,
    TNameValueColProps,
    TNameValueColProp> {
}

export class TNameValueNode extends TBaseNode<
    TNameValueColGrid,
    TNameValueBO,
    TNameValueNode,
    TNameValueRowCollection,
    TNameValueRowCollectionItem,
    TNameValueColProps,
    TNameValueColProp> {

    constructor(public ColBO: TNameValueBO) {
        super(
            ColBO,
            null
        );
    }

    NewCol(): TNameValueRowCollection {
        return new TNameValueRowCollection(this);
    }
}

export class TNameValueRowCollectionItem extends TBaseRowCollectionItem<
    TNameValueColGrid,
    TNameValueBO,
    TNameValueNode,
    TNameValueRowCollection,
    TNameValueRowCollectionItem,
    TNameValueColProps,
    TNameValueColProp
    >
{
    FieldName: string = "";
    FieldValue: string = "";
    FieldType: NameValueFieldType = NameValueFieldType.FTBoolean;
    Caption: string = "";
    Description: string = "";
    Category: string = "";

    constructor(cl: TNameValueRowCollection) {
        super(cl, null);
    }

    GetIndex(): number {
        return this.Collection.Items.indexOf(this);
    }
    
    Assign(o: TNameValueRowCollectionItem): void {
        if (o) {
            this.FieldName = o.FieldName;
            this.FieldValue = o.FieldValue;
            this.FieldType = o.FieldType;
            this.Description = o.Description;
            this.Category = o.Category;
            this.Caption = o.Caption;
        }
    }

    get FieldTypeString(): string {
        return TNameValueColProp.FieldTypeStrings(this.FieldType);
    }

}


export class TNameValueRowCollection extends TBaseRowCollection<
    TNameValueColGrid,
    TNameValueBO,
    TNameValueNode,
    TNameValueRowCollection,
    TNameValueRowCollectionItem,
    TNameValueColProps,
    TNameValueColProp
    >
{

    constructor(n: TNameValueNode) {
        super(n, null);
    }

    NewItem(): TNameValueRowCollectionItem {
        return new TNameValueRowCollectionItem(this);
    }

    FindKey(Bib: number): TNameValueRowCollectionItem {
        for (let i = 0; i < this.Count; i++) {
            const o: TNameValueRowCollectionItem = this.Items[i];
            if (o != null && o.BaseID === Bib)
                return o;
        }
        return null;
    }

}

export class TNameValueColProp extends TBaseColProp<
    TNameValueColGrid,
    TNameValueBO,
    TNameValueNode,
    TNameValueRowCollection,
    TNameValueRowCollectionItem,
    TNameValueColProps,
    TNameValueColProp
    >
{

    static NumID_FieldName = 1;
    static NumID_FieldValue = 2;
    static NumID_FieldType = 3;
    static NumID_Caption = 4;
    static NumID_Description = 5;
    static NumID_Category = 6;
    static NumID_FieldTypeString = 7;

    constructor(cl: TNameValueColProps) {
        super(cl);
    }

    static FieldTypeStrings(o: NameValueFieldType): string {
        switch (o) {
            case NameValueFieldType.FTBoolean: return "bool";
            case NameValueFieldType.FTInteger: return "int";
            case NameValueFieldType.FTString: return "string";
        }
        return "";
    }

    InitColsAvail(): void {
        const ColsAvail: TNameValueColProps = this.Collection;

        let cp: TNameValueColProp;

        // FieldName
        cp = ColsAvail.Add();
        cp.NameID = "col_FieldName";
        cp.Caption = "Name";
        cp.Width = 100;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taLeftJustify;
        cp.NumID = TNameValueColProp.NumID_FieldName;

        // FieldValue
        cp = ColsAvail.Add();
        cp.NameID = "col_FieldValue";
        cp.Caption = "Value";
        cp.Width = 80;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taLeftJustify;
        cp.NumID = TNameValueColProp.NumID_FieldValue;

        // FieldType
        cp = ColsAvail.Add();
        cp.NameID = "col_FieldType";
        cp.Caption = "Type";
        cp.Width = 40;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taLeftJustify;
        cp.NumID = TNameValueColProp.NumID_FieldType;

        // Caption
        cp = ColsAvail.Add();
        cp.NameID = "col_Caption";
        cp.Caption = "Caption";
        cp.Width = 120;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taLeftJustify;
        cp.NumID = TNameValueColProp.NumID_Caption;

        // Description
        cp = ColsAvail.Add();
        cp.NameID = "col_Description";
        cp.Caption = "Description";
        cp.Width = 260;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taLeftJustify;
        cp.NumID = TNameValueColProp.NumID_Description;

        // Category
        cp = ColsAvail.Add();
        cp.NameID = "col_Category";
        cp.Caption = "Category";
        cp.Width = 60;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taLeftJustify;
        cp.Descending = true;
        cp.NumID = TNameValueColProp.NumID_Category;

        // FieldTypeString
        cp = ColsAvail.Add();
        cp.NameID = "col_FieldTypeString";
        cp.Caption = "Type";
        cp.Width = 40;
        cp.Sortable = true;
        cp.Alignment = TColAlignment.taLeftJustify;
        cp.NumID = TNameValueColProp.NumID_FieldTypeString;

    }

    GetTextDefault(cr: TNameValueRowCollectionItem, value: string): string {
        let v = super.GetTextDefault(cr, value);

        if (this.NumID === TNameValueColProp.NumID_FieldName)
            v = cr.FieldName;

        else if (this.NumID === TNameValueColProp.NumID_FieldValue)
            v = cr.FieldValue;

        // this column is only shown correctly if used with an editable DataSet
        else if (this.NumID === TNameValueColProp.NumID_FieldType)
            v = TNameValueColProp.FieldTypeStrings(cr.FieldType);

        // this column can be shown correctly when using a readonly SortedView
        else if (this.NumID === TNameValueColProp.NumID_FieldTypeString)
            v = cr.FieldTypeString;

        else if (this.NumID === TNameValueColProp.NumID_Caption)
            v = cr.Caption;
        else if (this.NumID === TNameValueColProp.NumID_Description)
            v = cr.Description;
        else if (this.NumID === TNameValueColProp.NumID_Category)
            v = cr.Category;
        return v;
    }

}

export class TNameValueBO extends TBaseColBO<
    TNameValueColGrid,
    TNameValueBO,
    TNameValueNode,
    TNameValueRowCollection,
    TNameValueRowCollectionItem,
    TNameValueColProps,
    TNameValueColProp> {

    constructor() {
        super();
    }

    InitColsActive(g: TNameValueColGrid): void {
        this.InitColsActiveLayout(g, 0);
    }

    InitColsActiveLayout(g: TNameValueColGrid, aLayout: number): void {
        let cp: TNameValueColProp;

        g.ColsActive.Clear();
        g.AddColumn("col_BaseID");

        // g.AddColumn("col_FieldName");
        // g.AddColumn("col_FieldType");
        g.AddColumn("col_FieldTypeString");
        g.AddColumn("col_Caption");

        cp = g.AddColumn("col_FieldValue");
        cp.OnFinishEdit = this.EditValue;
        cp.ReadOnly = false;

        g.AddColumn("col_Description");
        g.AddColumn("col_Category");
    }

    EditValue(cr: TNameValueRowCollectionItem, value: string): string {
        let v = value;
        switch (cr.FieldType) {
            case NameValueFieldType.FTInteger: v = this.CheckInteger(cr.FieldValue, value); break;
            case NameValueFieldType.FTBoolean: v = this.CheckBoolean(value); break;
            case NameValueFieldType.FTString: v = this.CheckString(cr.FieldValue, value); break;
        }
        cr.FieldValue = v;
        return v;
    }

    private CheckInteger(OldValue: string, value: string): string {
        let i: number;
        i = TUtils.StrToIntDef(OldValue, 0);
        i = TUtils.StrToIntDef(value, i);
        return i.toString();
    }

    private CheckBoolean(value: string): string {
        const b: boolean = TUtils.IsTrue(value);
        return TUtils.BoolStr(b);
    }

    private CheckString(oldValue: string, value: string): string {
        if (value.length < 20)
            return value;
        else
            return oldValue;
    }

}


