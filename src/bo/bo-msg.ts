import { TBaseMsg } from "./bo-msg-base";
import { TMsgParser, TMsgType } from './bo-msg-parser';
import { TBO } from "../fr/fr-bo";
import { TUtils } from "../util/fb-classes";
import { TEventRowCollectionItem } from "../col/event/event-row-collection";
import { TRaceRowCollectionItem } from "../col/race/race-row-collection-item";
import { TRaceNode } from "../col/race/race-node";
import { TRaceBO } from "../col/race/race-bo";

export class TBOMsg extends TBaseMsg {

  MsgParser: TMsgParser;
  ItemPos: number = 0;
  AthleteID: number = 0;

  constructor(public BO: TBO) {
    super();
    this.MsgParser = new TMsgParser(BO);
  }

  FindCR(): TRaceRowCollectionItem {
    const qn: TRaceNode = this.BO.FindNode(this.RunID);
    if (qn != null) {
      if (this.ItemPos > 0)
        return qn.Collection.Items[this.ItemPos - 1];
      else
        return qn.FindBib(this.Bib);
    }
    else
      return null;
  }

  HandleProt() {
    this.MsgResult = 1;
    let MsgHandled = false;

    // Testmessage
    if (this.Cmd === "XX") {
      // if (Verbose) Trace("HandleProt: Testmessage");
      this.MsgType = TMsgType.Test;
    }

    else if (this.Cmd === "Count") {
      MsgHandled = this.BO.UpdateStartlistCount(this.RunID, TUtils.StrToIntDef(this.MsgValue, -1));
      this.MsgType = TMsgType.Param;
    }
    else if (this.AthleteID > 0) {
      MsgHandled = this.BO.UpdateAthlete(this.AthleteID, this.Cmd, this.MsgValue);
    }

    else if (this.Cmd === "IsRacing") {
      if (this.BO.FindRaceIndex(this.RunID) > -1)
        this.BO.SetRunIsRacing(this.RunID, this.MsgValue === TUtils.BoolStr(true));          
      this.MsgType = TMsgType.Option;
    }

    else {
      const temp: string = this.MsgValue.toLowerCase();
      if ((temp === "empty") || (temp === "null") || (temp === "99:99:99.99"))
        this.MsgValue = "-1";
      const cr: TRaceRowCollectionItem = this.FindCR();
      if (cr != null) {
        MsgHandled = this.HandleMsg(cr);
      }
    }

    if (MsgHandled) {
      this.BO.CounterMsgHandled++;
      this.MsgResult = 0;
    }
  }

  HandleMsg(cr: TRaceRowCollectionItem): boolean {
    const crev: TEventRowCollectionItem = this.BO.EventNode.Collection.Items[cr.IndexOfRow];
    let s: string = this.MsgValue;
    const o: TRaceBO = cr.ru.ColBO;

    const r = this.GetRaceIndex();
    
    if (this.Cmd === "ST" || this.Cmd === "SC")
      s = o.EditST(cr, s);

    else if ((this.Cmd.substring(0, 2) === "IT") || (this.Cmd.substring(0, 2) === "FC")) {
      const channel: number = TUtils.StrToIntDef(this.Cmd.substring(2), -1);
      if (channel > -1)
        s = o.EditIT(cr, s, "col_IT" + channel.toString());
    }
    else if ((this.Cmd === "FT") || (this.Cmd === "FC"))
      s = o.EditFT(cr, s);

    else if (this.Cmd === "QU")
      this.BO.EditQU(r, cr.Index, s);
    else if (this.Cmd === "DG")
      this.BO.EditDG(r, cr.Index, s);
    else if (this.Cmd === "Rank")
      this.BO.EditOTime(r, cr.Index, s);

    else if (this.Cmd === "RV") {
      s = this.BO.EventNode.ColBO.EditRaceValue(crev, s, this.GetColName());
    }
    else if (this.Cmd === "FM") {
      const ri: number = this.GetRaceIndex();
      if (ri !== -1)
        crev.Race[ri].Fleet = TUtils.StrToIntDef(s, crev.Race[ri].Fleet);
    }

    else if (this.Cmd === "Bib")
      s = o.EditBib(cr, s); // --> wird horizontal kopiert, bo.Bib[Index] := cr.Bib
    else if (this.Cmd === "SNR")
      s = o.EditSNR(cr, s); // --> wird horizontal kopiert, bo.SNR[Index] := cr.SNR

    return true;
  }

  private GetColName(): string {
    if (this.RunID.substring(0, 1) !== "W")
      return "";
    const s: string = this.RunID.substring(1);
    const i: number = TUtils.StrToIntDef(s, -1);
    if ( i < 1 || i > this.BO.BOParams.RaceCount)
      return "";
    return "col_R" + i.toString();
  }

  private GetRaceIndex(): number {
    if (!this.RunID.startsWith("W"))
      return -1;
    const s = this.RunID.substring(1);
    let i = TUtils.StrToIntDef(s, -1);
    if (i < 1 || i > this.BO.BOParams.RaceCount)
      i = -1;
    return i;
  }

  ClearResult() {
    super.ClearResult();
    this.ItemPos = -1;
    this.AthleteID = -1;
  }

  DispatchProt(): boolean {
    this.ClearResult();

    // ignore Errors in compact format-------------
    if (this.Prot.startsWith("Error")) {
      this.MsgType = TMsgType.None;
      return true;
    }
    
    // Comments-----------------------------------
    if ((this.Prot === "") || this.Prot.startsWith("//") || this.Prot.startsWith("#")) {
      this.MsgType = TMsgType.Comment;
      return true;
    }

    // Management Commands------------------------
    if (this.Prot.startsWith("Manage.")) {
      return true;
    }

    // Properties---------------------------------
    if (this.Prot.startsWith("EP.") || this.Prot.startsWith("Event.Prop_")) {
      this.BO.EventProps.ParseLine(this.Prot);
      this.MsgType = TMsgType.Prop;
      return true;
    }

    // ignore params------------------------------
    if (this.Prot.startsWith("DP.") || this.Prot.startsWith("Event.")) {
      return true;
    }

    // Data---------------------------------------
    if (this.Prot.startsWith(this.BO.MsgToken.cTokenModul)) {
      return this.ParseProt();
    }

    return false;
  }

  ParseProt(): boolean {
    this.MsgType = TMsgType.Input;
    const result: boolean = this.MsgParser.Parse(this.Prot);
    if (result) {
      this.MsgType = this.MsgParser.MsgType;
      this.MsgKey = this.MsgParser.MsgKey;
      this.MsgValue = this.MsgParser.sValue;

      this.Division = this.MsgParser.sDivision;
      this.RunID = this.MsgParser.sRunID;
      this.Bib = TUtils.StrToIntDef(this.MsgParser.sBib, -1);
      this.Cmd = this.MsgParser.sCommand;
      this.ItemPos = TUtils.StrToIntDef(this.MsgParser.sPos, -1);
      this.AthleteID = TUtils.StrToIntDef(this.MsgParser.sAthlete, -1);
      this.DBID = TUtils.StrToIntDef(this.MsgParser.sMsgID, -1);

      this.HandleProt();
    }
    return result;
  }
}
