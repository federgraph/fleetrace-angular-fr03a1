import { TColor, TColAlignment, TColGridColorClass } from "./grid-def";
import { ColorConst, TColorRec } from "./grid-color";

export class TCellProp {
  Alignment: TColAlignment;
  Color: TColor;
  GroupColor: TColor;
  HTMLColor: string;
  ColorClass: TColGridColorClass;
  ShowGroup: boolean;

  constructor() {
    this.Alignment = TColAlignment.taLeftJustify;
    this.GroupColor = ColorConst.clFleetNone;
    this.Color = TColorRec.White;
    this.HTMLColor = 'white';
    this.ColorClass = TColGridColorClass.Blank;
    this.ShowGroup = false;
  }

  get HasGroup(): boolean { 
    return this.GroupColor !== ColorConst.clFleetNone; 
  }

}

export class TCellProps {
  private T: Array<TCellProp> = [];

  ColCount = 0;

  private Grow(i: number) {
    while (i > this.LastArrayIndex) {
        this.T.push(new TCellProp());
    }
  }

  get LastArrayIndex(): number { return this.T.length - 1; }

  GetCellProp(ACol: number, ARow: number): TCellProp {
    const i = this.ColCount * ARow + ACol;
    if (i > this.LastArrayIndex)
      this.Grow(i);

    const result = this.T[i];

    console.assert(result != null);    
    
    return result;
  }

  Clear() {
    this.T = [];
    this.ColCount = 0;
  }

}
