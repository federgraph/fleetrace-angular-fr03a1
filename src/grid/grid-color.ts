import { Color } from '../util/fb-color';
import { TCellProp } from './grid-cell-prop';
import { TColGridColorClass, TColAlignment } from './grid-def';

type TColor = number;

export class TColorRec {
  static readonly Red = 0xff0000;
  static readonly Yellow = 0xffff00;
  static readonly Gray = 0x808080;
  static readonly Darkgray = 0xa9a9a9;
  static readonly White = 0xffffff;
  static readonly Lightgray = 0xd3d3d3;
  static readonly Teal = 0x008080;
  static readonly SkyBlue = 0x87ceeb;

  static readonly Maroon = 0x800000;
  static readonly Black = 0x000000;
  static readonly Olive = 0x808000;
  static readonly Lime = 0x00ff00;
  static readonly Green = 0x008000;
  static readonly Aqua = 0x00ffff;
  static readonly Blue = 0x0000ff;
  static readonly Navy = 0x000080;
  static readonly Silver = 0xc0c0c0;
  static readonly Purple = 0x800080;
  static readonly Fuchsia = 0xff00ff;
  static readonly Orange = 0xffa500;
  static readonly YellowGreen = 0x9acd32;
  static readonly CornflowerBlue = 0x6495ed;
  static readonly Tomato = 0xff6347;
}

export class ColorConst {
  static readonly clWhite = 0xffffff;
  static readonly clYellow = 0xffff00;

  static readonly TColorRecCornflowerblue = 0xed9564;
  static readonly TColorRecOrange = 0x00a5ff;
  static readonly TColorRecDarkorange = 0x008cff;
  static readonly TColorRecYellowgreen = 0x32cd9a;
  static readonly TColorRecCrimson = 0x3c14dc;
  static readonly TColorRecLightgray = 0xd3d3d3;
  static readonly TColorRecDarkgray = 0xa9a9a9;
  static readonly TColorRecSkyblue = 0xffbf00;

  static readonly clFleetNone = ColorConst.TColorRecDarkorange;
  static readonly clFleetYellow = 0xccffff;
  static readonly clFleetBlue = 0xffffcc;
  static readonly clFleetRed = 0xccccff;
  static readonly clFleetGreen = 0xccffcc;

  static readonly clEventBtn = ColorConst.TColorRecDarkorange;

  static readonly clBlank = ColorConst.clWhite;
  static readonly clHeader = ColorConst.TColorRecLightgray;

  static readonly clFocus = ColorConst.clYellow;
  static readonly clEditable = 0xffffe8;
  static readonly clAlternatingEditable = ColorConst.clEditable;

  static readonly clNormal = ColorConst.clWhite;
  static readonly clAlternate = 0xe0ffff;

  static readonly clHellRot = 0x8080ff;
  static readonly clTransRot = 0x89aaf5;

  static readonly clHellBlau = 0xff8888;
  static readonly clTransBlau = 0xecad93;

  static readonly clHellGruen = 0x80ff80; // for LED

  static readonly clMG = 0x00ffff; // TColorRec.MoneyGreen;
  static readonly clMGA = 0xfffbf0;
  static readonly clBtnFace = TColorRec.Silver;
}

export class TColorTranslator {
  colors: { [index: string]: string } = {
    aliceblue: 'f0f8ff',
    antiquewhite: 'faebd7',
    aqua: '00ffff',
    aquamarine: '7fffd4',
    azure: 'f0ffff',

    beige: 'f5f5dc',
    bisque: 'ffe4c4',
    black: '000000',
    blanchedalmond: 'ffebcd',
    blue: '0000ff',
    blueviolet: '8a2be2',
    brown: 'a52a2a',
    burlywood: 'deb887',

    cadetblue: '5f9ea0',
    chartreuse: '7fff00',
    chocolate: 'd2691e',
    coral: 'ff7f50',
    cornflowerblue: '6495ed',
    cornsilk: 'fff8dc',
    crimson: 'dc143c',
    cyan: '00ffff',

    darkblue: '00008b',
    darkcyan: '008b8b',
    darkgoldenrod: 'b8860b',
    darkgray: 'a9a9a9',
    darkgreen: '006400',
    darkkhaki: 'bdb76b',
    darkmagenta: '8b008b',
    darkolivegreen: '556b2f',
    darkorange: 'ff8c00',
    darkorchid: '9932cc',
    darkred: '8b0000',
    darksalmon: 'e9967a',
    darkseagreen: '8fbc8f',
    darkslateblue: '483d8b',
    darkslategray: '2f4f4f',
    darkturquoise: '00ced1',
    darkviolet: '9400d3',
    deeppink: 'ff1493',
    deepskyblue: '00bfff',
    dimgray: '696969',
    dodgerblue: '1e90ff',

    firebrick: 'b22222',
    floralwhite: 'fffaf0',
    forestgreen: '228b22',
    fuchsia: 'ff00ff',

    gainsboro: 'dcdcdc',
    ghostwhite: 'f8f8ff',
    gold: 'ffd700',
    goldenrod: 'daa520',
    gray: '808080',
    green: '008000',
    greenyellow: 'adff2f',

    honeydew: 'f0fff0',
    hotpink: 'ff69b4',

    indianred: 'cd5c5c',
    indigo: '4b0082',
    ivory: 'fffff0',
    khaki: 'f0e68c',

    lavender: 'e6e6fa',
    lavenderblush: 'fff0f5',
    lawngreen: '7cfc00',
    lemonchiffon: 'fffacd',
    lightblue: 'add8e6',
    lightcoral: 'f08080',
    lightcyan: 'e0ffff',
    lightgoldenrodyellow: 'fafad2',
    lightgrey: 'd3d3d3',
    lightgreen: '90ee90',
    lightpink: 'ffb6c1',
    lightsalmon: 'ffa07a',
    lightseagreen: '20b2aa',
    lightskyblue: '87cefa',
    lightslategray: '778899',
    lightsteelblue: 'b0c4de',
    lightyellow: 'ffffe0',
    lime: '00ff00',
    limegreen: '32cd32',
    linen: 'faf0e6',

    magenta: 'ff00ff',
    maroon: '800000',
    mediumaquamarine: '66cdaa',
    mediumblue: '0000cd',
    mediumorchid: 'ba55d3',
    mediumpurple: '9370d8',
    mediumseagreen: '3cb371',
    mediumslateblue: '7b68ee',
    mediumspringgreen: '00fa9a',
    mediumturquoise: '48d1cc',
    mediumvioletred: 'c71585',
    midnightblue: '191970',
    mintcream: 'f5fffa',
    mistyrose: 'ffe4e1',
    moccasin: 'ffe4b5',

    navajowhite: 'ffdead',
    navy: '000080',

    oldlace: 'fdf5e6',
    olive: '808000',
    olivedrab: '6b8e23',
    orange: 'ffa500',
    orangered: 'ff4500',
    orchid: 'da70d6',

    palegoldenrod: 'eee8aa',
    palegreen: '98fb98',
    paleturquoise: 'afeeee',
    palevioletred: 'd87093',
    papayawhip: 'ffefd5',
    peachpuff: 'ffdab9',
    peru: 'cd853f',
    pink: 'ffc0cb',
    plum: 'dda0dd',
    powderblue: 'b0e0e6',
    purple: '800080',

    rebeccapurple: '663399',
    red: 'ff0000',
    rosybrown: 'bc8f8f',
    royalblue: '4169e1',

    saddlebrown: '8b4513',
    salmon: 'fa8072',
    sandybrown: 'f4a460',
    seagreen: '2e8b57',
    seashell: 'fff5ee',
    sienna: 'a0522d',
    silver: 'c0c0c0',
    skyblue: '87ceeb',
    slateblue: '6a5acd',
    slategray: '708090',
    snow: 'fffafa',
    springgreen: '00ff7f',
    steelblue: '4682b4',

    tan: 'd2b48c',
    teal: '008080',
    thistle: 'd8bfd8',
    tomato: 'ff6347',
    turquoise: '40e0d0',

    violet: 'ee82ee',

    wheat: 'f5deb3',
    white: 'ffffff',
    whitesmoke: 'f5f5f5',

    yellow: 'ffff00',
    yellowgreen: '9acd32',
  };

  static fromRGB(R: number, G: number, B: number): number {
    return (R << 16) + (G << 8) + B;
  }

  getRGBHexString(color: string): string {
    return this.colors[color.toLowerCase()];
  }

  hexColorString(color: string): string {
    const cs = this.getRGBHexString(color);
    if (typeof cs !== 'undefined') {
      return '#' + cs;
    }

    return '#ffffff';
  }

  GetRValue(RGB: TColor): number {
    return (RGB & (255 << 16)) >> 16;
  }

  GetGValue(RGB: TColor): number {
    return (RGB & (255 << 8)) >> 8;
  }

  GetBValue(RGB: TColor): number {
    return RGB & 255;
  }

  GetRGB(R: number, G: number, B: number): number {
    const c = new Color(R, G, B);
    const result = (c.r << 16) + (c.g << 8) + c.b;
    return result;
  }

  TranslateColor(aColor: TColor): string {
    const ir = this.GetRValue(aColor);
    const ig = this.GetGValue(aColor);
    const ib = this.GetBValue(aColor);

    const c = new Color(ir, ig, ib);
    // result = Format('#%2x%2x%2x', [this.b, this.g, this.r]);
    return c.toHex();
  }
}

let ColorTranslator: TColorTranslator;

export class TColGridColorRec {
  DefaultColor: TColor;
  AlternatingColor: TColor;
  FocusColor: TColor;
  EditableColor: TColor;
  AlternatingEditableColor: TColor;
  CurrentColor: TColor;
  TransColor: TColor;

  constructor() {
    this.DefaultColor = ColorConst.clAlternate;
    this.AlternatingColor = ColorConst.clNormal;
    this.FocusColor = ColorConst.clFocus;
    this.EditableColor = ColorConst.clEditable;
    this.AlternatingEditableColor = ColorConst.clAlternatingEditable;
    this.CurrentColor = ColorConst.clHellRot;
    this.TransColor = ColorConst.clTransRot;
  }
}

export enum TColGridColorScheme {
  color256,
  colorRed,
  colorBlue,
  colorMoneyGreen,
  colorRubyGraphite,
}

export class TColGridColors {
  static StyleName = '';

  static GetColorScheme(): TColGridColorScheme {
    let result = TColGridColorScheme.colorRed;
    if (this.StyleName === 'Graphite') {
      result = TColGridColorScheme.colorRubyGraphite;
    }
    return result;
  }

  static GetGridColors(Value: TColGridColorScheme): TColGridColorRec {
    const result = new TColGridColorRec();
    switch (Value) {
      case TColGridColorScheme.colorRubyGraphite:
        result.DefaultColor = TColorRec.Gray;
        result.AlternatingColor = TColorRec.Gray;
        result.FocusColor = TColorRec.Yellow;
        result.EditableColor = TColorRec.Darkgray;
        result.AlternatingEditableColor = TColorRec.Darkgray;
        result.CurrentColor = ColorConst.clHellBlau;
        result.TransColor = ColorConst.clTransBlau;
        break;

      case TColGridColorScheme.colorMoneyGreen:
        result.DefaultColor = ColorConst.clMG;
        result.AlternatingColor = ColorConst.clMGA;
        result.FocusColor = TColorRec.Yellow;
        result.EditableColor = ColorConst.clEditable;
        result.AlternatingEditableColor = ColorConst.clEditable;
        result.CurrentColor = ColorConst.clHellRot;
        result.TransColor = ColorConst.clTransRot;
        break;

      case TColGridColorScheme.colorRed:
        result.DefaultColor = ColorConst.clAlternate;
        result.AlternatingColor = ColorConst.clNormal;
        result.FocusColor = ColorConst.clFocus;
        result.EditableColor = ColorConst.clEditable;
        result.AlternatingEditableColor = ColorConst.clAlternatingEditable;
        result.CurrentColor = ColorConst.clHellRot;
        result.TransColor = ColorConst.clTransRot;
        break;

      case TColGridColorScheme.colorBlue:
        result.DefaultColor = ColorConst.clNormal;
        result.AlternatingColor = ColorConst.clAlternate;
        result.FocusColor = ColorConst.clFocus;
        result.EditableColor = ColorConst.clEditable;
        result.AlternatingEditableColor = ColorConst.clAlternatingEditable;
        result.CurrentColor = ColorConst.clHellBlau;
        result.TransColor = ColorConst.clTransBlau;
        break;

      case TColGridColorScheme.color256:
        result.DefaultColor = TColorRec.White;
        result.AlternatingColor = TColorRec.Lightgray;
        result.FocusColor = TColorRec.Teal;
        result.EditableColor = TColorRec.Yellow;
        result.AlternatingEditableColor = TColorRec.Yellow;
        result.CurrentColor = TColorRec.Red;
        result.TransColor = TColorRec.Red;
        break;
    }
    return result;
  }

  static HTMLColor(c: TColor): string {
    switch (c) {
      case ColorConst.clEditable:
        return '#F0F8FF';

      case ColorConst.clNormal:
        return 'white';
      case ColorConst.clAlternate:
        return '#FFFFE0';

      case ColorConst.clMGA:
        return '#C0DCC0'; // green
      case ColorConst.clMG:
        return 'aqua'; // '#F0FBFF'; //blue

      case ColorConst.clHellBlau:
        return '#8080FF';
      case ColorConst.clTransBlau:
        return '#89AAF5';

      case ColorConst.clHellRot:
        return '#FF8888';
      case ColorConst.clTransRot:
        return '#ECAD93';

      case TColorRec.SkyBlue:
        return '#87CEEB';
      case 0x000080ff:
        return '#FF8000';

      case TColorRec.Lightgray:
        return 'silver';
      //
      case TColorRec.Red:
        return 'red';
      case TColorRec.Maroon:
        return 'maroon';
      case TColorRec.Black:
        return 'black';
      case TColorRec.Yellow:
        return 'yellow';
      case TColorRec.Olive:
        return 'olive';
      case TColorRec.Lime:
        return 'lime';
      case TColorRec.Green:
        return 'green';
      case TColorRec.Teal:
        return 'teal';
      case TColorRec.Gray:
        return 'gray';
      case TColorRec.Aqua:
        return 'aqua';
      case TColorRec.Blue:
        return 'blue';
      case TColorRec.Navy:
        return 'navy';
      case TColorRec.Silver:
        return 'silver';
      case TColorRec.Purple:
        return 'purple';
      case TColorRec.Fuchsia:
        return 'fuchsia';
      // case ColorConst.clMoneyGreen: return '#C0DCC0';
      // case ColorConst.clCream: return '#F0FBFF';
      default:
        if (!ColorTranslator) {
          ColorTranslator = new TColorTranslator();
        }
        return ColorTranslator.TranslateColor(c);
    }
  }

  static CSSClass(cellProp: TCellProp): string {
    const c: TColor = cellProp.Color;
    let s = '';
    switch (cellProp.ColorClass) {
      case TColGridColorClass.AlternatingColor:
        s = 'a';
        break;
      case TColGridColorClass.AlternatingEditableColor:
        s = 'ae';
        break;
      case TColGridColorClass.Blank:
        return '';
      case TColGridColorClass.CurrentColor:
        s = 'c';
        break;
      case TColGridColorClass.CustomColor:
        break;
      case TColGridColorClass.DefaultColor:
        s = 'n';
        break;
      case TColGridColorClass.EditableColor:
        s = 'e';
        break;
      case TColGridColorClass.FocusColor:
        return '';
      case TColGridColorClass.HeaderColor:
        s = 'h';
        break;
    }
    if (s !== '') {
      if (cellProp.Alignment === TColAlignment.taLeftJustify) {
        s += 'l';
      }
      return ` class='${s}'`;
    } else {
      if (cellProp.Alignment === TColAlignment.taLeftJustify) {
        return ` bgcolor='${this.HTMLColor(c)}' align='left'`;
      } else {
        return ` bgcolor='${this.HTMLColor(c)}' align='right'`;
      }
    }
  }
}
