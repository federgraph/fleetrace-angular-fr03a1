import { ColorConst, TColorTranslator, TColorRec } from '../../grid/grid-color';

export enum TFinishError {
    error_OutOfRange_OTime_Min,
    error_OutOfRange_OTime_Max,
    error_Duplicate_OTime,
    error_Contiguous_OTime
}

export enum TEntryError {
    error_Duplicate_SNR,
    error_Duplicate_Bib,
    error_OutOfRange_Bib,
    error_OutOfRange_SNR
}

export enum TColorMode {
    ColorMode_None,
    ColorMode_Error,
    ColorMode_Fleet
}

export class FleetColor {
    static readonly clFleetMedal = ColorConst.clWhite;
    static readonly clFleetYellow = TColorTranslator.fromRGB(0xFF, 0xFF, 0xCC);
    static readonly clFleetBlue = TColorTranslator.fromRGB(0xCC, 0xFF, 0xFF);
    static readonly clFleetRed = TColorTranslator.fromRGB(0xFF, 0xCC, 0xCC);
    static readonly clFleetGreen = TColorTranslator.fromRGB(0xCC, 0xFF, 0xCC);

    static readonly clFleetMedalBold = TColorRec.YellowGreen;
    static readonly clFleetYellowBold = TColorRec.Orange;
    static readonly clFleetBlueBold = TColorRec.CornflowerBlue;
    static readonly clFleetRedBold = TColorRec.Tomato;
    static readonly clFleetGreenBold = TColorRec.YellowGreen;
}

