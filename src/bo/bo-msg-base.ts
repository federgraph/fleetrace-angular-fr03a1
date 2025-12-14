import { TMsgType } from './bo-msg-parser';

export abstract class TReplayMsg {
  Division = '*';
  RunID = '';
  Bib = 0;
  Cmd = '';
  MsgValue = '';

  DBID = 0;

  MsgType: TMsgType = TMsgType.None;
  MsgKey = '';

  constructor() {
    this.ClearResult();
  }

  static DiskMsgHeader(): string {
    return 'Cmd,MsgValue,ReplayInterval';
  }

  ClearResult() {
    this.Division = '*';
    this.RunID = 'RunID';
    this.Bib = 0;
    this.Cmd = 'Cmd';
    this.MsgValue = '00:00:00.000';

    this.DBID = -1;
  }

  Assign(Source: TReplayMsg) {
    const cr = Source;

    if (cr) {
      this.Division = cr.Division;
      this.RunID = cr.RunID;
      this.Bib = cr.Bib;
      this.Cmd = cr.Cmd;
      this.MsgValue = cr.MsgValue;

      this.DBID = cr.DBID;
    }
  }

  protected IsComment(s: string): boolean {
    if (s === '' || s.startsWith('//') || s.startsWith('#')) {
      return true;
    }
    return false;
  }
}

export class TBaseMsg extends TReplayMsg {
  Prot = '';
  MsgResult = 0;

  DispatchProt(): boolean {
    return false;
  }
}
