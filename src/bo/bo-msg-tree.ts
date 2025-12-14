import { TStringList } from '../util/fb-strings';
import { TUtils } from '../util/fb-classes';
import { TBO } from '../fr/fr-bo';
import { TMsgToken } from './bo-msg-token';

export class TBaseToken {
  static NewActionID = 0; // used only during construction of MsgTree

  static MsgID = 0;
  static UseLongNames = false;
  static BO: TBO = null;
  static MsgToken: TMsgToken = new TMsgToken();

  FActionID: number;

  TokenID: number;

  static New(aOwner: TBaseToken) {
    return new TBaseToken(TBaseToken.BO, TBaseToken.MsgToken, aOwner, '');
  }

  constructor(
    public BO: TBO,
    public MsgToken: TMsgToken,
    public Owner: TBaseToken,
    public FNameID: string,
  ) {
    this.FActionID = TBaseToken.NewActionID;
    this.TokenID = -1;
  }

  NamePath(): string {
    let result = this.FNameID;
    if (this.Owner) {
      const s = this.Owner.NamePath();
      if (s) {
        result = s + '.' + this.NameID();
      }
    }
    return result;
  }

  NameID(): string {
    let result: string;
    if (this.TokenID > -1) {
      if (TBaseToken.UseLongNames) {
        result = this.MsgToken.LongToken(this.FNameID) + TUtils.IntToStr(this.TokenID);
      } else {
        result = this.FNameID + TUtils.IntToStr(this.TokenID);
      }
    } else {
      if (TBaseToken.UseLongNames) {
        result = this.MsgToken.LongToken(this.FNameID);
      } else {
        result = this.FNameID;
      }
    }
    return result;
  }
  get ActionID(): number {
    return this.FActionID;
  }
}

export class TTokenList {
  private FIndexedChildToken: TBaseToken;

  constructor(aOwner: TBaseToken, aTokenName: string, aChildToken: TBaseToken) {
    this.FIndexedChildToken = aChildToken;
    this.FIndexedChildToken.Owner = aOwner;
    this.FIndexedChildToken.FNameID = aTokenName;
  }

  Token(ID: number): TBaseToken {
    this.FIndexedChildToken.TokenID = ID;
    return this.FIndexedChildToken;
  }
}

export type TInputActionEvent = (sender: object, s: string) => void;

export class TInputAction {
  OnSend: TInputActionEvent;
  Send(sKey: string, sValue: string) {
    if (this.OnSend) {
      this.OnSend(this, sKey + '=' + sValue);
    }
  }
}

/** Adds validation support and sendMsg method (needed for leaf-functions) */
export class TInputValue extends TBaseToken {
  private static ifdefSKK = true;

  private GetInputAction(): TInputAction {
    if (this.ActionID === 0) {
      return TInputActionManager.DynamicActionRef;
    } else {
      return TInputActionManager.UndoActionRef;
    }
  }

  protected IsValidBoolean(s: string): boolean {
    return s === 'True' || s === 'False';
  }

  IsPositiveInteger(s: string): boolean {
    return TUtils.StrToIntDef(s, -1) >= 0;
  }

  IsValidCount(s: string): boolean {
    const i = TUtils.StrToIntDef(s, -1);
    return i >= 0 && i <= 50;
  }
  IsValidProp(Key: string, Value: string): boolean {
    let result: boolean;
    result = Key.length < 20;
    result = result && Value.length > 0;
    result = result && Value.length < 40;
    return result;
  }

  IsValidTime(s: string): boolean {
    return true;
    // return PTime.IsValidTimeString(s);
  }
  IsValidStatus(s: string): boolean {
    return true;
    // return (s == 'ok')
    //   || (s == 'dnf')
    //   || (s == 'dsq')
    //   || (s == 'dns')
    //   || (s == '*');
  }
  IsValidBib(s: string): boolean {
    return TUtils.StrToIntDef(s, -1) >= 0;
  }
  IsValidSNR(s: string): boolean {
    return TUtils.StrToIntDef(s, -1) >= 0;
  }
  IsValidNOC(s: string): boolean {
    return s.length === 3;
  }
  IsValidName(s: string): boolean {
    return true;
  }
  IsValidDSQGate(s: string): boolean {
    return TUtils.StrToIntDef(s, -1) >= 0;
  }
  IsValidGender(s: string): boolean {
    return s.length < 20;
  }
  IsValidPersonalBest(s: string): boolean {
    return s.length < 20;
  }
  IsValidRadius(s: string): boolean {
    if (TInputValue.ifdefSKK) {
      return this.IsPositiveInteger(s);
    }
    return this.IsScrollbarInt(s);
  }
  IsValidKoord(s: string): boolean {
    if (TInputValue.ifdefSKK) {
      return this.IsPositiveInteger(s);
    }
    return this.IsScrollbarInt(s);
  }
  IsScrollbarInt(s: string): boolean {
    const t = TUtils.StrToIntDef(s, -1);
    return t > -100 * 100 && t < 100 * 100;
  }

  IsValidRace(s: string): boolean {
    if (s != null) {
      return s.length < 13;
    }
    return false;
  }

  get InputAction(): TInputAction {
    return this.GetInputAction();
  }

  SendMsg(IsValid: boolean, aCommand: string, aValue: string) {
    let sKey: string;

    if (IsValid) {
      TBaseToken.MsgID++;
      sKey = '';
    } else {
      sKey = '//';
    }
    sKey = sKey + this.NamePath() + '.' + aCommand;
    if (this.InputAction != null) {
      this.InputAction.Send(sKey, aValue);
    }
  }
}

export class TAthlete extends TInputValue {
  SNR(Value: string) {
    this.SendMsg(this.IsPositiveInteger(Value), this.MsgToken.cTokenID, Value);
  }
  FN(Value: string) {
    this.SendMsg(this.IsValidName(Value), 'FN', Value);
  }
  LN(Value: string) {
    this.SendMsg(this.IsValidName(Value), 'LN', Value);
  }
  SN(Value: string) {
    this.SendMsg(this.IsValidName(Value), 'SN', Value);
  }
  NC(Value: string) {
    this.SendMsg(this.IsValidNOC(Value), 'NC', Value);
  }
  GR(Value: string) {
    this.SendMsg(this.IsValidGender(Value), 'GR', Value);
  }
  PB(Value: string) {
    this.SendMsg(this.IsValidPersonalBest(Value), 'PB', Value);
  }
  Prop(Key: string, Value: string) {
    this.SendMsg(this.IsValidProp(Key, Value), 'Prop_' + Key, Value);
  }
  FieldN(index: number, Value: string): void {
    this.SendMsg(this.IsValidName(Value), 'N' + index.toString(), Value);
  }
}

export class TPos extends TInputValue {
  Bib(Value: string) {
    this.SendMsg(this.IsValidBib(Value), this.MsgToken.cTokenBib, Value);
  }
  SNR(Value: string) {
    this.SendMsg(this.IsValidSNR(Value), this.MsgToken.cTokenID, Value);
  }
  AthleteID(Value: string) {
    this.SNR(Value);
  }
}

export class TStartlist extends TInputValue {
  private FPosStore: TTokenList;

  constructor(
    public override BO: TBO,
    public override MsgToken: TMsgToken,
    aOwner: TBaseToken,
    aNameID: string,
  ) {
    super(BO, MsgToken, aOwner, aNameID);
    this.FPosStore = new TTokenList(this, 'Pos', new TPos(BO, MsgToken, this, aNameID));
  }

  Pos(index: number): TPos {
    const bt = this.FPosStore.Token(index);
    if (bt instanceof TPos) {
      const p = bt as TPos;
      return p;
    }
    return null;
  }

  Count(Value: string) {
    this.SendMsg(this.IsPositiveInteger(Value), this.MsgToken.cTokenCount, Value);
  }
}

export class TTokenDivision extends TBaseToken {
  private FAthleteStore: TTokenList;
  private FRaceStore: TTokenList;

  Race1: TRun1;

  Athlete(index: number): TAthlete {
    return this.FAthleteStore.Token(index) as TAthlete;
  }
  Race(index: number): TRun {
    return this.FRaceStore.Token(index) as TRun;
  }

  constructor(
    public override BO: TBO,
    public override MsgToken: TMsgToken,
    public override Owner: TBaseToken,
    public override FNameID: string,
  ) {
    super(BO, MsgToken, Owner, FNameID);
    this.FAthleteStore = new TTokenList(this, this.MsgToken.cTokenID, TAthlete.New(this));
    this.FRaceStore = new TTokenList(this, this.MsgToken.cTokenRace, TRun.New(this));
    this.Race1 = new TRun1(BO, MsgToken, this, this.MsgToken.cTokenRace + '1');
  }
}

export class TMsgTree extends TBaseToken {
  private FDivision: TDivision;

  UseMsgID = false;
  UsePrefix: boolean;

  GetLongNames(): boolean {
    return TBaseToken.UseLongNames;
  }
  SetLongNames(Value: boolean) {
    TBaseToken.UseLongNames = Value;
  }

  constructor(
    public override BO: TBO,
    public override MsgToken: TMsgToken,
    public override Owner: TBaseToken,
    public override FNameID: string,
  ) {
    super(BO, MsgToken, Owner, FNameID);
    TBaseToken.NewActionID = this.FActionID;
    this.FDivision = new TDivision(BO, MsgToken, this, this.MsgToken.cTokenB);
    this.UsePrefix = true;
  }

  override NamePath(): string {
    let result = '';
    if (this.UseMsgID) {
      if (this.Owner) {
        result = this.Owner.NamePath + '.' + this.NameID;
      } else {
        result = this.NameID + this.MsgToken.cTokenMsg + TUtils.IntToStr(TBaseToken.MsgID);
      }
    } else if (this.UsePrefix) {
      return super.NamePath();
    }

    return result;
  }

  get LongNames(): boolean {
    return this.GetLongNames();
  }
  set LongNames(value: boolean) {
    this.SetLongNames(value);
  }
  get Division(): TDivision {
    return this.FDivision;
  }
}

export type TBackupEvent = (sender: TMsgTree) => void;

export class TBackup {
  private FSLBackup: TStringList;
  private InputAction: TInputAction;
  private FOnBackup: TBackupEvent;

  private SaveLine(Sender: object, s: string) {
    this.FSLBackup.Add(s);
  }

  constructor() {
    this.FSLBackup = new TStringList();
    this.InputAction = new TInputAction();
    this.InputAction.OnSend = this.SaveLine;
  }

  Backup(aFileName: string) {
    //  TInputActionManager.DynamicActionRef = InputAction;
    //  try
    //    if Assigned(OnBackup) then
    //      OnBackup(BO.MsgTree);
    //    FSLBackup.SaveToFile(aFileName);
    //  finally
    //    TInputActionManager.DynamicActionRef = nil;
    //  end;
  }
  // property OnBackup: TBackupEvent read FOnBackup write FOnBackup;
}

export class TInputActionManager {
  static DynamicActionID = 0;
  static UndoActionID = 1;

  static DynamicActionRef: TInputAction = null;
  static UndoActionRef: TInputAction = null;
}

export class TBib extends TInputValue {
  constructor(
    public override BO: TBO,
    public override MsgToken: TMsgToken,
    public override Owner: TBaseToken,
    public override FNameID: string,
  ) {
    super(BO, MsgToken, Owner, FNameID);
  }

  /**
   * Test Message
   * @param Value value for the right side of the equal sign
   */
  XX(Value: string): void {
    this.SendMsg(true, 'XX', Value);
  }

  /**
   * 'Quitt' Message
   * @param Value value of the QU message
   */
  QU(Value: string) {
    this.SendMsg(this.IsValidStatus(Value), 'QU', Value);
  }
  DG(Value: string) {
    this.SendMsg(this.IsValidDSQGate(Value), 'DG', Value);
  }
  ST(Value: string) {
    this.SendMsg(this.IsValidTime(Value), 'ST', Value);
  }
  IT(channel: number, Value: string) {
    this.SendMsg(this.IsValidTime(Value), 'IT' + channel.toString(), Value);
  }
  FT(Value: string) {
    this.SendMsg(this.IsValidTime(Value), 'FT', Value);
  }
  Rank(Value: string) {
    this.SendMsg(this.IsPositiveInteger(Value), 'Rank', Value);
  }
  RV(Value: string) {
    this.SendMsg(this.IsValidRace(Value), 'RV', Value);
  }
  FM(Value: string) {
    this.SendMsg(this.IsValidRace(Value), 'FM', Value);
  }
}

export class TRun extends TInputValue {
  private FBibStore: TTokenList;

  constructor(
    public override BO: TBO,
    public override MsgToken: TMsgToken,
    public override Owner: TBaseToken,
    public override FNameID: string,
  ) {
    super(BO, MsgToken, Owner, FNameID);
    this.FBibStore = new TTokenList(this, 'Bib', new TBib(BO, MsgToken, Owner, FNameID));
  }
  IsRacing(Value: string): void {
    this.SendMsg(this.IsValidBoolean(Value), 'IsRacing', Value);
  }
  Bib(index: number): TBib {
    return this.FBibStore.Token(index) as TBib;
  }
}

export class TRun1 extends TRun {
  Startlist: TStartlist;
  constructor(
    public override BO: TBO,
    public override MsgToken: TMsgToken,
    public override Owner: TBaseToken,
    public override FNameID: string,
  ) {
    super(BO, MsgToken, Owner, FNameID);
    this.Startlist = new TStartlist(BO, MsgToken, this, 'STL');
  }
}

export class TDivision extends TInputValue {
  private FAthleteStore: TTokenList;
  private FRaceStore: TTokenList;
  public Race1: TRun1;

  constructor(
    public override BO: TBO,
    public override MsgToken: TMsgToken,
    public override Owner: TBaseToken,
    public override FNameID: string,
  ) {
    super(BO, MsgToken, Owner, FNameID);
    this.FAthleteStore = new TTokenList(
      this,
      BO.MsgToken.cTokenID,
      new TAthlete(BO, MsgToken, Owner, FNameID),
    );
    this.FRaceStore = new TTokenList(
      this,
      BO.MsgToken.cTokenRace,
      new TRun(BO, MsgToken, Owner, FNameID),
    );
    this.Race1 = new TRun1(BO, MsgToken, this, BO.MsgToken.cTokenRace + '1');
  }

  Race(index: number): TRun {
    return this.FRaceStore.Token(index) as TRun;
  }

  Athlete(index: number): TAthlete {
    return this.FAthleteStore.Token(index) as TAthlete;
  }
}
