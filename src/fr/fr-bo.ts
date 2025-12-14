import { TBaseBO } from '../bo/bo-base';
import { TBOManager } from '../bo/bo-manager';
import { TBOMsg } from '../bo/bo-msg';
import { TBaseMsg } from '../bo/bo-msg-base';
import { TMsgFactory } from '../bo/bo-msg-list';
import { TMsgToken } from '../bo/bo-msg-token';
import { TDivision, TInputAction, TInputActionManager, TMsgTree, TRun } from '../bo/bo-msg-tree';
import { TBOParams } from '../bo/bo-params';
import { TCalcEvent } from '../calc/calc-ev';
import { TCalcTP } from '../calc/calc-tp';
import { TPenaltyISAF } from '../calc/penalty-isaf';
import { TEventBO } from '../col/event/event-bo';
import { TEventRaceEntry } from '../col/event/event-race-entry';
import {
  TEventNode,
  TEventRowCollection,
  TEventRowCollectionItem,
} from '../col/event/event-row-collection';
import { TRaceBO } from '../col/race/race-bo';
import { TRaceNode } from '../col/race/race-node';
import { TRaceRowCollection } from '../col/race/race-row-collection';
import { TRaceRowCollectionItem } from '../col/race/race-row-collection-item';
import { TStammdatenBO } from '../col/stammdaten/stammdaten-bo';
import { FieldNames } from '../col/stammdaten/stammdaten-fieldnames';
import { TStammdatenNode } from '../col/stammdaten/stammdaten-node';
import { TStammdatenRowCollection } from '../col/stammdaten/stammdaten-row-collection';
import { TStammdatenRowCollectionItem } from '../col/stammdaten/stammdaten-row-collection-item';
import { TColCaptions } from '../grid/col-captions';
import { TUtils } from '../util/fb-classes';
import { TProp } from '../util/fb-props';
import { TStringList } from '../util/fb-strings';
import { TEventProps, TInputModeStrings, TInputMode } from './fr-event-props';
import { TExcelExporter } from './fr-excel-export';
import { TExcelImporter, TableID } from './fr-excel-importer';
import { TIniImage } from './fr-ini-image';
import { TNodeList } from './fr-node-list';
import { TTimePoint } from '../col/race/time-point';

export enum BOIndexer {
  SNR,
  Bib,
  QU,
  DG,
  OT,
  Penalty,
}

export class CurrentNumbers {
  race = 0;
  tp = 0;
  bib = 0;
  withTime = 0;
  withPenalty = 0;
  withTimeOrPenalty = 0;

  constructor() {
    this.clear();
  }

  clear() {
    this.race = 0;
    this.tp = 0;
    this.bib = 0;
    this.withPenalty = 0;
    this.withTime = 0;
    this.withTimeOrPenalty = 0;
  }
}

export class TBO extends TBaseBO {
  static FSLBackup: TStringList = null;

  private FNodeList: TNodeList = null;

  msgQueueR: string[] = [];
  msgQueueE: string[] = [];

  CurrentRace = 1;
  CurrentTP = 0;
  CurrentBib = 1;

  UseQueue = false;
  Auto = true;
  WantUpdateEvent = true;
  StrictInputMode = true;

  UseInputFilter = false;
  UseOutputFilter = false;
  UseCompactFormat = true;

  ConvertedData = '';

  FModified = false;

  Gezeitet = 0;

  CounterCalc = 0;
  MsgCounter = 0;

  StammdatenBO: TStammdatenBO;
  StammdatenNode: TStammdatenNode;

  EventBO: TEventBO;
  EventNode: TEventNode;

  RaceBO: TRaceBO;
  RNode: TRaceNode[];

  CalcEV: TCalcEvent;
  CalcTP: TCalcTP;

  EventProps: TEventProps;
  ExcelImporter: TExcelImporter;
  MsgTree: TMsgTree;

  MsgFactory: TMsgFactory;

  PenaltyService: TPenaltyISAF;

  constructor(
    public override BOParams: TBOParams,
    public override IniImage: TIniImage,
    public override BOManager: TBOManager,
    public MsgToken: TMsgToken,
  ) {
    super(IniImage, BOManager, BOParams);

    TColCaptions.InitDefaultColCaptions();

    this.MsgFactory = new TMsgFactory(this.BOManager.BO);

    this.MsgToken.cTokenA = 'FR';

    this.MsgToken.DivisionName = this.BOParams.DivisionName;

    this.CalcEV = new TCalcEvent(this.IniImage, this, TCalcEvent.ScoringProviderInline);

    this.CalcTP = new TCalcTP(this);

    this.FNodeList = new TNodeList(this);

    this.MsgTree = new TMsgTree(this, this.MsgToken, null, this.MsgToken.cTokenA);

    this.PenaltyService = new TPenaltyISAF();

    // Stammdaten
    this.StammdatenBO = new TStammdatenBO(this);
    this.StammdatenNode = new TStammdatenNode(this.StammdatenBO, this);
    this.StammdatenNode.ColBO = this.StammdatenBO;
    this.StammdatenNode.NameID = 'Stammdaten';
    this.StammdatenBO.CurrentNode = this.StammdatenNode;

    // Event
    this.EventBO = new TEventBO(this);
    this.EventNode = new TEventNode(this.EventBO, this);
    this.EventNode.NameID = 'E';
    this.EventNode.StammdatenRowCollection = this.StammdatenNode.Collection;
    this.EventBO.CurrentNode = this.EventNode;
    this.FNodeList.AddEventNode(this.EventNode);

    // Race
    this.RaceBO = new TRaceBO(this);
    this.RNode = new Array<TRaceNode>(this.BOParams.RaceCount + 1);
    for (let i = 0; i <= this.BOParams.RaceCount; i++) {
      const ru: TRaceNode = new TRaceNode(this.RaceBO, this);
      ru.NameID = 'W' + i.toString();
      ru.BOParams = this.BOParams;
      ru.StammdatenRowCollection = this.StammdatenNode.Collection;
      ru.Index = i;
      ru.Layout = 0;
      this.FNodeList.AddRaceNode(ru);
      ru.OnCalc = this.SetModified;
      this.RNode[i] = ru;
    }
    this.RaceBO.CurrentNode = this.RNode[1];

    this.InitStartlistCount(this.BOParams.StartlistCount);
    this.EventProps = new TEventProps(this);
    this.ExcelImporter = new TExcelImporter();
  }

  ClearCommand(): void {
    this.ClearBtnClick();
  }

  GetSNR(Index: number): number {
    const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
    if (cr != null) {
      return cr.SNR;
    }
    return -1;
  }

  GetBib(Index: number): number {
    const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
    if (cr != null) {
      return cr.Bib;
    }
    return -1;
  }

  GetQU(RaceIndex: number, Index: number): number {
    const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
    if (cr != null) {
      return cr.Race[RaceIndex].QU;
    }
    return 0;
  }

  GetDG(RaceIndex: number, Index: number): number {
    const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
    if (cr != null) {
      return cr.Race[RaceIndex].DG;
    }
    return 0;
  }

  GetOT(RaceIndex: number, Index: number): number {
    const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
    if (cr != null) {
      return cr.Race[RaceIndex].OTime;
    }
    return 0;
  }

  SetSNR(Index: number, Value: number): void {
    const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
    if (cr) {
      cr.SNR = Value;
    }
    for (let i = 0; i <= this.BOParams.RaceCount; i++) {
      const wr: TRaceRowCollectionItem = this.RNode[i].Collection.Items[Index];
      if (wr) {
        wr.SNR = Value;
      }
    }
  }

  SetBib(Index: number, Value: number): void {
    const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
    if (cr) {
      cr.Bib = Value;
    }
    for (let i = 0; i <= this.BOParams.RaceCount; i++) {
      const wr: TRaceRowCollectionItem = this.RNode[i].Collection.Items[Index];
      if (wr) {
        wr.Bib = Value;
      }
    }
  }

  SetQU(RaceIndex: number, Index: number, Value: number): void {
    const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
    if (cr) {
      cr.Race[RaceIndex].QU = Value;
      cr.Modified = true;
    }
    const wr: TRaceRowCollectionItem = this.RNode[RaceIndex].Collection.Items[Index];
    if (wr) {
      wr.QU.AsInteger = Value;
      wr.Modified = true;
    }
  }

  SetDG(RaceIndex: number, Index: number, Value: number): void {
    const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
    if (cr != null) {
      cr.Race[RaceIndex].DG = Value;
      cr.Modified = true;
    }
    const wr: TRaceRowCollectionItem = this.RNode[RaceIndex].Collection.Items[Index];
    if (wr) {
      wr.DG = Value;
      wr.Modified = true;
    }
  }

  SetOT(RaceIndex: number, Index: number, Value: number): void {
    const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
    if (cr) {
      cr.Race[RaceIndex].OTime = Value;
      cr.Modified = true;
    }
    const wr: TRaceRowCollectionItem = this.RNode[RaceIndex].Collection.Items[Index];
    if (wr) {
      wr.MRank = Value;
      wr.Modified = true;
    }
  }

  getFieldNumber(f: BOIndexer, RaceIndex: number, Index: number): number {
    switch (f) {
      case BOIndexer.SNR:
        return this.GetSNR(Index);
      case BOIndexer.Bib:
        return this.GetBib(Index);
      case BOIndexer.QU:
        return this.GetQU(RaceIndex, Index);
      case BOIndexer.DG:
        return this.GetDG(RaceIndex, Index);
      case BOIndexer.OT:
        return this.GetOT(RaceIndex, Index);
      default:
        return 0;
    }
  }
  SetFieldNumber(f: BOIndexer, RaceIndex: number, Index: number, value: number) {
    switch (f) {
      case BOIndexer.SNR:
        this.SetSNR(Index, value);
        break;
      case BOIndexer.Bib:
        this.SetBib(Index, value);
        break;
      case BOIndexer.QU:
        this.SetQU(RaceIndex, Index, value);
        break;
      case BOIndexer.DG:
        this.SetDG(RaceIndex, Index, value);
        break;
      case BOIndexer.OT:
        this.SetOT(RaceIndex, Index, value);
        break;
    }
  }

  GetPenalty(RaceIndex: number, Index: number): TPenaltyISAF {
    const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
    if (cr) {
      return cr.Race[RaceIndex].Penalty;
    }
    return null;
  }

  SetPenalty(RaceIndex: number, Index: number, Value: TPenaltyISAF): void {
    const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
    if (cr) {
      cr.Race[RaceIndex].Penalty.Assign(Value);
      cr.Modified = true;
    }
    const wr: TRaceRowCollectionItem = this.RNode[RaceIndex].Collection.Items[Index];
    if (wr) {
      wr.QU.Assign(Value);
      wr.Modified = true;
    }
  }

  getRacePenalty(RaceIndex: number, Index: number): TPenaltyISAF {
    return this.GetPenalty(RaceIndex, Index);
  }
  setRacePenalty(RaceIndex: number, Index: number, value: TPenaltyISAF) {
    this.SetPenalty(RaceIndex, Index, value);
  }

  get Gemeldet(): number {
    return this.EventNode.Collection.Count;
  }

  get Gesegelt(): number {
    return this.BOParams.RaceCount;
  }

  private SaveLine(sender: object, s: string): void {
    if (TBO.FSLBackup) {
      // if (s !='')
      TBO.FSLBackup.Add(s);
    }
  }

  ClearList(rd: string): void {
    this.FNodeList.ClearList(rd);
  }

  ClearResult(rd: string): void {
    this.FNodeList.ClearResult(rd);
  }

  private SetModified(sender: object): void {
    this.FModified = true;
  }

  Calc(): boolean {
    this.CalcNodes();
    const result: boolean = this.FModified;
    if (this.FModified) {
      this.CalcEvent();
    }
    return result;
  }

  private CalcEvent(): void {
    this.CalcNodes();
    this.CounterCalc++;
    this.FModified = false;
  }

  private CalcNodes(): void {
    this.FNodeList.CalcNodes();
  }

  private InitStartlistCount(newCount: number): void {
    for (let i = 0; i <= this.BOParams.RaceCount; i++) {
      this.RNode[i].Init(newCount);
    }
    this.EventNode.Init(newCount);
    // ColorMatrix.BibCount = newCount;
  }

  UpdateStartlistCount(roName: string, newCount: number): boolean {
    let result = false;
    const cl: TRaceRowCollection = this.RNode[0].Collection;
    if (cl.Count < newCount && newCount <= this.BOParams.MaxStartlistCount) {
      while (cl.Count < newCount) {
        for (let i1 = 0; i1 <= this.BOParams.RaceCount; i1++) {
          this.RNode[i1].Collection.Add();
        }
        this.EventNode.Collection.Add();
      }
      result = true;
    }
    if (cl.Count > newCount && newCount >= this.BOParams.MinStartlistCount) {
      while (cl.Count > newCount) {
        const c: number = cl.Count;
        for (let i2 = 0; i2 <= this.BOParams.RaceCount; i2++) {
          this.RNode[i2].Collection.Delete(c - 1);
        }
        this.EventNode.Collection.Delete(c - 1);
      }
      result = true;
    }
    // this.BOParams.StartlistCount = cl.Count;
    return result;
  }

  UpdateAthlete(SNR: number, Cmd: string, value: string): boolean {
    let v = value;
    let cr: TStammdatenRowCollectionItem;

    cr = this.StammdatenNode.Collection.FindKey(SNR);
    if (cr == null) {
      cr = this.StammdatenNode.Collection.Add();
      cr.SNR = SNR;
    }

    const bo: TStammdatenBO = this.StammdatenBO;

    if (Cmd.includes('Prop_')) {
      const Key: string = Cmd.substring(5, Cmd.length);
      cr.Props[Key] = value;
    } else if (Cmd === FieldNames.FN || Cmd === 'FN') {
      v = bo.EditFN(cr, v);
    } else if (Cmd === FieldNames.LN || Cmd === 'LN') {
      v = bo.EditLN(cr, v);
    } else if (Cmd === FieldNames.SN || Cmd === 'SN') {
      v = bo.EditSN(cr, value);
    } else if (Cmd === FieldNames.NC || Cmd === 'NC') {
      v = bo.EditNC(cr, value);
    } else if (Cmd === FieldNames.GR || Cmd === 'GR') {
      v = bo.EditGR(cr, v);
    } else if (Cmd === FieldNames.PB || Cmd === 'PB') {
      v = bo.EditPB(cr, v);
    } else if (Cmd.startsWith('N')) {
      v = bo.EditNameColumn(cr, v, 'col_' + Cmd);
    }
    // return v; // ###
    return true;
  }

  FindNode(roName: string): TRaceNode {
    if (!roName.startsWith('W')) {
      return null;
    }
    const s: string = roName.substring(1);
    const i: number = TUtils.StrToIntDef(s, -1);
    if (i < 1 || i > this.BOParams.RaceCount) {
      return null;
    }
    return this.RNode[i];
  }

  Save(): string {
    let result = '';
    TBO.FSLBackup = new TStringList();
    try {
      this.BackupToSL(null);
      result = TBO.FSLBackup.Text;
    } finally {
      TBO.FSLBackup = null;
    }
    return result;
  }

  Load(Data: string): void {
    this.FLoading = true;

    this.Clear();

    const m: TStringList = new TStringList();
    const msg: TBOMsg = new TBOMsg(this);

    try {
      this.ExcelImporter.RunImportFilter(Data, m);
      this.ConvertedData = m.Text;

      for (let i = 0; i < m.Count; i++) {
        const s: string = m.Items(i);
        msg.Prot = s;
        if (!msg.DispatchProt()) {
          console.log('MessageError: ' + s);
        }
      }
      this.InitEventNode();
    } finally {
      this.FLoading = false;
    }
  }

  Dispatch(s: string): boolean {
    const msg: TBOMsg = new TBOMsg(this);
    msg.Prot = s;
    return msg.DispatchProt();
  }

  Clear(): void {
    this.ClearBtnClick();
  }

  /**
   * implemented by calling BackupToSL() and then SaveToFile(FileName)
   * @param aFileName file name to save to
   */
  Backup(aFileName: string): void {
    TBO.FSLBackup = new TStringList();
    try {
      this.BackupToSL(null);
      TBO.FSLBackup.SaveToFile(aFileName);
    } finally {
      TBO.FSLBackup = null;
    }
  }

  /**
   * difference to Load: no clear() and data is read from file.
   * @param aFileName file name for LoadFromfile
   */
  Restore(aFileName: string): void {
    // Unterschied zu Load: 1. kein Clear(), 2. Data from File

    // Clear();

    const m: TStringList = new TStringList();
    const msg: TBOMsg = new TBOMsg(this);

    this.FLoading = true;
    try {
      m.LoadFromFile(aFileName);
      for (let i = 0; i < m.Count; i++) {
        const s: string = m.SL[i];
        msg.Prot = s;
        if (!msg.DispatchProt()) {
          console.log('MessageError: ' + s);
        }
      }
      this.InitEventNode();
    } finally {
      this.FLoading = false;
    }
  }

  BackupAthletes(): void {
    const savedSchemaCode: number = FieldNames.getSchemaCode();
    if (this.EventProps.NormalizedOutput) {
      FieldNames.setSchemaCode(2);
    }
    const cl: TStammdatenRowCollection = this.StammdatenNode.Collection;
    let cr: TStammdatenRowCollectionItem;
    let prop: TProp = new TProp();

    for (let i = 0; i < cl.Count; i++) {
      cr = cl.Items[i];
      if (cr.FN !== '') {
        this.MsgTree.Division.Athlete(cr.SNR).FN(cr.FN);
      }
      if (cr.LN !== '') {
        this.MsgTree.Division.Athlete(cr.SNR).LN(cr.LN);
      }
      if (cr.SN !== '') {
        this.MsgTree.Division.Athlete(cr.SNR).SN(cr.SN);
      }
      if (cr.NC !== '') {
        this.MsgTree.Division.Athlete(cr.SNR).NC(cr.NC);
      }
      if (cr.GR !== '') {
        this.MsgTree.Division.Athlete(cr.SNR).GR(cr.GR);
      }
      if (cr.PB !== '') {
        this.MsgTree.Division.Athlete(cr.SNR).PB(cr.PB);
      }
      if (cl.FieldCount > TStammdatenRowCollection.FixFieldCount) {
        for (let j = TStammdatenRowCollection.FixFieldCount + 1; j <= cl.FieldCount; j++) {
          this.MsgTree.Division.Athlete(cr.SNR).FieldN(j, cr.getItem(j));
        }
      } else {
        for (let p = 0; p < cr.Props.Count; p++) {
          prop = cr.Props.GetProp(7 + p, prop);
          this.MsgTree.Division.Athlete(cr.SNR).Prop(prop.Key, prop.Value);
        }
      }
    }
    // if (TBO.FSLBackup != null)
    // TBO.FSLBackup.Add('');

    FieldNames.setSchemaCode(savedSchemaCode);
  }

  override toString(): string {
    return this.ToTXT();
  }

  ToTXT(): string {
    const SL: TStringList = new TStringList();
    try {
      this.BackupToSL(SL);
      return SL.Text;
    } catch {
      return '';
    }
  }

  BackupToSL(SL: TStringList): void {
    this.BackupToSLCompact(SL, this.UseCompactFormat);
  }

  /**
   * Generates Backup in SL
   * @param SL StringList to contain the backup test
   * @param CompactFormat true if compact textg format should be used
   */
  BackupToSLCompact(SL: TStringList, CompactFormat: boolean): void {
    // let InputAction: TInputAction;
    let g: TDivision;
    let r: TRun;

    let qn: TRaceNode;
    let qc: TRaceRowCollection;
    let qr: TRaceRowCollectionItem;

    this.UpdateRaceNodes();

    if (SL) {
      TBO.FSLBackup = SL;
    }

    const InputAction = new TInputAction();
    InputAction.OnSend = this.SaveLine;
    TInputActionManager.DynamicActionRef = InputAction;
    try {
      TBO.FSLBackup.Add('#Params');
      TBO.FSLBackup.Add('');
      TBO.FSLBackup.Add('DP.StartlistCount = ' + this.BOParams.StartlistCount.toString());
      TBO.FSLBackup.Add('DP.ITCount = ' + this.BOParams.ITCount.toString());
      TBO.FSLBackup.Add('DP.RaceCount = ' + this.BOParams.RaceCount.toString());

      // EventProps
      TBO.FSLBackup.Add('');
      TBO.FSLBackup.Add('#Event Properties');
      TBO.FSLBackup.Add('');

      this.EventProps.SaveProps(TBO.FSLBackup);

      const o: TExcelExporter = new TExcelExporter();
      o.Delimiter = ';';

      // CaptionList
      if (TColCaptions.ColCaptionBag.IsPersistent && TColCaptions.ColCaptionBag.Count > 0) {
        TBO.FSLBackup.Add('');
        o.AddSection(TableID.CaptionList, this, TBO.FSLBackup);
      }

      if (CompactFormat) {
        try {
          // NameList
          TBO.FSLBackup.Add('');
          o.AddSection(TableID.NameList, this, TBO.FSLBackup);

          // StartList
          TBO.FSLBackup.Add('');
          o.AddSection(TableID.StartList, this, TBO.FSLBackup);

          // FleetList
          if (this.EventNode.UseFleets) {
            TBO.FSLBackup.Add('');
            o.AddSection(TableID.FleetList, this, TBO.FSLBackup);
          }

          // FinishList
          TBO.FSLBackup.Add('');
          o.AddSection(TableID.FinishList, this, TBO.FSLBackup);

          // TimeList(s)
          if (this.BOParams.ITCount > 0 || this.EventProps.IsTimed) {
            TBO.FSLBackup.Add('');
            o.AddSection(TableID.TimeList, this, TBO.FSLBackup);
          }
        } catch {}
      } else {
        // Athletes
        TBO.FSLBackup.Add('');
        TBO.FSLBackup.Add('#Athletes');
        TBO.FSLBackup.Add('');

        this.BackupAthletes();

        // Startlist
        TBO.FSLBackup.Add('');
        TBO.FSLBackup.Add('#Startlist');
        TBO.FSLBackup.Add('');

        qn = this.RNode[1];
        g = this.MsgTree.Division;
        qc = qn.Collection;
        for (let i1 = 0; i1 < qc.Count; i1++) {
          qr = qc.Items[i1];
          if (qr.Bib > 0 && qr.Bib !== qr.BaseID) {
            g.Race1.Startlist.Pos(qr.BaseID).Bib(qr.Bib.toString());
          }
          if (qr.SNR > 0) {
            g.Race1.Startlist.Pos(qr.BaseID).SNR(qr.SNR.toString());
          }
        }
      }

      // Results
      for (let n = 1; n <= this.BOParams.RaceCount; n++) {
        TBO.FSLBackup.Add('');
        TBO.FSLBackup.Add('#' + this.MsgToken.cTokenRace + n.toString());
        TBO.FSLBackup.Add('');

        qn = this.RNode[n];
        g = this.MsgTree.Division;
        qc = qn.Collection;
        if (n === 1) {
          r = g.Race1;
        } else if (n > 1 && n <= this.BOParams.RaceCount) {
          r = g.Race(n);
        } else {
          r = null;
        }
        if (r == null) {
          continue;
        }
        if (!qn.IsRacing) {
          r.IsRacing(TUtils.BoolStr(false));
        }
        for (let i2 = 0; i2 < qc.Count; i2++) {
          qr = qc.Items[i2];
          if (i2 === 0 && qr.ST.TimePresent) {
            r.Bib(qr.Bib).ST(qr.ST.AsString);
          }
          if (!CompactFormat) {
            for (let t = 1; t <= this.BOParams.ITCount; t++) {
              if (qr.IT[t].OTime.TimePresent) {
                r.Bib(qr.Bib).IT(t, qr.IT[t].OTime.AsString);
              }
            }
            if (qr.FT.OTime.TimePresent) {
              r.Bib(qr.Bib).FT(qr.FT.OTime.AsString);
            }
            if (qr.MRank > 0) {
              r.Bib(qr.Bib).Rank(qr.MRank.toString());
            }
            if (this.EventNode.UseFleets) {
              const ere: TEventRaceEntry = this.EventNode.Collection.Items[i2].Race[n];
              const f: number = ere.Fleet;
              if (f > 0) {
                r.Bib(qr.Bib).FM(f.toString());
              }
            }
          }

          if (this.EventNode.UseFleets) {
            const ere: TEventRaceEntry = this.EventNode.Collection.Items[i2].Race[n];
            if (!ere.IsRacing) {
              r.Bib(qr.Bib).RV('x');
            }
          }

          if (qr.QU.AsInteger !== 0) {
            r.Bib(qr.Bib).QU(qr.QU.toString());
          }
          if (qr.DG > 0) {
            r.Bib(qr.Bib).DG(qr.DG.toString());
          }
        }
      }

      TBO.FSLBackup.Add('');
      TBO.FSLBackup.Add('EP.IM = ' + TInputModeStrings.getName(this.EventProps.InputMode));

      // Errors
      this.EventNode.ErrorList.CheckAll(this.EventNode);
      if (this.EventNode.ErrorList.HasErrors()) {
        TBO.FSLBackup.Add('');
        TBO.FSLBackup.Add('#Errors');
        TBO.FSLBackup.Add('');
        this.EventNode.ErrorList.GetMsg(TBO.FSLBackup);
      }
    } finally {
      if (SL) {
        TBO.FSLBackup = null;
      }
      TInputActionManager.DynamicActionRef = null;
    }
  }

  BackupBtnClick(): void {
    const fn: string = this.BackupDir + '_Backup.txt';
    this.Backup(fn);
  }
  RestoreBtnClick(): void {
    this.Clear();
    const fn: string = this.BackupDir + '_Backup.txt';
    this.Restore(fn);
  }

  ClearBtnClick(): void {
    this.ClearResult('');
    this.ClearList('');
    this.UpdateEventNode();
  }

  OnIdle(): void {
    this.Calc();
  }

  CopyFromRaceNode(ru: TRaceNode, MRank: boolean): void {
    const RaceIndex: number = ru.Index;
    const wl: TEventRowCollection = this.EventNode.Collection;
    const cl: TRaceRowCollection = ru.Collection;
    let wr: TEventRowCollectionItem;
    let cr: TRaceRowCollectionItem;
    for (let i = 0; i < cl.Count; i++) {
      cr = cl.Items[i];
      wr = wl.Items[i];
      // wr.Race[RaceIndex].QU = cr.QU.AsInteger;
      wr.Race[RaceIndex].Penalty.Assign(cr.QU);
      wr.Race[RaceIndex].DG = cr.DG;
      if (MRank) {
        wr.Race[RaceIndex].OTime = cr.MRank;
      } else {
        wr.Race[RaceIndex].OTime = cr.FT.ORank;
      }
    }
    wl.Node.Modified = true;
  }
  CopyToRaceNode(ru: TRaceNode): void {
    const RaceIndex: number = ru.Index;
    const wl: TEventRowCollection = this.EventNode.Collection;
    const cl: TRaceRowCollection = ru.Collection;
    let wr: TEventRowCollectionItem;
    let cr: TRaceRowCollectionItem;
    for (let i = 0; i < cl.Count; i++) {
      cr = cl.Items[i];
      wr = wl.Items[i];
      cr.QU.Assign(wr.Race[RaceIndex].Penalty);
      cr.DG = wr.Race[RaceIndex].DG;
      cr.MRank = wr.Race[RaceIndex].OTime;
    }
  }
  CopyOTimes(RaceIndex: number): void {
    const wl: TEventRowCollection = this.EventNode.Collection;
    const cl: TRaceRowCollection = this.RNode[RaceIndex].Collection;
    let wr: TEventRowCollectionItem;
    let cr: TRaceRowCollectionItem;
    for (let i = 0; i < cl.Count; i++) {
      cr = cl.Items[i];
      wr = wl.Items[i];
      cr.MRank = wr.Race[RaceIndex].OTime;
    }
  }

  InitEventNode(): void {
    for (let i = 1; i <= this.BOParams.RaceCount; i++) {
      this.CopyFromRaceNode(this.RNode[i], true);
    }
  }

  UpdateEventNode(): void {
    for (let i = 1; i <= this.BOParams.RaceCount; i++) {
      this.CopyFromRaceNode(this.RNode[i], false);
    }
  }

  UpdateRaceNodes(): void {
    for (let i = 1; i <= this.BOParams.RaceCount; i++) {
      this.CopyToRaceNode(this.RNode[i]);
    }
  }

  RebuildEventNode(): void {
    const wl: TEventRowCollection = this.EventNode.Collection;
    wl.Clear();
    const cl: TRaceRowCollection = this.RNode[0].Collection;
    let wr: TEventRowCollectionItem;
    let cr: TRaceRowCollectionItem;
    for (let i = 0; i < cl.Count; i++) {
      cr = cl.Items[i];
      wr = wl.Add();
      wr.SNR = cr.SNR;
      wr.Bib = cr.Bib;
    }
    this.UpdateEventNode();
  }

  override NewMsg(): TBaseMsg {
    return this.MsgFactory.CreateMsg();
  }

  GetIsRacing(i: number): boolean {
    if (i < 1 || i > this.RNode.length) {
      return false;
    }
    return this.RNode[i].IsRacing;
  }

  SetIsRacing(i: number, value: boolean): void {
    if (i >= 1 && i <= this.RNode.length) {
      this.RNode[i].IsRacing = value;
    }
  }

  FindRaceIndex(roName: string): number {
    if (roName.startsWith('W')) {
      return -1;
    }
    const s = roName.substring(1);
    const i = TUtils.StrToIntDef(s, -1);
    if (i < 1 || i > this.BOParams.RaceCount) {
      return -1;
    }
    return i;
  }

  GetRunIsRacing(RunID: string): boolean {
    const i = this.FindRaceIndex(RunID);
    if (i > -1) {
      return this.GetIsRacing(i);
    }
    return false;
  }

  SetRunIsRacing(RunID: string, value: boolean) {
    const i = this.FindRaceIndex(RunID);
    if (i > -1) {
      this.SetIsRacing(i, value);
    }
  }

  EditQU(raceIndex: number, crIndex: number, value: string) {
    this.PenaltyService.Clear();
    this.PenaltyService.Parse(value);
    this.SetPenalty(raceIndex, crIndex, this.PenaltyService);
  }

  EditDG(raceIndex: number, crIndex: number, value: string) {
    const t = TUtils.StrToIntDef(value, -1);
    if (t > -1) {
      this.SetDG(raceIndex, crIndex, t);
    }
  }

  EditOTime(raceIndex: number, crIndex: number, value: string) {
    const t = TUtils.StrToIntDef(value, -1);
    if (t > -1) {
      this.SetOT(raceIndex, crIndex, t);
    }
  }

  BackupPenalties(SL: TStringList, n: number): void {
    // let InputAction: TInputAction;
    let g: TDivision;
    let r: TRun;

    let qn: TRaceNode;
    let qc: TRaceRowCollection;
    let qr: TRaceRowCollectionItem;

    this.UpdateRaceNodes();

    if (SL) {
      TBO.FSLBackup = SL;
    }

    const InputAction = new TInputAction();
    InputAction.OnSend = this.SaveLine;
    TInputActionManager.DynamicActionRef = InputAction;
    try {
      qn = this.RNode[n];
      g = this.MsgTree.Division;
      qc = qn.Collection;
      if (n === 1) {
        r = g.Race1;
      } else if (n > 1 && n <= this.BOParams.RaceCount) {
        r = g.Race(n);
      } else {
        r = null;
      }
      if (r) {
        if (!qn.IsRacing) {
          r.IsRacing(TUtils.BoolStr(false));
        }
        for (let i = 0; i < qc.Count; i++) {
          qr = qc.Items[i];
          if (i === 0 && qr.ST.TimePresent) {
            r.Bib(qr.Bib).ST(qr.ST.AsString);
          }

          if (this.EventNode.UseFleets) {
            const ere: TEventRaceEntry = this.EventNode.Collection.Items[i].Race[n];
            if (!ere.IsRacing) {
              r.Bib(qr.Bib).RV('x');
            }
          }

          if (qr.QU.AsInteger !== 0) {
            r.Bib(qr.Bib).QU(qr.QU.toString());
          }
          if (qr.DG > 0) {
            r.Bib(qr.Bib).DG(qr.DG.toString());
          }
        }
      }
    } finally {
      if (SL) {
        TBO.FSLBackup = null;
      }
      TInputActionManager.DynamicActionRef = null;
    }
  }

  findCurrentInRace(result: CurrentNumbers): CurrentNumbers {
    const rc = this.EventNode.RaceCount;
    const tc = this.BOParams.ITCount;

    const foo: number[] = [];
    for (let j = 1; j <= tc; j++) {
      foo.push(j);
    }
    foo.push(0); // finish time point at index 0 is last time point in race

    let rn: TRaceNode;
    let cl: TRaceRowCollectionItem[];
    let cr: TRaceRowCollectionItem;
    let tp: TTimePoint;
    let it: number;
    for (let r = rc; r > 0; r--) {
      rn = this.RNode[r];
      if (rn.IsRacing) {
        for (let t = tc; t >= 0; t--) {
          it = foo[t];
          cl = rn.Collection.Items;
          result.clear();
          for (cr of cl) {
            tp = cr.IT[it]; // access in correct order from last time point to first
            if (tp.OTime.TimePresent || cr.QU.IsOut) {
              result.race = r;
              result.tp = it;
              result.bib = cr.Bib;
              if (tp.OTime.TimePresent) {
                result.withTime++;
              }
              if (cr.QU.IsOut) {
                result.withPenalty++;
              }
              result.withTimeOrPenalty++;
            }
          }
          if (result.withTimeOrPenalty > 0) {
            // result is dirty, something was found, a result should be returned from here, exit the loop with a result.

            if (result.withTimeOrPenalty === cl.length) {
              // This time point is complete, let's figure out what comes next, before we return.

              if (it === 0 && result.race < rc) {
                // this is the finish time point, the last time point in current race,
                // jump to the first time point in next race.
                result.race++;
                result.tp = 1;
              } else if (it === 0 && result.race === rc) {
                // do nothing, we are at the finish of the last race in the series
              } else if (it < tc) {
                // advance to the next time point in this race
                result.tp++;
              } else if (it === tc) {
                // the finish time point is special, it is at index zero
                result.tp = 0;
                // we are still just advancing to the next time point in the race, the finish!
              }
            }
            return result;
          }
        }
      }
    }
    result.race = 1;
    if (tc > 0) {
      // && bo.EventProps.IsTimed
      result.tp = 1;
    }
    return result;
  }

  findCurrentInEvent(result: CurrentNumbers): CurrentNumbers {
    const rc = this.EventNode.RaceCount;
    const tc = this.BOParams.ITCount;

    const en: TEventNode = this.EventNode;
    let cl: TEventRowCollectionItem[];
    let cr: TEventRowCollectionItem;
    let tp: TEventRaceEntry;
    for (let r = rc; r > 0; r--) {
      for (let t = tc; t >= 0; t--) {
        cl = en.Collection.Items;
        result.clear();
        for (cr of cl) {
          tp = cr.Race[r];
          if (tp.IsRacing) {
            if (tp.OTime > 0 || tp.Penalty.IsOut) {
              result.race = r;
              result.bib = cr.Bib;
              if (tp.OTime > 0) {
                result.withTime++;
              }
              if (tp.Penalty.IsOut) {
                result.withPenalty++;
              }
              result.withTimeOrPenalty++;
            }
          }
        }
        if (result.withTimeOrPenalty) {
          if (result.withTimeOrPenalty === cl.length) {
            if (r < rc) {
              result.race++;
            }
          }
          return result;
        }
      }
    }
    result.race = 1;
    return result;
  }

  tryToggleStrict() {
    if (this.StrictInputMode) {
      this.EventProps.InputMode = TInputMode.Relaxed;
    } else {
      this.EventProps.InputMode = TInputMode.Strict;
    }
    this.BOManager.BO.updateStrictInputMode();
  }

  updateStrictInputMode(): void {
    this.StrictInputMode = this.EventProps.InputMode === TInputMode.Strict;
  }

  toggleUseQueue() {
    this.UseQueue = !this.UseQueue;
  }

  markBib() {
    const bo = this.BOManager.BO;
    bo.EventBO.CurrentRow = bo.EventNode.FindBib(this.CurrentBib);
    const ru = bo.RNode[this.CurrentRace];
    if (ru) {
      ru.ColBO.CurrentRow = ru.FindBib(this.CurrentBib);
    }
  }
}
