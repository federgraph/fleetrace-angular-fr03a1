export class MsgContext {
    static SwitchLocked = false;
    static BridgeLocked = false;
    static SwitchSender: object = null;

    protected FMsgIn: string = "";
    MsgInCount: number = 0;
    protected FMsgOut: string = "";
    MsgOutCount: number = 0;
    protected MsgOffset: number = 0;

    constructor() {
    }

    Clear(): void {
        this.FMsgIn = "";
        this.MsgInCount = 0;
        this.FMsgOut = "";
        this.MsgOutCount = 0;
    }

    Update(LabelID: number): void {
    }

    get MsgIn(): string {
        return this.FMsgIn;
    }
    set MsgIn(value: string) {
        this.FMsgIn = value;
        this.MsgInCount++;
        if (this.MsgInCount === -1)
            this.MsgInCount = 1;
        this.Update(this.MsgOffset + 3);
    }


    get MsgOut(): string {
        return this.FMsgOut;
    }
    set MsgOut(value: string) {
        this.FMsgOut = value;
        this.MsgOutCount++;
        if (this.MsgOutCount === -1)
            this.MsgOutCount = 1;
        this.Update(this.MsgOffset + 5);
    }

}
