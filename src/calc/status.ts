export enum TStatusEnum {
    csOK,
    csDNS,
    csDNF,
    csDSQ,
    csDSQPending
}

export class TStatusStrings {

    getString(status: TStatusEnum): string {
        switch (status) {
            case TStatusEnum.csOK: return "ok";
            case TStatusEnum.csDNS: return "dns";
            case TStatusEnum.csDNF: return "dnf";
            case TStatusEnum.csDSQ: return "dsq";
            case TStatusEnum.csDSQPending: return "*";
        }
        return "";
    }
}

export class StatusConst {
    static Status_OK = 0;
    static Status_DNS = 1;
    static Status_DNF = 2;
    static Status_DSQ = 3;
    static Status_DSQPending = 4;

    static StatusStrings: TStatusStrings = new TStatusStrings();

    static crsNone = 0;
    static crsStarted = 1;
    static crsResults = 2;
}

export interface TPenalty {
    GetIsDSQPending(): boolean;
    GetIsOK(): boolean;
    GetIsOut(): boolean;
    SetIsDSQPending(value: boolean): void;
    GetAsInteger(): number;
    SetAsInteger(value: number): void;

    Clear(): void;
    Parse(value: string): boolean;
    // FromString(value: string): boolean;
}

export class TStatus implements TPenalty {
    Status: TStatusEnum = TStatusEnum.csOK;

    GetIsDSQPending(): boolean {
        return (this.Status === TStatusEnum.csDSQPending);
    }
    GetIsOK(): boolean {
        return (this.Status === TStatusEnum.csOK) || (this.Status === TStatusEnum.csDSQPending);
    }
    GetIsOut(): boolean {
        return (this.Status === TStatusEnum.csDSQ) || (this.Status === TStatusEnum.csDNF) || (this.Status === TStatusEnum.csDNS);
    }
    SetIsDSQPending(value: boolean): void {
        if (value)
            this.Status = TStatusEnum.csDSQPending;
        else
            this.Status = TStatusEnum.csOK;
    }
    GetAsInteger(): number {
        switch (this.Status) {
            case TStatusEnum.csOK: return StatusConst.Status_OK;
            case TStatusEnum.csDSQ: return StatusConst.Status_DSQ;
            case TStatusEnum.csDNF: return StatusConst.Status_DNF;
            case TStatusEnum.csDNS: return StatusConst.Status_DNS;
            case TStatusEnum.csDSQPending: return StatusConst.Status_DSQPending;
            default: return StatusConst.Status_OK;
        }
    }
    SetAsInteger(value: number): void {
        switch (value) {
            case StatusConst.Status_OK:
                this.Status = TStatusEnum.csOK;
                break;
            case StatusConst.Status_DSQ:
                this.Status = TStatusEnum.csDSQ;
                break;
            case StatusConst.Status_DNF:
                this.Status = TStatusEnum.csDNF;
                break;
            case StatusConst.Status_DNS:
                this.Status = TStatusEnum.csDNS;
                break;
            case StatusConst.Status_DSQPending:
                this.Status = TStatusEnum.csDSQPending;
                break;
            default:
                this.Status = TStatusEnum.csOK;
                break;
        }
    }

    Assign(source: object): void {
        if (source instanceof TStatus) {
            const o: TStatus = source as TStatus;
            this.Status = o.AsEnum;
        }
    }

    Clear(): void {
        this.Status = TStatusEnum.csOK;
    }

    Parse(value: string): boolean {
        const temp: string = value.toLowerCase();
        let result = true;
        if (temp === "dsq")
            this.Status = TStatusEnum.csDSQ;
        else if (temp === "dns")
            this.Status = TStatusEnum.csDNS;
        else if (temp === "dnf")
            this.Status = TStatusEnum.csDNF;
        else if (temp === "ok")
            this.Status = TStatusEnum.csOK;
        else if (temp === "*")
            this.Status = TStatusEnum.csDSQPending;
        else
            result = false;
        return result;
    }

    toString(): string {
        return StatusConst.StatusStrings.getString(this.Status);
    }

    CompareStatus(A: TStatus, B: TStatus, GateA: number, GateB: number): number {
        // beide gleich:
        if (A.Status === B.Status) {
            if (
                ((A.Status === TStatusEnum.csDNF) && (B.Status === TStatusEnum.csDNF))
                || ((A.Status === TStatusEnum.csDSQ) && (B.Status === TStatusEnum.csDSQ))
            ) {
                if (GateA > GateB)
                    return 1;
                else if (GateB > GateA)
                    return 2;
            }
            else
                return 0;
        }

        // beide ok, niemand besser:
        else if (A.IsOK && B.IsOK)
            return 0;

        // A ok, B out:
        else if (A.IsOK && B.IsOut)
            return 1;

        // A out, B ok:
        else if (A.IsOut && B.IsOK)
            return 2;

        // beide Out aber nicht gleich:
        else // if (A.IsOut && B.IsOut)
        {
            if (A.Status === TStatusEnum.csDNF)
                return 1;
            else if (B.Status === TStatusEnum.csDNF)
                return 2;
            else if (A.Status === TStatusEnum.csDSQ)
                return 1;
            else if (B.Status === TStatusEnum.csDSQ)
                return 2;
            // else //if ((A.Status == csDNS) && (B.Status == cdDNS))
            // return 0;
        }
        return 0;
    }

    get IsOK(): boolean {
        return this.GetIsOK();
    }

    get IsOut(): boolean {
        return this.GetIsOut();
    }

    IsBetter(Partner: TStatus): boolean {
        return this.CompareStatus(this, Partner, 0, 0) === 1;
    }
    IsBetter2(Partner: TStatus, GateA: number, GateB: number): boolean {
        return this.CompareStatus(this, Partner, GateA, GateB) === 1;
    }
    IsEqual(Partner: TStatus, GateA: number, GateB: number): boolean {
        return this.CompareStatus(this, Partner, GateA, GateB) === 0;
    }
    IsWorse(Partner: TStatus): boolean {
        return this.CompareStatus(this, Partner, 0, 0) === 2;
    }
    IsWorse2(Partner: TStatus, GateA: number, GateB: number): boolean {
        return this.CompareStatus(this, Partner, GateA, GateB) === 2;
    }
    get AsEnum(): TStatusEnum {
        return this.Status;
    }
    set AsEnum(value: TStatusEnum) {
        this.Status = value;
    }
}


