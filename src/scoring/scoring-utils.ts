export class TScoringUtils {
 
    static BoolStr(value: boolean): string {
        return value ? "True" : "False";
    }

    static IsTrue(value: string) {
        let result = false;
        const s = value.toUpperCase();
        if ((s === "TRUE") || (s === "T"))
            result = true;
        return result;
    }

    static equals(left: object, right: object): boolean {
        return left === right;
    }
    
    static toStringF2(n: number): string {
        return "not implemented";
    }
    
    static StrToIntDef(s: string, d: number): number {
        const n = Number.parseInt(s, 10);
        if (n === Number.NaN)
            return d;

        return n;
    }

}
