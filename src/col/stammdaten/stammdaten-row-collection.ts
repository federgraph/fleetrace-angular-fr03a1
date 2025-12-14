import { TStringList } from '../../util/fb-strings';
import { FieldNames } from './stammdaten-fieldnames';
import { TStammdatenNode } from './stammdaten-node';
import { TBaseRowCollection } from '../../grid/col-grid';
import { TStammdatenColGrid, TStammdatenColProps } from './stammdaten-grid';
import { TStammdatenBO } from './stammdaten-bo';
import { TStammdatenRowCollectionItem } from './stammdaten-row-collection-item';
import { TStammdatenColProp } from './stammdaten-col-prop';
import { TBO } from '../../fr/fr-bo';

export class TStammdatenRowCollection extends TBaseRowCollection<
  TStammdatenColGrid,
  TStammdatenBO,
  TStammdatenNode,
  TStammdatenRowCollection,
  TStammdatenRowCollectionItem,
  TStammdatenColProps,
  TStammdatenColProp
> {
  static readonly FixFieldCount = 6;
  private MapList: TStringList = new TStringList();
  private FieldCaptionList: TStringList = new TStringList();

  private fieldCount: number = TStammdatenRowCollection.FixFieldCount;

  constructor(BO: TBO, n: TStammdatenNode) {
    super(n, BO);
    this.FieldMap = 'SN';
  }

  NewItem(): TStammdatenRowCollectionItem {
    const cr = new TStammdatenRowCollectionItem(this, this.BO);
    this.InitNewItemID(cr);
    return cr;
  }

  FindKey(SNR: number): TStammdatenRowCollectionItem {
    for (let i = 0; i < this.Count; i++) {
      const o: TStammdatenRowCollectionItem = this.Items[i];
      if (o != null && o.SNR === SNR) {
        return o;
      }
    }
    return null;
  }

  /**
   * Computes the disply name field according to the mapping specified in EP.FieldMap.
   * Only content from N1..N6 can be used in the mapping to compute DN.
   *
   * An underscore (_) or 'Space' will give a single Space character.
   * A simple dash (-) will produce a dash padded by one space, before and after.
   * 'Slash' will produce a forward slash padded by on space, before and after.
   * 'Komma will produce a comma, followed by one space.'
   */
  CalcDisplayName(cr: TStammdatenRowCollectionItem): void {
    if (this.MapList.Count < 1) {
      return;
    }

    let s: string;
    let t: string;

    t = '';
    for (let i = 0; i < this.MapList.Count; i++) {
      s = this.MapList.SL[i];
      if (s === FieldNames.FN || s === 'FN') {
        t += cr.FN;
      } else if (s === FieldNames.LN || s === 'LN') {
        t += cr.LN;
      } else if (s === FieldNames.SN || s === 'SN') {
        t += cr.SN;
      } else if (s === FieldNames.NC || s === 'NC') {
        t += cr.NC;
      } else if (s === FieldNames.GR || s === 'GR') {
        t += cr.GR;
      } else if (s === FieldNames.PB || s === 'PB') {
        t += cr.PB;
      } else if (s === '_' || s === 'Space') {
        t += ' ';
      } else if (s === '-') {
        t += ' - ';
      } else if (s === 'Slash') {
        t += ' / ';
      } else if (s === 'Komma') {
        t += ', ';
      } else {
        t += s;
      }
    }
    cr.DN = t;
  }

  get FieldMap(): string {
    let s: string = this.MapList.CommaText;
    if (s === '') {
      s = 'SN';
    }
    return s;
  }
  set FieldMap(value: string) {
    if (value && value !== '') {
      this.MapList.CommaText = value;
    } else {
      this.MapList.CommaText = 'SN';
    }

    this.forEach((cr: TStammdatenRowCollectionItem) => {
      this.CalcDisplayName(cr);
    });
  }

  GetFieldCaption(index: number): string {
    // 'FieldCaptions' EventProp excluding SNR, starting with N1,N2,N3,...
    // e.g 'EP.FieldCaptions=FN1' maps 'FN1' as Caption of col_FN at index 1)
    if (index > 0 && index <= this.FieldCaptionList.Count) {
      const s: string = this.FieldCaptionList.SL[index - 1];
      if (s && s !== '') {
        return s;
      }
    }
    switch (index) {
      case 0:
        return 'SNR';
      case 1:
        return FieldNames.FN;
      case 2:
        return FieldNames.LN;
      case 3:
        return FieldNames.SN;
      case 4:
        return FieldNames.NC;
      case 5:
        return FieldNames.GR;
      case 6:
        return FieldNames.PB;
    }
    return 'N' + index.toString();
  }

  get FieldCaptions(): string {
    return this.FieldCaptionList.CommaText;
  }
  set FieldCaptions(value: string) {
    this.FieldCaptionList.CommaText = value;
  }

  get FieldCount(): number {
    return this.fieldCount;
  }
  set FieldCount(value: number) {
    this.fieldCount = value;
    this.BO.BOParams.FieldCount = value;
  }

  get SchemaCode(): number {
    return FieldNames.getSchemaCode();
  }
  set SchemaCode(value: number) {
    FieldNames.setSchemaCode(value);
  }

  Swap(f1: number, f2: number): void {
    let cr: TStammdatenRowCollectionItem;
    let s: string;
    if (f1 !== f2 && f1 > 0 && f2 > 0 && f1 <= this.FieldCount && f2 <= this.FieldCount) {
      for (let i = 0; i < this.Count; i++) {
        cr = this.Items[i];
        s = cr.getItem(f1);
        cr.setItem(f1, cr.getItem(f2));
        cr.setItem(f2, s);
      }
    }
  }
}
