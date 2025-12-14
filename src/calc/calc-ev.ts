import { TBO } from '../fr/fr-bo';
import { TIniImage } from '../fr/fr-ini-image';
import { TStringList } from '../util/fb-strings';
import { TCalcEventProxy } from './calc-event-proxy';
import { TCalcEventProxy01 } from './calc-rs-01';
import { TCalcEventProxy11 } from './calc-rs-03';
import { TUniquaPoints } from './calc-uniqua-points';
import { TEventNode } from '../col/event/event-row-collection';

export class TCalcEvent {
  static readonly ScoringProviderSimpleTest = 1;
  static readonly ScoringProviderInline = 2;

  static readonly DefaultScoringProviderID = 2;

  private FProxy: TCalcEventProxy;
  protected FProviderID = 0;

  private UniquaPoints: TUniquaPoints;

  constructor(
    private IniImage: TIniImage,
    private BO: TBO,
    aProviderID: number,
  ) {
    if (aProviderID === 0) {
      this.ProviderID = TCalcEvent.DefaultScoringProviderID;
    }

    this.InitModule(aProviderID);

    this.UniquaPoints = new TUniquaPoints(BO);
  }

  protected get ProviderID(): number {
    return this.FProviderID;
  }
  protected set ProviderID(value: number) {
    this.FProviderID = value;
    // #if Desktop
    this.IniImage.ScoringProvider = value; // keep Inifile uptodate
    // #endif
  }

  Calc(aqn: TEventNode): void {
    this.FProxy.Calc(aqn);
    this.UniquaPoints.Calc(aqn);
  }

  GetScoringNotes(SL: TStringList) {
    this.FProxy.GetScoringNotes(SL);
  }

  get Proxy(): TCalcEventProxy {
    return this.FProxy;
  }

  get ModuleType(): number {
    return this.FProviderID;
  }
  set ModuleType(value: number) {
    if (value !== this.FProviderID) {
      this.InitModule(value);
    }
  }

  get ScoringResult(): boolean {
    return TCalcEventProxy.ScoringResult !== -1;
  }

  get ScoringExceptionMessage(): string {
    return '';
  }

  InitModule(aProviderID: number): void {
    if (!this.FProxy || aProviderID !== this.ProviderID) {
      try {
        this.ProviderID = aProviderID;
        this.FProxy = null;
        switch (aProviderID) {
          case TCalcEvent.ScoringProviderSimpleTest:
            this.FProxy = new TCalcEventProxy01();
            break;

          case TCalcEvent.ScoringProviderInline:
            this.FProxy = new TCalcEventProxy11(this.BO);
            break;

          default:
            this.ProviderID = TCalcEvent.ScoringProviderSimpleTest;
            this.FProxy = new TCalcEventProxy01();
            break;
        }
      } catch (ex) {
        console.log(ex.Message);
        TCalcEventProxy.ScoringResult = -1;
        TCalcEventProxy.ScoringExceptionLocation = 'TCalcEvent.InitModule';
        TCalcEventProxy.ScoringExceptionMessage = ex.Message;
        this.ProviderID = TCalcEvent.ScoringProviderSimpleTest;
        this.FProxy = new TCalcEventProxy01();
      }

      // #if Desktop
      // EventNode is ungleich null, wenn mit GUI ScoringProvider geändert wird.
      // Alles ist noch null, wenn BOContainer oder BO erzeugt wird,
      // dann muß GUI-Update aber auch hier nicht angestoßen werden.
      if (this.BO != null) {
        if (this.BO.EventNode != null) {
          this.BO.EventNode.Modified = true;
          // TMain.DrawNotifier.ScheduleFullUpdate(
          // null, new DrawNotifierEventArgs(DrawNotifierEventArgs.DrawTargetEvent));
        }
      }
      // #endif
    }
  }

  get UsesProxy(): boolean {
    switch (this.ModuleType) {
      case TCalcEvent.ScoringProviderSimpleTest:
        return false;
      case TCalcEvent.ScoringProviderInline:
        return false;
      default:
        return false;
    }
  }
}
