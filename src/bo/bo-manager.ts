import { inject, Injectable } from '@angular/core';

import { TBOParams } from './bo-params';
import { TIniImage } from '../fr/fr-ini-image';
import { TUtils } from '../util/fb-classes';
import { TStringList } from '../util/fb-strings';
import { TMsgToken } from './bo-msg-token';
import { TBO } from '../fr/fr-bo';
import { TMainParams } from './bo-main-params';

@Injectable({
  providedIn: 'root',
})
export class TBOManager {
  SL: TStringList;

  BO: TBO;
  BigButtonRow = false;
  IsDebug = false;

  public IniImage = inject(TIniImage);
  public MainParams = inject(TMainParams);
  public BOParams = inject(TBOParams);
  public MsgToken = inject(TMsgToken);

  constructor() {
    this.SL = new TStringList();
    this.SL.Text = this.GetDefaultData();
    this.BO = new TBO(this.BOParams, this.IniImage, this, this.MsgToken);
  }

  GetTestData(): string {
    return this.SL.Text;
  }

  private ParseBOParams(ML: TStringList): TBOParams {
    const BOParams: TBOParams = new TBOParams();
    let n: string;
    let v: string;

    let paramsRead = 0;
    for (let i = 0; i < ML.Count; i++) {
      n = ML.KeyFromIndex(i).trim();
      v = ML.ValueFromIndex(i).trim();
      if (n === 'DP.StartlistCount' || n === 'Event.StartlistCount') {
        BOParams.StartlistCount = TUtils.StrToIntDef(v, BOParams.StartlistCount);
        paramsRead++;
      } else if (n === 'DP.ITCount' || n === 'Event.ITCount') {
        BOParams.ITCount = TUtils.StrToIntDef(v, BOParams.ITCount);
        paramsRead++;
      } else if (n === 'DP.RaceCount' || n === 'Event.RaceCount') {
        BOParams.RaceCount = TUtils.StrToIntDef(v, BOParams.RaceCount);
        paramsRead++;
      } else if (n === 'EP.DivisionName' || n === 'Event.Prop_DivisionName') {
        BOParams.DivisionName = v;
        paramsRead++;
      }
      if (paramsRead === 3) {
        break;
      }
    }
    return BOParams;
  }

  GetDefaultData(): string {
    return `#Params

      DP.StartlistCount = 8
      DP.ITCount = 1
      DP.RaceCount = 2

      #Event Properties

      EP.Name = NameTest
      EP.ScoringSystem = Low Point System
      EP.Throwouts = 0
      EP.DivisionName = 420
      EP.InputMode = Strict
      EP.RaceLayout = Finish
      EP.NameSchema = NX
      EP.FieldMap = FN,_,LN
      EP.FieldCaptions = FN,LN,SN,NAT,FN2,LN2,CPos
      EP.FieldCount = 7
      EP.NameFieldCount = 2
      EP.NameFieldOrder = 04
      EP.UseFleets = False
      EP.TargetFleetSize = 8
      EP.FirstFinalRace = 20
      EP.IsTimed = True
      EP.UseCompactFormat = True

      NameList.Begin
      SNR;N1;N2;N3;N4;N5;N6;N7
      1000;FN1;LN1;SN1;GER;FN2-1;LN2-1;x
      1001;FN2;LN2;SN2;ITA;FN2-2;LN2-2;y
      1002;FN3;LN3;SN3;FRA;FN2-3;LN2-3;z
      NameList.End

      StartList.Begin
      Pos;SNR;Bib
      1;1000;1
      2;1001;2
      3;1002;3
      4;1003;4
      5;1004;5
      6;1005;6
      7;1006;7
      8;1007;8
      StartList.End

      FinishList.Begin
      SNR;Bib;R1;R2
      1000;1;2;3
      1001;2;7;4
      1002;3;5;8
      1003;4;1;7
      1004;5;6;5
      1005;6;8;6
      1006;7;4;2
      1007;8;3;1
      FinishList.End

      #W1

      #W2

      EP.IM = Strict
      `;
  }

  DeleteBO() {
    this.BO = null;
  }

  LoadNew(data: string): void {
    const ml: TStringList = new TStringList();
    ml.Text = data;

    const bop = this.ParseBOParams(ml); // load params in data

    this.DeleteBO();
    this.BOParams.Assign(bop);
    this.BOParams.ForceWithinLimits();

    this.BO = new TBO(this.BOParams, this.IniImage, this, this.MsgToken);

    this.BO.Load(ml.Text); // load data in data
    this.BO.Calc();
  }
}
