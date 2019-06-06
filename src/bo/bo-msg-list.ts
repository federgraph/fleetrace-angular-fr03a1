import { TStringList } from '../util/fb-strings';
import { TBaseMsg } from './bo-msg-base';
import { TBO } from '../fr/fr-bo';
import { TBOMsg } from './bo-msg';

export class TBaseMsgList extends TBaseMsg {
    private SL: TStringList = new TStringList();
    public OutputRequestList: TStringList = new TStringList();

    constructor(public BO: TBO) {
        super();
    }

    protected NewMsg(): TBaseMsg {
        // return new TBaseMsg();
        return new TBOMsg(this.BO);
    }

    private ProcessRequestHeader(): void {
        let s: string;
        let b = false;

        const l: number = this.BO.MsgToken.cTokenRequest.length;
        do {
            if (this.SL.Count > 0) {
                b = (this.SL.SL[0].startsWith(this.BO.MsgToken.cTokenRequest));
            } else {
                b = false;
            }
            if (b) {
                s = this.SL.SL[0].substring(l + 1);
                this.OutputRequestList.Add(this.BO.MsgToken.cTokenOutput + s);
                this.SL.Delete(0);
            }
        }
        while (b);
    }

    private ProcessRequestInput(): void {
        if (this.SL.Count > 0) {
            const msg: TBaseMsg = this.NewMsg(); // NewMsg is virtual! //TBOMsg msg = new TBOMsg(BO);
            for (let i = 0; i < this.SL.Count; i++) {
                if (this.IsComment(this.SL.SL[i])) {
                    continue;
                }
                msg.Prot = this.SL.SL[i];
                msg.DispatchProt();
            }
            this.SL.Clear();
        }
    }

    DispatchProt(): boolean {
        this.ClearResult();

        this.SL.Text = this.Prot;

        // if erste Zeile ist Request
        if (this.Prot.startsWith(this.BO.MsgToken.cTokenRequest) ||
            this.Prot.startsWith('RiggVar.Request.') ||
            this.Prot.startsWith(this.BO.MsgToken.cTokenAnonymousRequest)) {
            let result = false;
            if (this.SL.Count > 0) {
                // eine Request-Zeile, wie bisher
                let l: number;
                if (this.Prot.startsWith(this.BO.MsgToken.cTokenRequest)) {
                    l = this.BO.MsgToken.cTokenRequest.length;
                } else if (this.Prot.startsWith(this.BO.MsgToken.cTokenAnonymousRequest)) {
                    l = this.BO.MsgToken.cTokenAnonymousRequest.length;
                } else {
                    l = 'RiggVar.Request.'.length;
                }
                this.MsgValue = this.SL.SL[0].substring(l + 1);
                this.Cmd = this.BO.MsgToken.cTokenOutput;
                this.MsgValue = this.BO.MsgToken.cTokenOutput + this.MsgValue;
                this.SL.Delete(0);
                this.OutputRequestList.Add(this.MsgValue);

                // alle weiteren Output-Request-Zeilen
                this.ProcessRequestHeader();

                // process body of message
                this.ProcessRequestInput();

                this.Prot = ''; // wird nicht mehr gebraucht
                result = true; // später die Antwort senden
                // Msg wird anschließend zur Queue hinzugefügt,
                // nach Neuberechnung wird Msg von der Queue geholt,
                // der Output generiert und gesendet.
            }
            this.MsgResult = 1; // do not reply with MsgID now
            return result;
        }

        // Mehrzeilig ohne RequestHeader
        if (this.SL.Count > 1) {
            this.ProcessRequestInput();
            this.MsgResult = 1; // do not reply with MsgID
            return false;
        }

        // Einzeilig
        if (this.SL.Count === 1) {
            const msg: TBaseMsg = this.NewMsg();
            msg.Prot = this.SL.SL[0];
            const res: boolean = msg.DispatchProt();
            this.MsgResult = msg.MsgResult;
            return res;
        }

        // empty Msg
        this.MsgResult = 1;
        return false;
    }

}

export class TMsgFactory {

    constructor(public BO: TBO) {
    }

    CreateMsg(): TBaseMsgList {
        return new TBaseMsgList(this.BO);
    }
}
