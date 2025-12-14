import { TBaseMsg } from './bo-msg-base';
import { TIniImage } from '../fr/fr-ini-image';
import { TBOManager } from './bo-manager';
import { TBOParams } from './bo-params';

export abstract class TBaseBO {
  CounterMsgHandled = 0;
  BackupDir = '';

  constructor(
    public IniImage: TIniImage,
    public BOManager: TBOManager,
    public BOParams: TBOParams,
  ) {}

  protected FLoading = false;
  get Loading(): boolean {
    return this.FLoading;
  }

  abstract Calc(): boolean;
  NewMsg(): TBaseMsg {
    return new TBaseMsg();
  }
}
