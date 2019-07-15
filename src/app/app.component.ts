import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BibComponent } from './bib/bib.component';
import { EventComponent } from './event/event.component';
import { RaceComponent } from './race/race.component';
import { EntriesComponent } from './entries/entries.component';
import { TimingWidgetComponent } from './timing-widget/timing-widget.component';
import { TBOManager } from '../bo/bo-manager';
import { IEventDataItem, TEventDataAsset } from './shared/test-data';
import { TStringList } from '../util/fb-strings';
import { EventMenuComponent } from './event-menu/event-menu.component';
import { TimingButtonsComponent } from './timing-buttons/timing-buttons.component';
import { EventProps, EntryRow, EventParams } from './shared/data-model';
import { TExcelExporter } from '../fr/fr-excel-export';
import { TableID } from '../fr/fr-excel-importer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrentNumbers } from '../fr/fr-bo';
import { BreakpointSet } from './shared/breakpoint-set';
import { IconData, PreTextIcons, TextAreaIcons } from './icon-legend/icon-data';
import { HttpParams } from '@angular/common/http';
import { ApiComponent } from './api/api.component';
import { ConnectionControlComponent } from './connection-control/connection-control.component';

enum Page {
  None,
  Bib,
  Input,
  Entries,
  Race,
  Event,
  Params,
  Props,
  Entry,
  TextArea,
  PreText,
  AssetMenu,
  EventMenu,
  HelpText,
  JsonInfo,
  Legend,
  Save,
  Load
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FR03A1';

  more = false;
  wantInput = true;
  wantOutput = true;

  lastWebSocketMsg = 'LastWebSocketMsg';

  autoSaveParamsKey = 'fr03-app-params';
  autoSaveOptionsKey = 'fr03-app-options';
  autoSaveDataKey = 'fr03-app-data';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  CurrentPage: Page = Page.Event;

  Throwouts = 0;

  MemoText = '';
  TestOutput = '';

  ShortMode = true;

  RowsVisible = false;

  TableRowVisible = false;
  ResetRowVisible = false;
  ThrowoutsRowVisible = false;
  FormsRowVisible = false;
  ClearingRowVisible = false;

  LinkButtonVisible = false;

  ApiVisible = true;
  ConnVisible = true;

  IconBarVisible = false;
  ExplorerBarVisible = false;
  ExplorerLineVisible = false;
  ButtonPanelVisible = true;

  InputVisible = true;
  BibVisible = false;
  EntriesVisible = false;
  RaceVisible = true;
  EventVisible = false;

  TextAreaVisible = false;
  PreTextVisible = false;

  AssetMenuVisible = false;
  EventMenuVisible = false;
  HelpTextVisible = false;
  JsonInfoVisible = false;
  LegendVisible = false;
  TextAreaLegendVisible = false;
  PreTextLegendVisible = false;

  ParamsVisible = false;
  PropsVisible = false;

  EntryVisible = false;

  SaveVisible = false;
  LoadVisible = false;

  @ViewChild('eventTab', { static: false })
  eventTab: EventComponent;

  @ViewChild('raceTab', { static: false })
  raceTab: RaceComponent;

  @ViewChild('entriesTab', { static: false })
  entriesTab: EntriesComponent;

  @ViewChild('widgetTab', { static: false })
  widgetTab: TimingWidgetComponent;

  @ViewChild('timingTab', { static: false })
  timingTab: TimingButtonsComponent;

  @ViewChild('menuTab', { static: false })
  menuTab: EventMenuComponent;

  @ViewChild('bibInfo', { static: false })
  bibTab: BibComponent;

  @ViewChild('connBar', { static: false })
  connBar: ConnectionControlComponent;

  @ViewChild('apiBar', { static: false })
  apiBar: ApiComponent;

  private SL: TStringList;
  private Asset: IEventDataItem;

  columns = 4;

  break6 = false;
  break9 = false;
  break11 = false;
  breakText = '';

  wantAllInputIcons = false;

  isSmall = false;
  isXSmall: boolean;

  breakpointSet: BreakpointSet = new BreakpointSet();

  readonly breakpointsMap = new Map([
    ['xs', 6],
    ['sm', 6],
    ['md', 9],
    ['lg', 11],
    ['xl', 16],
  ]);

  textAreaIcons: IconData[];
  preTextIcons: IconData[];

  constructor(private cdref: ChangeDetectorRef, public BOManager: TBOManager,
              private breakpointObserver: BreakpointObserver, public snackBar: MatSnackBar) {
    this.BOManager.BigButtonRow = false;
    this.BOManager.IsDebug = false;
    this.SL = new TStringList();
    this.Asset = new TEventDataAsset();
    this.updateThrowouts();
    this.BOManager.BO.updateStrictInputMode();
    this.BOManager.BO.EventProps.EventName = 'Event Name';
    this.initCurrent();
    this.textAreaIcons = IconData.readIconData(TextAreaIcons);
    this.preTextIcons = IconData.readIconData(PreTextIcons);
  }

  breakpointChanged(state: BreakpointState) {
    this.breakpointSet.test(this.breakpointObserver);
    this.columns = this.breakpointsMap.get(this.breakpointSet.id);
    this.updateBreaks();
  }

  updateBreaks() {
    if (this.breakpointSet.HandsetPortrait) {
      this.break6 = true;
      this.break9 = false;
      this.break11 = false;
      this.wantAllInputIcons = false;
      this.breakText = 'HandsetPortrait';
    } else if (this.breakpointSet.HandsetLandscape) {
      this.break6 = false;
      this.break9 = false;
      this.break11 = true;
      this.wantAllInputIcons = false;
      this.breakText = 'HandsetLandscape';
    } else if (this.breakpointSet.TabletPortrait) {
      this.break6 = false;
      this.break9 = false;
      this.break11 = true;
      this.wantAllInputIcons = true;
      this.breakText = 'TabletPortrait';
    } else if (this.breakpointSet.TabletLandscape) {
      this.break6 = false;
      this.break9 = false;
      this.break11 = false;
      this.wantAllInputIcons = false;
      this.breakText = 'TabletPortrait';
    } else if (this.breakpointSet.WebPortrait) {
      this.break6 = false;
      this.break9 = false;
      this.break11 = true;
      this.wantAllInputIcons = true;
      this.breakText = 'WebPortrait';
    } else if (this.breakpointSet.WebLandscape) {
      this.break6 = false;
      this.break9 = false;
      this.break11 = false;
      this.wantAllInputIcons = true;
      this.breakText = 'WebLandscape';
    } else {
      this.break6 = this.columns === 6;
      this.break9 = this.columns === 9;
      this.break11 = this.columns === 11;
      this.wantAllInputIcons = this.columns > 9;
      this.breakText = 'BreakpointMap';
    }
  }

  handleBreakpointSmall(state: BreakpointState) {
    this.isSmall = state.matches;
  }

  handleBreakpointXSmall(state: BreakpointState) {
    this.isXSmall = state.matches;
  }

  ngOnInit() {
    this.initParams();

    this.breakpointObserver.observe(Breakpoints.Small).subscribe(
      (state: BreakpointState) => { this.handleBreakpointSmall(state); }
    );
    this.breakpointObserver.observe(Breakpoints.XSmall).subscribe(
      (state: BreakpointState) => { this.handleBreakpointSmall(state); }
    );

    this.breakpointObserver.observe(this.breakpointSet.all()).subscribe(
      (state: BreakpointState) => { this.breakpointChanged(state); }
    );
  }

  autoLoad() {
    const t = localStorage.getItem(this.autoSaveDataKey);
    if (t === undefined) {
      // do nothing
    } else if (t === null) {
      // do nothing
    } else if (t === '') {
      // do nothing
    } else {
      const edi = new IEventDataItem();
      edi.EventData = t;
      edi.EventName = '';
      this.NewEventData = edi;
    }
  }

  autoSave() {
    const SL = new TStringList();
    this.BOManager.BO.BackupToSLCompact(SL, true);
    localStorage.setItem(this.autoSaveDataKey, SL.Text);
  }

  get EventName(): string { return this.BOManager.BO.EventProps.EventName; }

  updateThrowouts(): void {
    this.Throwouts = this.BOManager.BO.EventProps.Throwouts;
  }

  collaps() {
    this.reduceTo(Page.None);
  }

  reduceToNone() {
    this.reduceTo(Page.None);
  }

  reduceToBib() {
    this.reduceTo(Page.Bib);
  }

  reduceToInput() {
    this.reduceTo(Page.Input);
  }

  reduceToEntries() {
    this.EntryVisible = true;
    this.reduceTo(Page.Entries);
  }

  reduceToRace() {
    this.reduceTo(Page.Race);
  }

  reduceToEvent() {
    this.reduceTo(Page.Event);
  }

  reduceToPreText() {
    this.reduceTo(Page.PreText);
  }

  reduceToTextArea() {
    this.reduceTo(Page.TextArea);
  }

  reduceToAssetMenu() {
    this.reduceTo(Page.AssetMenu);
  }

  reduceToEventMenu() {
    this.reduceTo(Page.EventMenu);
  }

  reduceToHelpText() {
    this.reduceTo(Page.HelpText);
  }

  reduceToParams() {
    this.reduceTo(Page.Params);
  }

  reduceToProps() {
    this.reduceTo(Page.Props);
  }

  reduceToEntry() {
    this.reduceTo(Page.Entry);
  }

  reduceToJsonInfo() {
    this.reduceTo(Page.JsonInfo);
  }

  reduceToLegend() {
    this.reduceTo(Page.Legend);
  }

  reduceToSave() {
    this.reduceTo(Page.Save);
  }

  reduceToLoad() {
    this.reduceTo(Page.Load);
  }

  toggleBib() {
    this.BibVisible = !this.BibVisible;
  }

  toggleEntries() {
    this.EntriesVisible = !this.EntriesVisible;
  }

  toggleRace() {
    this.RaceVisible = !this.RaceVisible;
  }

  toggleEvent() {
    this.EventVisible = !this.EventVisible;
  }

  togglePreText() {
    this.PreTextVisible = !this.PreTextVisible;
  }

  toggleTextArea() {
    this.TextAreaVisible = !this.TextAreaVisible;
  }

  toggleAssetMenu() {
    this.AssetMenuVisible = !this.AssetMenuVisible;
  }

  toggleEventMenu() {
    this.EventMenuVisible = !this.EventMenuVisible;
  }

  toggleHelpText() {
    this.HelpTextVisible = !this.HelpTextVisible;
  }

  toggleParams() {
    this.ParamsVisible = !this.ParamsVisible;
  }

  toggleProps() {
    this.PropsVisible = !this.PropsVisible;
  }

  toggleJsonInfo() {
    this.JsonInfoVisible = !this.JsonInfoVisible;
  }

  toggleLegend() {
    this.LegendVisible = !this.LegendVisible;
    this.TextAreaLegendVisible = false;
    this.PreTextLegendVisible = false;
    if (this.eventTab && this.EventVisible) {
      this.eventTab.LegendVisible = false;
    }
    if (this.raceTab && this.RaceVisible) {
      this.raceTab.LegendVisible = false;
    }
    if (this.entriesTab && this.EntriesVisible) {
      this.entriesTab.LegendVisible = false;
    }
  }

  toggleTextAreaLegend() {
    this.TextAreaLegendVisible = !this.TextAreaLegendVisible;
  }

  togglePreTextLegend() {
    this.PreTextLegendVisible = !this.PreTextLegendVisible;
  }

  toggleInput() {
    this.InputVisible = !this.InputVisible;
  }

  reduceTo(p: Page = Page.Event) {
    this.CurrentPage = p;

    this.BibVisible = false;
    this.EntriesVisible = false;
    this.RaceVisible = false;
    this.EventVisible = false;
    this.ParamsVisible = false;
    this.PropsVisible = false;

    this.TextAreaVisible = false;
    this.PreTextVisible = false;
    this.HelpTextVisible = false;
    this.JsonInfoVisible = false;
    this.LegendVisible = false;
    this.TextAreaLegendVisible = false;
    this.PreTextLegendVisible = false;

    this.AssetMenuVisible = false;
    this.EventMenuVisible = false;

    this.EntryVisible = false;
    this.SaveVisible = false;
    this.LoadVisible = false;

    switch (p) {
      case Page.Bib: this.BibVisible = true; break;

      case Page.Entry:
        this.EntryVisible = true;
        this.EntriesVisible = true;
        break;

      case Page.Entries: this.EntriesVisible = true; break;
      case Page.Race: this.RaceVisible = true; break;
      case Page.Event: this.EventVisible = true; break;

      case Page.Params: this.ParamsVisible = true; break;
      case Page.Props: this.PropsVisible = true; break;
      case Page.TextArea: this.TextAreaVisible = true; break;
      case Page.PreText: this.PreTextVisible = true; break;
      case Page.AssetMenu: this.AssetMenuVisible = true; break;
      case Page.EventMenu: this.EventMenuVisible = true; break;
      case Page.HelpText: this.HelpTextVisible = true; break;
      case Page.JsonInfo: this.JsonInfoVisible = true; break;
      case Page.Legend: this.LegendVisible = true; break;
      case Page.Save: this.SaveVisible = true; break;
      case Page.Load: this.LoadVisible = true; break;

      default: break;
    }
  }

  raceDeltaBtnClick(delta: number) {
    this.processQueue(false);
    const temp = this.CurrentRace + delta;
    const rc = this.BOManager.BO.BOParams.RaceCount;
    if (temp >= 1 && temp <= rc) {
      this.CurrentRace = temp;
    }
    if (temp === 0) {
      this.CurrentRace = rc;
    }
    if (temp > rc) {
      this.CurrentRace = 1;
    }
    this.updateFabs();
  }

  timepointDeltaBtnClick(delta: number) {
    this.processQueue(false);
    const temp = this.CurrentTP + delta;
    const itc = this.BOManager.BO.BOParams.ITCount;
    if (temp >= 0 && temp <= itc) {
      this.CurrentTP = temp;
    }
    if (temp === -1) {
      this.CurrentTP = itc;
    }
    if (temp > itc) {
      this.CurrentTP = 0;
    }
    this.updateFabs();
  }

  timepointFTBtnClick() {
    this.processQueue(false);
    this.CurrentTP = 0;
  }

  enableRaceBtnClick() {
    const r = this.CurrentRace;
    const cr = this.BOManager.BO.EventNode.Collection.Items[0];
    if (cr) {
      this.BOManager.BO.EventBO.EditRaceValue(cr, '$', 'colR_' + r);
      this.BOManager.BO.EventNode.Modified = true;
      this.calcEvent();
      this.updateBib();
    }
  }

  clearRaceBtnClick() {
    const r = this.CurrentRace;
    const bo = this.BOManager.BO;
    bo.EventNode.Collection.ResetRace(r);

    bo.RNode[r].Collection.ClearResult();
    bo.RNode[r].Modified = true;

    this.calcRace();
    this.calcEvent();
    this.updateBib();
    this.updateFabs();
  }

  clearTimepointBtnClick() {
    const r = this.CurrentRace;
    const bo = this.BOManager.BO;
    bo.EventNode.Collection.ResetRace(r);

    bo.RNode[r].Collection.ClearTP(this.CurrentTP);
    bo.RNode[r].Modified = true;

    this.calcRace();
    this.calcEvent();
    this.updateBib();
    this.updateFabs();
  }

  resetBtnClick() {
    this.reduceTo(Page.None);

    this.readEmpty();

    this.Auto = true;
    this.WantUpdateEvent = true;

    this.initCurrent();
    this.showFabs();

    this.cdref.detectChanges();

    this.reduceTo(Page.Race);
  }

  exampleBtnClick() {
    this.reduceTo(Page.Event);

    this.readExample();
  }

  assetBtnClick(ev: number) {
    this.reduceTo(Page.Event);

    switch (ev) {
      case 1: this.readNameTest(); break;
      case 2: this.readFleetTest(); break;

      case 3: this.read1991(); break;
      case 4: this.read1997(); break;

      case 5: this.readExample(); break;
      default: this.readEmpty(); break;
    }

  }

  clearBtnClick() {
    const BO = this.BOManager.BO;
    BO.ClearResult('');
    BO.StammdatenNode.Collection.ClearList();
    this.showEvent();
    this.showRace();
    this.showEntries();
    this.updateBib();
    this.updateFabs();
  }

  onBibChanged(event: number) {
    this.CurrentBib = event;
    this.markBibAndShow();
  }

  onEntriesTableChanged(event: number) {
    this.showEvent();
    this.showRace();
    this.updateBib();
  }

  onDataAvailable(event: IEventDataItem) {
    this.NewEventData = event;
    this.reduceTo(Page.Event);
  }

  onRaceDataAvailable(data: string[]) {
    for (const s of data) {
      this.BOManager.BO.Dispatch(s);
    }

    this.calcRace();
    this.calcEvent();
  }

  onDataLoaded(event: IEventDataItem) {
    this.NewEventData = event;
    this.reduceTo(Page.Event);
  }

  onPropsChanged(event: EventProps) {
    this.BOManager.BO.EventProps.EventName = event.eventName;
    this.BOManager.BO.EventProps.ScoringSystem = event.scoringSystem;
    this.BOManager.BO.EventProps.SchemaCode = event.schemaCode;
    this.BOManager.BO.EventProps.IsTimed = event.isTimed;
    this.calcEvent();
    this.reduceTo(Page.Event);
  }

  onParamsChanged(event: EventParams) {
    if (event.createOption === 0) {
      this.createNew(event);
    } else {
      this.recreateEvent(event);
    }
    this.reduceTo(Page.Event);
  }

  /**
   * When row with snr was deleted, update all views that depend on StammdatenTabelle.
   * @param event snr that was deleted
   */
  onEntryDeleted(event: number) {
    this.showEntries();
    this.showEvent();
    this.showRace();
    this.updateBib();
  }

  onEntryRowChanged(event: EntryRow) {
    if (event.SNR && event.SNR > 0) {
      const cl = this.BOManager.BO.StammdatenNode.Collection;
      let cr = cl.FindKey(event.SNR);
      if (!cr && cl.Count < 200) {
        cr = cl.Add();
        cr.SNR = event.SNR;
      }

      if (cr) {

        cr.FN = event.N1 || '';
        cr.LN = event.N2 || '';
        cr.SN = event.N3 || '';
        cr.NC = event.N4 || '';
        cr.GR = event.N5 || '';
        cr.PB = event.N6 || '';

        this.showEntries();
        this.showEvent();
        this.showRace();
        this.updateBib();
      }
    }
  }

  updateBib() {
    if (this.bibTab) {
      this.bibTab.update();
    }
  }

  showEntries() {
    if (this.EntriesVisible) {
      this.entriesTab.show();
    }
  }

  showRace() {
    if (this.raceTab) {
      this.raceTab.mark(this.CurrentBib);
      this.raceTab.show();
    }
  }

  calcRace() {
    if (this.raceTab && this.RaceVisible) {
      this.raceTab.calc();
    }
  }

  showEvent() {
    if (this.EventVisible) {
      this.eventTab.mark(this.CurrentBib);
      this.eventTab.show();
    }
  }

  calcEvent() {
    this.BOManager.BO.EventNode.Modified = true;
    this.BOManager.BO.Calc();
    this.showEvent();
  }

  updateAll() {
    this.showEntries();
    this.calcEvent();
    this.calcRace();
    this.updateBib();
  }

  memoAsset() {
    if (this.Asset.EventData !== '') {
      this.MemoText = this.Asset.EventData;
    } else {
      this.MemoText = this.info('Asset.EventData is empty');
    }
  }

  memoConvertedData() {
    if (this.BOManager.BO.ConvertedData) {
      this.MemoText = this.BOManager.BO.ConvertedData;
    } else {
      this.MemoText = this.info('BO.ConvertedData is empty');
    }
  }

  memoText(compact: boolean) {
    this.SL.Clear();
    this.BOManager.BO.BackupToSLCompact(this.SL, compact);
    this.MemoText = this.SL.Text;
  }

  memoRead() {
    const a = new TEventDataAsset();
    a.EventName = 'Textarea Asset';
    a.EventData = this.MemoText;
    this.NewEventData = a;
  }

  memoClear() {
    this.MemoText = '';
  }

  showConvertedData() {
    if (this.BOManager.BO.ConvertedData) {
      this.TestOutput = this.BOManager.BO.ConvertedData;
    } else {
      this.TestOutput = this.info('BO.ConvertData is empty');
    }
  }

  getTxtBackup(compact: boolean) {
    this.SL.Clear();
    this.BOManager.BO.BackupToSLCompact(this.SL, compact);
    this.TestOutput = this.SL.Text;
  }

  showSomething(n: number) {
    switch (n) {
      case 0:
        const ee: TExcelExporter = new TExcelExporter();
        this.TestOutput = ee.GetString(TableID.ResultList, this.BOManager.BO);
        break;

      case 1:
        const o = this.BOManager.BO.EventNode.FindBib(this.CurrentBib).Race[this.CurrentRace].inspect();
        this.TestOutput = JSON.stringify(o, null, 2);
        break;

      case 3:
        if (this.menuTab) {
          this.TestOutput = this.menuTab.printEventMenu();
        } else {
          this.TestOutput = this.info('click on button while event menu is shown');
        }
        break;
    }
  }

  clearTextOutput() {
    this.SL.Clear();
    this.TestOutput = '';
  }

  readEmpty() {
    const a = new TEventDataAsset();
    a.init_DefaultEmpty();
    this.NewEventData = a;
  }

  readExample() {
    const a = new TEventDataAsset();
    a.init_DefaultExample();
    this.NewEventData = a;
  }

  readNameTest() {
    const a = new TEventDataAsset();
    a.init_NameTest();
    this.NewEventData = a;
  }

  readFleetTest() {
    const a = new TEventDataAsset();
    a.init_FleetTest();
    this.NewEventData = a;
  }

  read1991() {
    const a = new TEventDataAsset();
    a.init_1991();
    this.NewEventData = a;
  }

  read1997() {
    const a = new TEventDataAsset();
    a.init_1997();
    this.NewEventData = a;
  }

  set NewEventData(value: IEventDataItem) {
    this.resetCurrent();

    // clear Queue, but do not 'update fabs'
    this.BOManager.BO.msgQueueR = [];
    this.BOManager.BO.msgQueueE = [];

    // do actual loading
    this.BOManager.LoadNew(value.EventData);

    // save input
    this.Asset = value;

    const bo = this.BOManager.BO;

    this.Auto = true;
    this.WantUpdateEvent = true;
    this.updateThrowouts();
    this.BOManager.BO.updateStrictInputMode();

    // init Current (try to find it), without updating fabs
    let rr = new CurrentNumbers();
    rr = bo.findCurrentInRace(rr);

    let re = new CurrentNumbers();
    re = bo.findCurrentInEvent(re);

    if (re.race === rr.race) {
      this.assignCurrent(rr);
    } else {
      if (rr.tp === 0) {
        this.assignCurrent(re);
      } else {
        this.assignCurrent(rr);
      }
    }

    // calc
    bo.RNode[this.CurrentRace].Modified = true;
    bo.Calc();

    // show
    if (this.eventTab && this.EventVisible) {
      this.eventTab.initAndShow();
    }
    if (this.entriesTab && this.EntriesVisible) {
      this.entriesTab.initAndShow();
    }
    if (this.raceTab && this.RaceVisible) {
      this.raceTab.initRaceAndTimePoint(this.CurrentRace, this.CurrentTP);
      this.raceTab.initAndShow();
    }
    if (this.bibTab) {
      this.bibTab.update();
    }
    if (this.timingTab) {
      this.timingTab.clear();
      this.timingTab.Auto = true;
      this.timingTab.update();
    }
  }

  private info(msg: string): string {
    return '// ' + new Date().toLocaleTimeString() + ' - ' + msg;
  }

  bow(delta: number) {
    let b = this.CurrentBib + delta;
    if (b < 1) {
      // b = 1;
      b = this.BOManager.BO.EventNode.Collection.Count;
    }
    if (b > this.BOManager.BO.EventNode.Collection.Count) {
      // b = this.BOManager.BO.EventNode.Collection.Count;
      b = 1;
    }
    this.CurrentBib = b;
    this.markBibAndShow();
  }

  throwOut(delta: number) {
    const bo = this.BOManager.BO;
    const n = bo.EventProps.Throwouts + delta;
    this.NumberOfThrowoutsChanged(n);
  }

  private NumberOfThrowoutsChanged(value: number): boolean {
    const bo = this.BOManager.BO;
    if (!bo) {
      return false;
    } else if (value >= bo.BOParams.RaceCount) {
      return false;
    } else if (value < 0) {
      return false;
    } else if (bo.EventProps.Throwouts !== value) {
      bo.EventProps.Throwouts = value;
      this.updateThrowouts();
      this.calcEvent();
    }
    return true;
  }

  showFabs() {
    if (this.timingTab) {
      this.timingTab.show();
    }
  }

  updateFabs() {
    if (this.timingTab) {
      this.timingTab.update();
    }
  }

  updateEvent() {
    const ru = this.BOManager.BO.RNode[this.CurrentRace];
    this.BOManager.BO.CopyFromRaceNode(ru, false);
    this.showEvent();
    this.updateFabs();
  }

  toggleButtonPanel() {
    this.ButtonPanelVisible = !this.ButtonPanelVisible;
    if (this.ButtonPanelVisible) {
      this.ShortMode = this.ExplorerBarVisible; // remember
      this.IconBarVisible = false;
      this.ExplorerBarVisible = false;
    } else {
      this.IconBarVisible = !this.ShortMode;
      this.ExplorerBarVisible = this.ShortMode;
    }
  }

  toggleIconBar() {
    this.IconBarVisible = !this.IconBarVisible;
    this.ExplorerBarVisible = !this.IconBarVisible;
  }

  toggleExplorerBar() {
    this.ExplorerBarVisible = !this.ExplorerBarVisible;
    this.IconBarVisible = !this.IconBarVisible;
  }

  toggleExplorerLine() {
    this.ExplorerLineVisible = !this.ExplorerLineVisible;
  }

  toggleBigButtonRow() {
    this.BOManager.BigButtonRow = !this.BOManager.BigButtonRow;
  }

  toggleDebug() {
    this.BOManager.IsDebug = !this.BOManager.IsDebug;
  }

  toggleResetRow() {
    this.ResetRowVisible = !this.ResetRowVisible;
  }

  toggleThrowoutsRow() {
    this.ThrowoutsRowVisible = !this.ThrowoutsRowVisible;
  }

  toggleFormsRow() {
    this.FormsRowVisible = !this.FormsRowVisible;
  }

  toggleClearingRow() {
    this.ClearingRowVisible = !this.ClearingRowVisible;
  }

  toggleTableRow() {
    this.TableRowVisible = !this.TableRowVisible;
  }

  toggleRows() {
    this.RowsVisible = !this.RowsVisible;

    this.TableRowVisible = this.RowsVisible;
    this.ResetRowVisible = this.RowsVisible;
    this.ThrowoutsRowVisible = this.RowsVisible;
    this.FormsRowVisible = this.RowsVisible;
    this.ClearingRowVisible = this.RowsVisible;
  }

  ensureEvent() {
    if (!this.EventVisible) {
      this.EventVisible = true;
    }
  }

  ensureRace() {
    if (!this.RaceVisible) {
      this.RaceVisible = true;
    }
  }

  ensureBib() {
    if (!this.BibVisible) {
      this.BibVisible = true;
    }
  }

  get timed(): boolean {
    return this.BOManager.BO.EventProps.IsTimed;
  }

  isTimed() {
    return this.timed;
  }

  memoCopy(memo: HTMLTextAreaElement) {
    if (memo instanceof HTMLTextAreaElement) {
      memo.select();
      document.execCommand('copy');
      memo.setSelectionRange(0, 0);
      this.openSnackBar('Copied text area content to clipboard.');
    }
  }

  copyCompact() {
    this.SL.Clear();
    this.BOManager.BO.BackupToSLCompact(this.SL, true);
    this.copyText(this.SL.Text);
    this.openSnackBar('Copied compact event backup text to clipboard.');
  }

  copyText(value: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  openSnackBar(msg: string) {
    this.snackBar.open(msg, null, { duration: 1500 });
  }

  createNew(event: EventParams) {
    const ed: IEventDataItem = {
      EventName: 'New Event',
      EventData: ''
    };

    const sl: string[] = [];

    sl.push('DP.RaceCount=' + event.raceCount);
    sl.push('DP.ITCount=' + event.itCount);
    sl.push('DP.StartlistCount=' + event.startlistCount);

    let s = '';
    for (const t of sl) {
      s += t;
      s += '\r\n';
    }
    ed.EventData = s;

    this.onDataAvailable(ed);
  }

  recreateEvent(event: EventParams) {
    const bo = this.BOManager.BO;

    this.SL.Clear();
    this.BOManager.BO.BackupToSLCompact(this.SL, false);

    this.SL.SL[2] = 'DP.RaceCount=' + event.raceCount;
    this.SL.SL[3] = 'DP.ITCount=' + event.itCount;
    this.SL.SL[4] = 'DP.StartlistCount=' + event.startlistCount;

    const a = new IEventDataItem();
    a.EventName = bo.EventProps.EventName;
    a.EventData = this.SL.Text;
    this.NewEventData = a;
  }

  resetCurrent() {
    this.CurrentRace = 1;
    this.CurrentTP = 0;
    this.CurrentBib = 1;
  }

  assignCurrent(value: CurrentNumbers) {
    this.CurrentRace = value.race;
    this.CurrentTP = value.tp;
    this.CurrentBib = value.bib;
    this.checkCurrent();
    this.updateFabs();
  }

  checkCurrent() {
    const p = this.BOManager.BO.BOParams;
    if (this.CurrentRace > p.RaceCount) {
      this.CurrentRace = p.RaceCount;
    }
    if (this.CurrentTP > p.ITCount) {
      this.CurrentTP = p.ITCount;
    }
  }

  initCurrent() {
    this.processQueue();

    const bo = this.BOManager.BO;

    let rr = new CurrentNumbers();
    rr = bo.findCurrentInRace(rr);

    let re = new CurrentNumbers();
    re = bo.findCurrentInEvent(re);

    if (re.race === rr.race) {
      this.assignCurrent(rr);
    } else {
      if (rr.tp === 0) {
        // for example: event is not timed, finish positions are available but no finish times
        // current race cannot be advanced if you only look into race
        // but current race should be advanced if you look into the event, and see that all finish positions have been assigned.
        // re, determined form looking at event is accurate in this case
        this.assignCurrent(re);
      } else {
        this.assignCurrent(rr);
      }
    }
  }

  initCurrentDefault() {
    const bo = this.BOManager.BO;

    const r = 1;

    let tp = 1;
    if (bo.EventProps.IsTimed === false || bo.BOParams.ITCount === 0) {
      tp = 0;
    }

    this.CurrentRace = r;
    this.CurrentTP = tp;
  }

  findCurrentB() {
    const bo = this.BOManager.BO;
    let cn = new CurrentNumbers();

    if (bo.BOParams.ITCount > 0) {
      cn = bo.findCurrentInRace(cn);
    } else {
      cn = bo.findCurrentInEvent(cn);
    }

    this.assignCurrent(cn);
  }

  findCurrentR() {
    const bo = this.BOManager.BO;
    let result = new CurrentNumbers();
    result = bo.findCurrentInRace(result);
    this.assignCurrent(result);
  }

  findCurrentE() {
    const bo = this.BOManager.BO;
    let result = new CurrentNumbers();
    result = bo.findCurrentInEvent(result);
    this.assignCurrent(result);
  }

  markBibAndShow() {
    if (this.eventTab) {
      this.eventTab.markAndShow(this.CurrentBib);
    }
    if (this.raceTab) {
      this.raceTab.markAndShow(this.CurrentBib);
    }
  }

  sendMsg(msg: string) {
    if (this.connBar) {
      this.connBar.sendMsg(msg);
    }
  }

  processQueue(calc: boolean = true) {
    let msg: string;
    while (this.BOManager.BO.msgQueueR.length > 0) {
      msg = this.BOManager.BO.msgQueueR.pop();
      this.BOManager.BO.Dispatch(msg);
      this.sendMsg(msg);
    }

    while (this.BOManager.BO.msgQueueE.length > 0) {
      msg = this.BOManager.BO.msgQueueE.pop();
      if (msg !== '' && this.WantUpdateEvent) {
        this.BOManager.BO.Dispatch(msg);
        this.sendMsg(msg);
      }
    }

    this.updateAfterProcessingQueue(calc);
  }

  showQueue() {
    const l = this.BOManager.BO.msgQueueR.concat(this.BOManager.BO.msgQueueE);
    if (l.length === 0) {
      this.TestOutput = this.info('Queue is empty');
    } else {
      const SL = new TStringList();
      for (const s of l) {
        SL.Add(s);
      }
      this.TestOutput = SL.Text;
    }
  }

  noop() {

  }

  handleWebSocketMsg(msg: string) {
    this.lastWebSocketMsg = msg;
    if (msg === 'Manage.Clear') {
      this.clearBtnClick();
    } else {
      this.BOManager.BO.Dispatch(msg);
      this.calcRace();
      this.calcEvent();
      this.updateFabs();
    }
  }

  onNotify(nid: number) {
    switch (nid) {
      case 1: this.clearBtnClick();
    }
  }

  initParams() {
    // this.wantInput = false;
    // this.wantOutput = false;
    this.initParamsFromQueryString();
  }

  initParamsFromQueryString() {
    const url = window.location.href;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      if (httpParams.get('input') === 'true') {
        this.wantOutput = false;
      }
      if (httpParams.get('output') === 'true') {
        this.wantInput = false;
      }
    }
  }

  updateAfterProcessingQueue(calc: boolean = true) {
    if (calc && this.raceTab && this.RaceVisible) {
      this.calcRace();
      this.calcEvent();
      this.updateFabs();
    } else if (calc && this.eventTab && this.EventVisible) {
      this.calcEvent();
      this.updateFabs();
    } else {
      this.BOManager.BO.RNode[this.CurrentRace].Modified = true;
      this.BOManager.BO.Calc();
    }
  }

  handleUpdate(value: number) {
    switch (value) {
      case 1: this.updateAfterProcessingQueue(); break;
      case 2: this.showQueue(); break;
      default: this.updateAll();
    }

    this.updateAll();
  }

  handleCalc(value: number) {
    this.calcRace();
    this.calcEvent();
  }

  get CurrentRace() {
    return this.BOManager.BO.CurrentRace;
  }

  set CurrentRace(value: number) {
    this.BOManager.BO.CurrentRace = value;
  }

  get CurrentTP() {
    return this.BOManager.BO.CurrentTP;
  }

  set CurrentTP(value: number) {
    this.BOManager.BO.CurrentTP = value;
  }

  get CurrentBib() {
    return this.BOManager.BO.CurrentBib;
  }

  set CurrentBib(value: number) {
    this.BOManager.BO.CurrentBib = value;
  }

  get Auto() {
    return this.BOManager.BO.Auto;
  }

  set Auto(value: boolean) {
    this.BOManager.BO.Auto = value;
  }

  get StrictInputMode() {
    return this.BOManager.BO.StrictInputMode;
  }

  set StrictInputmode(value: boolean) {
    this.BOManager.BO.StrictInputMode = value;
  }

  get WantUpdateEvent() {
    return this.BOManager.BO.WantUpdateEvent;
  }

  set WantUpdateEvent(value: boolean) {
    this.BOManager.BO.WantUpdateEvent = value;
  }

  get UseQueue() {
    return this.BOManager.BO.UseQueue;
  }

  set UseQueue(value: boolean) {
    this.BOManager.BO.UseQueue = value;
  }

  toggleApi() {
    this.ApiVisible = !this.ApiVisible;
  }

  toggleConn() {
    this.ConnVisible = !this.ConnVisible;
  }

  showMore() {
    this.more = true;
  }

  showLess() {
    this.more = false;
  }

}
