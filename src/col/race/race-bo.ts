import { TBaseColBO } from '../../grid/col-grid';
import { TRaceColGrid, TRaceColProps } from './race-grid';
import { TRaceNode } from './race-node';
import { TRaceRowCollection } from './race-row-collection';
import { TRaceRowCollectionItem } from './race-row-collection-item';
import { TRaceColProp } from './race-col-prop';
import { TNotifyEvent } from '../../grid/grid-def';
import { TBO, BOIndexer } from '../../fr/fr-bo';
import { TPTime } from '../../calc/time';
import { TUtils } from '../../util/fb-classes';
import { TTimePoint } from './time-point';

export class TRaceBO extends TBaseColBO<
  TRaceColGrid,
  TRaceBO,
  TRaceNode,
  TRaceRowCollection,
  TRaceRowCollectionItem,
  TRaceColProps,
  TRaceColProp
> {
  OnChange: TNotifyEvent;
  TableLayout = 0;

  constructor(public BO: TBO) {
    super();
  }

  /**
   * generate time string from new Date()
   * @returns string in format HH:mm:ss.ff
   */
  getTimeString(digits = 2) {
    const d = new Date();
    const hh = d.getHours();
    const mm = d.getMinutes();
    const ss = d.getSeconds();
    const t = d.getMilliseconds();

    const shh = '' + hh;
    const smm = mm < 10 ? '0' + mm : mm;
    const sss = ss < 10 ? '0' + ss : ss;
    let sms = '' + t;
    if (t < 10) {
      sms = '00' + t;
    } else if (t < 100) {
      sms = '0' + t;
    }
    if (digits < 3) {
      sms = sms.substring(0, digits);
    }

    const tm = shh + ':' + smm + ':' + sss + '.' + sms;
    return tm;
  }

  private ValidateOTime(t: TPTime, Value: string): string {
    // if not Locked
    if (Value === '-1') {
      t.Clear();
    } else if (Value === 'n') {
      t.Parse(this.getTimeString(2)); // 'HH:mm:ss.ff'
    } else {
      t.Parse(Value);
    }
    return t.toString();
  }

  override InitColsActive(g: TRaceColGrid): void {
    if (this.CurrentNode != null) {
      this.InitColsActiveLayout(g, this.CurrentNode.Layout);
    }
  }

  override InitColsActiveLayout(g: TRaceColGrid, tp: number) {
    if (this.TableLayout === 1) {
      this.InitColsActiveLayout1(g, tp);
    } else {
      this.InitColsActiveLayout0(g, tp);
    }
  }

  InitColsActiveLayout1(g: TRaceColGrid, tp: number): void {
    g.ColsActive.Clear();
    g.AddColumn('col_BaseID');

    let cp: TRaceColProp;

    g.AddColumn('col_SNR');

    g.AddColumn('col_Bib');
    g.AddColumn('col_NC');
    g.AddColumn('col_MRank');

    cp = g.AddColumn('col_QU');
    cp.OnFinishEdit = this.EditQU;
    cp.ReadOnly = false;

    cp = g.AddColumn('col_DG');
    cp.OnFinishEdit = this.EditDG;
    cp.ReadOnly = false;

    cp = g.AddColumn('col_ST');
    cp.OnFinishEdit = this.EditST;
    cp.ReadOnly = false;

    if (tp >= 0 && tp <= this.BO.BOParams.ITCount) {
      const s: string = 'col_IT' + tp.toString();
      cp = g.AddColumn(s);
      if (cp != null) {
        cp.OnFinishEdit2 = this.EditIT;
        cp.ReadOnly = false;
      }
      g.AddColumn(s + 'B');
      // g.AddColumn(s + 'BFT');
      g.AddColumn(s + 'BPL');
      g.AddColumn(s + 'Rank');
      g.AddColumn(s + 'PosR');
      g.AddColumn(s + 'PLZ');
    }

    cp = g.AddColumn('col_FT');
    cp.OnFinishEdit = this.EditFT;
    cp.ReadOnly = false;

    g.AddColumn('col_ORank');
    g.AddColumn('col_Rank');
    g.AddColumn('col_PosR');
    g.AddColumn('col_PLZ');
  }

  InitColsActiveLayout0(g: TRaceColGrid, tp: number) {
    let cp: TRaceColProp;
    let s: string;

    g.ColsActive.Clear();
    g.AddColumn('col_BaseID');
    g.AddColumn('col_SNR');
    g.AddColumn('col_Bib');
    g.AddColumn('col_NC');

    cp = g.AddColumn('col_QU');
    cp.OnFinishEdit = this.EditQU;
    cp.ReadOnly = false;

    if (tp >= 0 && tp <= this.BO.BOParams.ITCount) {
      s = 'col_IT' + tp;
      cp = g.AddColumn(s);
      if (cp) {
        cp.OnFinishEdit2 = this.EditIT;
        cp.ReadOnly = false;
      }
      g.AddColumn(s + 'B');
      g.AddColumn(s + 'Rank');
    }
    g.AddColumn('col_PosR');
  }

  private Changed(): void {
    if (this.OnChange != null) {
      this.OnChange(this);
    }
  }

  EditSNR(cr: TRaceRowCollectionItem, value: string): string {
    cr.SNR = TUtils.StrToIntDef(value, cr.SNR);
    const result = TUtils.IntToStr(cr.SNR);
    // orizontal kopieren
    this.BO.SetFieldNumber(BOIndexer.SNR, 0, cr.IndexOfRow, cr.SNR);
    return result;
  }

  EditBib(cr: TRaceRowCollectionItem, value: string): string {
    cr.Bib = TUtils.StrToIntDef(value, cr.Bib);
    const result = TUtils.IntToStr(cr.Bib);
    // horizontal kopieren
    this.BO.SetFieldNumber(BOIndexer.Bib, 0, cr.IndexOfRow, cr.Bib);
    return result;
  }

  EditQU(cr: TRaceRowCollectionItem, value: string): string {
    if (value.indexOf(',') > -1) {
      cr.QU.FromString(value);
    } else {
      cr.QU.Parse(value);
    }
    const result = cr.QU.toString();
    cr.Modified = true;
    // Penalty-Indexer:
    this.BO.SetQU(cr.ru.Index, cr.IndexOfRow, cr.QU.AsInteger);
    return result;
  }

  EditDG(cr: TRaceRowCollectionItem, value: string): string {
    cr.DG = TUtils.StrToIntDef(value, cr.DG);
    const result = TUtils.IntToStr(cr.DG);
    cr.Modified = true;
    this.BO.SetFieldNumber(BOIndexer.DG, cr.ru.Index, cr.IndexOfRow, cr.DG);
    return result;
  }

  EditOTime(cr: TRaceRowCollectionItem, value: string): string {
    cr.MRank = TUtils.StrToIntDef(value, cr.MRank);
    const result = TUtils.IntToStr(cr.MRank);
    // cr.Modified = true;
    this.BO.SetFieldNumber(BOIndexer.OT, cr.ru.Index, cr.IndexOfRow, cr.MRank);
    return result;
  }

  EditMRank(cr: TRaceRowCollectionItem, value: string): string {
    const cl: TRaceRowCollection = cr.ru.Collection;

    const oldRank: number = cr.MRank;
    let newRank: number = TUtils.StrToIntDef(value, cr.MRank);
    let maxRank = 0;

    let cr1: TRaceRowCollectionItem;
    for (let i1 = 0; i1 < cl.Count; i1++) {
      cr1 = cl.Items[i1];
      if (cr === cr1) {
        continue;
      } else if (cr1.MRank > 0) {
        maxRank++;
      }
    }

    let result: string;

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
      result = TUtils.IntToStr(cr.MRank);
    } else {
      for (let i2 = 0; i2 < cl.Count; i2++) {
        cr1 = cl.Items[i2];
        if (cr1 === cr) {
          continue;
        }
        const temp: number = cr1.MRank;
        // remove
        if (oldRank > 0 && oldRank < temp) {
          cr1.MRank = temp - 1;
        }
        // insert
        if (newRank > 0 && newRank <= cr1.MRank) {
          cr1.MRank = cr1.MRank + 1;
        }
      }
      cr.MRank = newRank;
      result = TUtils.IntToStr(cr.MRank);
      this.Changed();
      cr.Modified = true;
    }
    return result;
  }

  EditST(cr: TRaceRowCollectionItem, value: string): string {
    const v = this.ValidateOTime(cr.ST, value);
    cr.Modified = true;
    return v;
  }

  EditIT(cr: TRaceRowCollectionItem, value: string, ColName: string): string {
    const i: number = TUtils.StrToIntDef(ColName.substring(6, ColName.length), -1);
    const t: TTimePoint = cr.IT[i];
    let v = value;
    if (t != null) {
      v = this.ValidateOTime(t.OTime, value);
      cr.Modified = true;
      this.BO.CalcTP.UpdateDynamicBehind(this, cr, i);
    }
    return v;
  }

  EditFT(cr: TRaceRowCollectionItem, value: string): string {
    const v = this.ValidateOTime(cr.FT.OTime, value);
    cr.Modified = true;
    this.BO.CalcTP.UpdateDynamicBehind(this, cr, 0);
    return v;
  }
}
