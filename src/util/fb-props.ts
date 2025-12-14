export class TProp {
  Key = '';
  Value = '';
}

export class TProps {
  [key: string]: any;

  FCount = 0;

  GetProp(Index: number, prop: TProp): TProp {
    prop.Key = 'N' + Index;
    prop.Value = this[prop.Key];
    return prop;
  }

  SetProp(Index: number, prop: TProp): void {
    prop.Key = 'N' + Index;
    if (!prop.Key) {
      this.FCount++;
    }
    this[prop.Key] = prop.Value;
  }

  get Count(): number {
    return this.FCount;
  }

  Assign(source: TProps) {
    const p = new TProp();
    let propIndex: number;
    for (let i = 0; i < source.Count; i++) {
      propIndex = 7 + i;
      this.SetProp(propIndex, source.GetProp(propIndex, p));
    }
  }
}
