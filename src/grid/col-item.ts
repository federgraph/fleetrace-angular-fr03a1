import { TBO } from '../fr/fr-bo';

export class TCollectionItem<C, I> {
  ID = 0;
  Index = -1;
  Name = '';
  constructor(public Collection: C) {}
}

export abstract class TCollection<C extends TCollection<C, I>, I extends TCollectionItem<C, I>> {
  Owner: any;

  Items: I[] = [];

  constructor(public BO: TBO) {}

  abstract NewItem(BO: TBO): I;

  get Count(): number {
    return this.Items.length;
  }

  Assign(value: C) {}

  Clear() {
    this.Items = [];
  }

  Add(): I {
    const cr = this.NewItem(this.BO);
    this.Items.push(cr);
    cr.Index = this.Items.length - 1;
    return cr;
  }

  protected GetItem(Index: number): I {
    if (Index >= 0 && Index < this.Count) {
      return this.Items[Index];
    }
    return null;
  }

  protected SetItem(Index: number, value: I) {
    this.Items[Index] = value;
  }
}
