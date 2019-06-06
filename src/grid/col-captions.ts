import { TColCaptionBag } from './grid-def';

export class TColCaptions {
    static ColCaptionBag: TColCaptionBag = new TColCaptionBag();

    static InitDefaultColCaptions(): void {
        // TColCaptions.ColCaptionBag.setCaption('EventGrid_col_GPoints', 'Points');

        // TColCaptions.ColCaptionBag.setCaption('E_col_FN', 'FN');
        // TColCaptions.ColCaptionBag.setCaption('E_col_LN', 'LN');
        // TColCaptions.ColCaptionBag.setCaption('E_col_SN', 'SN');
        // TColCaptions.ColCaptionBag.setCaption('E_col_NC', 'NC');
        // TColCaptions.ColCaptionBag.setCaption('E_col_GR', 'N5');
        // TColCaptions.ColCaptionBag.setCaption('E_col_PB', 'N6');

        TColCaptions.ColCaptionBag.setCaption('E_col_SNR', 'SNR');
        TColCaptions.ColCaptionBag.setCaption('E_col_Bib', 'Bib');

        TColCaptions.ColCaptionBag.setCaption('E_col_GPoints', 'Total');
        TColCaptions.ColCaptionBag.setCaption('E_col_GRank', 'Rank');
        TColCaptions.ColCaptionBag.setCaption('E_col_GPosR', 'PosR');
        TColCaptions.ColCaptionBag.setCaption('E_col_Cup', 'RLP');

        TColCaptions.ColCaptionBag.setCaption('RaceGrid_col_QU', 'QU');
        TColCaptions.ColCaptionBag.setCaption('RaceGrid_col_DG', 'DG');
        TColCaptions.ColCaptionBag.setCaption('RaceGrid_col_MRank', 'MRank');
        TColCaptions.ColCaptionBag.setCaption('RaceGrid_col_ORank', 'ORank');
        TColCaptions.ColCaptionBag.setCaption('RaceGrid_col_Rank', 'Rank');
        TColCaptions.ColCaptionBag.setCaption('RaceGrid_col_PosR', 'PosR');

        // set the persistent flag back to false,
        // do not save default values if these are the only overrides present
        TColCaptions.ColCaptionBag.IsPersistent = false;
    }
}
