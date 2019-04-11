export class FieldNames {
    // NameSchema_N0
    static readonly N0_FN = "FN";
    static readonly N0_LN = "LN";
    static readonly N0_SN = "SN";
    static readonly N0_NC = "NC";
    static readonly N0_GR = "GR";
    static readonly N0_PB = "PB";

    // NameSchema_N1
    static readonly N1_FN = "FirstName";
    static readonly N1_LN = "LastName";
    static readonly N1_SN = "ShortName";
    static readonly N1_NC = "NOC";
    static readonly N1_GR = "Gender";
    static readonly N1_PB = "PersonalBest";

    // NameSchema_N2
    static readonly N2_FN = "N1";
    static readonly N2_LN = "N2";
    static readonly N2_SN = "N3";
    static readonly N2_NC = "N4";
    static readonly N2_GR = "N5";
    static readonly N2_PB = "N6";

    // actual mapping
    public static FN = FieldNames.N0_FN;
    public static LN = FieldNames.N0_LN;
    public static SN = FieldNames.N0_SN;
    public static NC = FieldNames.N0_NC;
    public static GR = FieldNames.N0_GR;
    public static PB = FieldNames.N0_PB;

    public static nameSchema = 0;

    static FieldNames() {
        FieldNames.setSchemaCode(0);
    }

    static getSchemaCode() {
        return FieldNames.nameSchema;
    }

    static setSchemaCode(value: number) {
        switch (value) {
            case 0:
                FieldNames.nameSchema = 0;
                this.FN = FieldNames.N0_FN;
                this.LN = FieldNames.N0_LN;
                this.SN = FieldNames.N0_SN;
                this.NC = FieldNames.N0_NC;
                this.GR = FieldNames.N0_GR;
                this.PB = FieldNames.N0_PB;
                break;
            case 1:
                FieldNames.nameSchema = 1;
                this.FN = FieldNames.N1_FN;
                this.LN = FieldNames.N1_LN;
                this.SN = FieldNames.N1_SN;
                this.NC = FieldNames.N1_NC;
                this.GR = FieldNames.N1_GR;
                this.PB = FieldNames.N1_PB;
                break;
            case 2:
                FieldNames.nameSchema = 2;
                this.FN = FieldNames.N2_FN;
                this.LN = FieldNames.N2_LN;
                this.SN = FieldNames.N2_SN;
                this.NC = FieldNames.N2_NC;
                this.GR = FieldNames.N2_GR;
                this.PB = FieldNames.N2_PB;
                break;
        }
    }


    static GetStandardFieldCaption(index: number, NameSchema: number): string {
        let result = "";

        if (index === 0)
            result = "SNR";

        switch (NameSchema) {
            case 0:
                switch (index) {
                    case 1: result = FieldNames.N0_FN; break;
                    case 2: result = FieldNames.N0_LN; break;
                    case 3: result = FieldNames.N0_SN; break;
                    case 4: result = FieldNames.N0_NC; break;
                    case 5: result = FieldNames.N0_GR; break;
                    case 6: result = FieldNames.N0_PB; break;
                }
                break;

            case 1:
                switch (index) {
                    case 1: result = FieldNames.N1_FN; break;
                    case 2: result = FieldNames.N1_LN; break;
                    case 3: result = FieldNames.N1_SN; break;
                    case 4: result = FieldNames.N1_NC; break;
                    case 5: result = FieldNames.N1_GR; break;
                    case 6: result = FieldNames.N1_PB; break;
                }
                break;

            case 2:
                switch (index) {
                    case 1: result = FieldNames.N2_FN; break;
                    case 2: result = FieldNames.N2_LN; break;
                    case 3: result = FieldNames.N2_SN; break;
                    case 4: result = FieldNames.N2_NC; break;
                    case 5: result = FieldNames.N2_GR; break;
                    case 6: result = FieldNames.N2_PB; break;
                }
                break;
        }

        if (result === "")
            result = "N" + index.toString();
        return result;
    }

}


