import { TEventColGrid, TEventColProps } from './event-grid';
import {
  TEventRowCollectionItem,
  TEventRowCollection,
  TEventNode,
  TEventColProp,
} from './event-row-collection';
import { TBaseColBO } from '../../grid/col-grid';
import { TEventRaceEntry } from './event-race-entry';
import { TUtils } from '../../util/fb-classes';
import { TStammdatenRowCollection } from '../stammdaten/stammdaten-row-collection';
import { TStammdatenRowCollectionItem } from '../stammdaten/stammdaten-row-collection-item';
import { TBO } from '../../fr/fr-bo';

export class TEventBO extends TBaseColBO<
  TEventColGrid,
  TEventBO,
  TEventNode,
  TEventRowCollection,
  TEventRowCollectionItem,
  TEventColProps,
  TEventColProp
> {
  FL: TEventRowCollectionItem[];
  private FRelaxedInputMode = false;
  NameFieldCount: number;
  NameFieldOrder: string;
  WantDiffCols = false;

  constructor(public BO: TBO) {
    super();
    this.FL = new Array<TEventRowCollectionItem>();
    this.NameFieldCount = 2;
    this.NameFieldOrder = '041256';
  }

  private get RaceCount(): number {
    return this.BO.BOParams.RaceCount;
  }

  get RelaxedInputMode(): boolean {
    return this.FRelaxedInputMode;
  }
  set RelaxedInputMode(value: boolean) {
    if (value) {
      this.FRelaxedInputMode = true;
    } else {
      const ev: TEventNode = this.BO.EventNode;
      if (ev.ErrorList.IsPreconditionForStrictInputMode(ev)) {
        this.FRelaxedInputMode = false; // strict mode on
      }
    }
  }

  override InitColsActive(g: TEventColGrid): void {
    this.InitColsActiveLayout(g, 0);
  }

  override InitColsActiveLayout(g: TEventColGrid, aLayout: number): void {
    let cp: TEventColProp;
    g.ColsActive.Clear();
    g.AddColumn('col_BaseID');

    cp = g.AddColumn('col_SNR');
    cp.OnFinishEdit = this.EditSNR;
    cp.ReadOnly = false;

    cp = g.AddColumn('col_Bib');
    cp.OnFinishEdit = this.EditBib;
    cp.ReadOnly = false;

    switch (aLayout) {
      case 1:
        g.AddColumn('col_DN');
        g.AddColumn('col_NC');
        break;

      case 2:
        g.AddColumn('col_FN');
        g.AddColumn('col_LN');
        g.AddColumn('col_NC');
        break;

      case 3:
        g.AddColumn('col_FN');
        g.AddColumn('col_LN');
        g.AddColumn('col_SN');
        g.AddColumn('col_NC');
        break;

      default:
        let s: string;
        for (let i = 1; i <= this.NameFieldCount; i++) {
          s = this.getNameFieldID(i);
          if (s !== '') {
            cp = g.AddColumn(s);
            if (s === 'col_NC') {
              cp.OnFinishEdit = this.EditNC;
              cp.ReadOnly = false;
            }
          }
        }
        break;
    }

    const rc: number = this.RaceCount;
    for (let r = 1; r <= rc; r++) {
      cp = g.AddColumn('col_R' + r.toString());
      cp.OnFinishEdit2 = this.EditRaceValue;
      cp.ReadOnly = false;
    }

    g.AddColumn('col_GPoints');
    if (this.BO.EventNode.WebLayout === 0) {
      g.AddColumn('col_GRank');
    }

    if (this.BO.EventProps.ShowPosRColumn) {
      g.AddColumn('col_GPosR');
    }

    if (this.BO.EventProps.ShowPLZColumn) {
      g.AddColumn('col_PLZ');
    }

    if (this.BO.EventProps.ShowCupColumn) {
      // if (aLayout > 0)
      g.AddColumn('col_Cup');
    }
  }

  private getNameFieldID(Index: number): string {
    let c: string;

    if (Index < 1 || Index > 6) {
      return '';
    }

    if (Index <= this.NameFieldOrder.length) {
      c = this.NameFieldOrder[Index - 1];
    } else {
      const s: string = Index.toString();
      c = s[0];
    }

    switch (c) {
      case '0':
        return 'col_DN';
      case '1':
        return 'col_FN';
      case '2':
        return 'col_LN';
      case '3':
        return 'col_SN';
      case '4':
        return 'col_NC';
      case '5':
        return 'col_GR';
      case '6':
        return 'col_PB';
    }

    return '';
  }

  EditSNR(cr: TEventRowCollectionItem, value: string): string {
    cr.SNR = TUtils.StrToIntDef(value, cr.SNR);
    const result = TUtils.IntToStr(cr.SNR);
    this.BO.SetSNR(cr.IndexOfRow, cr.SNR);
    return result;
  }

  EditBib(cr: TEventRowCollectionItem, value: string): string {
    cr.Bib = TUtils.StrToIntDef(value, cr.Bib);
    const v = TUtils.IntToStr(cr.Bib);
    this.BO.SetBib(cr.IndexOfRow, cr.Bib);
    return v;
  }

  EditNC(cr: TEventRowCollectionItem, value: string): string {
    const cl: TStammdatenRowCollection = this.BO.StammdatenNode.Collection;
    const crs: TStammdatenRowCollectionItem = cl.FindKey(cr.SNR);
    return this.BO.StammdatenBO.EditNC(crs, value);
  }

  private IsFleetInputChar(c: string): boolean {
    switch (c) {
      case 'y':
        return true;
      case 'b':
        return true;
      case 'r':
        return true;
      case 'g':
        return true;
      case 'm':
        return true;
      default:
        return false;
    }
  }

  EditRaceValue(cr: TEventRowCollectionItem, value: string, ColName: string): string {
    let result: string = value;

    if (cr != null) {
      let i: number;
      try {
        i = Number.parseInt(ColName.substring(5), 10);
      } catch {
        i = -1;
      }

      if (i < 1 || i > this.RaceCount) {
        return '';
      }

      if (value === '$') {
        this.BO.SetIsRacing(i, !this.BO.GetIsRacing(i));
        cr.Modified = true;
      } else if (TUtils.StrToIntDef(value, -1) > -1) {
        result = this.EditOTime(cr, value, i);
      } else if (value.length === 1 && this.IsFleetInputChar(value[0])) {
        // Fleet Assignment, easy edit
        const re1: TEventRaceEntry = cr.Race[i];
        const c: string = value[0];
        switch (c) {
          case 'y':
            re1.Fleet = 1;
            break; // yellow
          case 'b':
            re1.Fleet = 2;
            break; // blue
          case 'r':
            re1.Fleet = 3;
            break; // red
          case 'g':
            re1.Fleet = 4;
            break; // green
          case 'm':
            re1.Fleet = 0;
            break; // medal
        }
      } else if (value.length > 1 && value[0] === 'F') {
        // Fleet Assignment, general method
        const re2: TEventRaceEntry = cr.Race[i];
        re2.RaceValue = value; // do not broadcast Fleet Assignments
        // cr.Modified = true;
        // Value = re.RaceValue;
      } else if (value === 'x') {
        cr.Race[i].IsRacing = false;
        // cr.Modified = true; //use CalcBtn
      } else if (value === '-x') {
        cr.Race[i].IsRacing = true;
        // cr.Modified = true; //use CalcBtn
      } else {
        const oldQU: number = cr.Race[i].QU;
        const oldQUString: string = cr.Race[i].Penalty.toString();

        cr.Race[i].RaceValue = value;

        result = cr.Race[i].RaceValue;
        cr.Modified = true;

        const newQU: number = cr.Race[i].QU;
        const newQUString: string = cr.Race[i].Penalty.toString();

        if (oldQU !== newQU || oldQUString !== newQUString) {
          this.BO.SetPenalty(i, cr.IndexOfRow, cr.Race[i].Penalty);
        }
      }
    }

    return result;
  }

  EditOTime(cr: TEventRowCollectionItem, value: string, RaceIndex: number): string {
    let cl: TEventRowCollection;
    let result: string = value;

    if (cr != null) {
      cl = cr.Collection;
    } else {
      return '';
    }

    const re: TEventRaceEntry = cr.Race[RaceIndex];

    let oldRank: number;
    let newRank: number;

    // mode a: direkt input, minimal restriction
    if (this.RelaxedInputMode) {
      oldRank = re.OTime;
      newRank = TUtils.StrToIntDef(value, oldRank);
      if (newRank >= 0 && newRank <= cl.Count && newRank !== oldRank) {
        re.OTime = newRank;
        if (this.BO.RNode[RaceIndex].Collection.Items[cr.IndexOfRow]) {
          this.BO.RNode[RaceIndex].Collection.Items[cr.IndexOfRow].MRank = newRank;
        }
        cr.Modified = true;
      }
      result = re.OTime.toString();
    } else {
      // mode b: maintain contiguous rank from 1 to maxrank
      oldRank = re.OTime;
      result = this.CheckOTime(cl, cr, RaceIndex, value);
      newRank = re.OTime;
      if (oldRank !== newRank) {
        this.BO.CopyOTimes(RaceIndex);
        cr.Modified = true;
      }
    }

    return result;
  }

  private CheckOTime(
    cl: TEventRowCollection,
    cr: TEventRowCollectionItem,
    r: number,
    value: string,
  ): string {
    let result: string = value;
    if (this.BO.EventNode.UseFleets) {
      const f: number = cr.Race[r].Fleet;
      cl.FillFleetList(this.FL, r, f);
      result = this.CheckOTimeForFleet(this.FL, cr, r, value);
      this.FL.length = 0;
    } else {
      result = this.CheckOTimeForAll(cl, cr, r, value);
    }
    return result;
  }

  private CheckOTimeForFleet(
    cl: TEventRowCollectionItem[],
    cr: TEventRowCollectionItem,
    r: number,
    value: string,
  ): string {
    let result = value;
    // let er: TEventRaceEntry;

    let cr1: TEventRowCollectionItem;
    let er1: TEventRaceEntry;

    // let oldRank: number;
    let newRank: number;
    let maxRank: number;

    const er = cr.Race[r];
    const oldRank = er.OTime;
    newRank = TUtils.StrToIntDef(value, er.OTime);
    maxRank = 0;
    for (cr1 of cl) {
      er1 = cr1.Race[r];
      if (cr === cr1) {
        continue;
      } else if (er1.OTime > 0) {
        maxRank++;
      }
    }

    // limit new value
    if (newRank < 0) {
      newRank = 0;
    }
    if (newRank > maxRank + 1) {
      newRank = maxRank + 1;
    }
    if (newRank > cl.length) {
      newRank = cl.length;
    }

    if (oldRank === newRank) {
      result = er.OTime.toString();
    } else {
      for (cr1 of cl) {
        er1 = cr1.Race[r];
        if (cr1 === cr) {
          continue;
        }
        const temp: number = er1.OTime;
        // remove
        if (oldRank > 0 && oldRank < temp) {
          er1.OTime = temp - 1;
        }
        // insert
        if (newRank > 0 && newRank <= er1.OTime) {
          er1.OTime = er1.OTime + 1;
        }
      }
      cr.Race[r].OTime = newRank;
      result = er.OTime.toString();
    }
    return result;
  }

  private CheckOTimeForAll(
    cl: TEventRowCollection,
    cr: TEventRowCollectionItem,
    r: number,
    value: string,
  ): string {
    let result = value;
    // let er: TEventRaceEntry;

    let cr1: TEventRowCollectionItem;
    let er1: TEventRaceEntry;

    // let oldRank: number;
    let newRank: number;
    let maxRank: number;

    const er = cr.Race[r];
    const oldRank = er.OTime;
    newRank = TUtils.StrToIntDef(value, er.OTime);
    maxRank = 0;
    for (let i1 = 0; i1 < cl.Count; i1++) {
      cr1 = cl.Items[i1];
      er1 = cr1.Race[r];
      if (cr === cr1) {
        continue;
      } else if (er1.OTime > 0) {
        maxRank++;
      }
    }

    // limit new value
    if (newRank < 0) {
      newRank = 0;
    }
    if (newRank > maxRank + 1) {
      newRank = maxRank + 1;
    }
    if (newRank > cl.Count) {
      newRank = cl.Count;
    }

    if (oldRank === newRank) {
      result = er.OTime.toString();
    } else {
      for (let i = 0; i < cl.Count; i++) {
        cr1 = cl.Items[i];
        er1 = cr1.Race[r];
        if (cr1 === cr) {
          continue;
        }
        const temp = er1.OTime;
        // remove
        if (oldRank > 0 && oldRank < temp) {
          er1.OTime = temp - 1;
        }
        // insert
        if (newRank > 0 && newRank <= er1.OTime) {
          er1.OTime = er1.OTime + 1;
        }
      }
      cr.Race[r].OTime = newRank;
      result = er.OTime.toString();
    }
    return result;
  }
}
