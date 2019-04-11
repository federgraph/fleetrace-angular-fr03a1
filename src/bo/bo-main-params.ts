import { Injectable } from "@angular/core";

export enum TEditPage {
    epNone,
    epParams,
    epEvent,
    epIni,
    epNames,
    epDB
}

@Injectable({
    providedIn: 'root'
  })  
export class TMainParams {
    DisabledEditPages: Array<TEditPage> = [];

    TimingGridBibCount: number;
    TimingGridColCount: number;
    TimingGridRowCount: number;

    UserLevel: number = 0;

    AutoSave: boolean;
    NoAutoSave: boolean;
    UseUnicode: boolean;
    UseDoubleBuffer: boolean;
    WantXSL: boolean;
    WantAutoSync: boolean;
    WantBridgeMsgBroadcast: boolean;
    UseDB: boolean;
    ContextPath: string;
    WebRoot: string;
    SkipTestForListeningSocket: boolean;
    AutoPlugin: boolean;
    AutoOnline: boolean;
    AutoUpload: boolean;
    AutoHomeWeb: boolean;
    AutoRemoteWeb: boolean;
    AutoSilverlightWeb: boolean;
    AutoPolicyServer: boolean;
    WantDocrootResults: boolean;
    UseProxyBase: boolean = false;
    ThemeID: number;
    WantWeb: boolean;
    IsSpecialVersion: boolean = false;
    WantNames: boolean;
    WantAuthentication: boolean;

    constructor() {
        this.TimingGridBibCount = 20;
        this.TimingGridColCount = 10;
        this.TimingGridRowCount = 16;
        this.AutoSave = false;
        this.NoAutoSave = true;
        this.UseUnicode = true;
        this.UseDoubleBuffer = true;
        this.WantXSL = true;
        this.WantAutoSync = true;
        this.WantBridgeMsgBroadcast = true;
        this.UseDB = false;
        this.ContextPath = '';
        this.WebRoot = '';
        this.SkipTestForListeningSocket = true;
        this.AutoPlugin = false;
        this.AutoOnline = true;
        this.AutoUpload = false;
        this.AutoHomeWeb = false;
        this.AutoRemoteWeb = false;
        this.AutoSilverlightWeb = false;
        this.AutoPolicyServer = false;
        this.WantDocrootResults = false;
        this.ThemeID = 2;
        this.WantWeb = true;
        this.WantNames = true;
        this.WantAuthentication = false;
    }

}
