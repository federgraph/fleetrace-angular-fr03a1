import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { TBOManager } from '../bo/bo-manager';
import { TIniImage } from '../fr/fr-ini-image';
import { TMainParams } from '../bo/bo-main-params';
import { TMsgToken } from '../bo/bo-msg-token';
import { TBOParams } from '../bo/bo-params';
import { MaterialModule } from './material/material.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    MaterialModule,
    TMainParams,
    TBOParams,
    TMsgToken,
    TIniImage,
    TBOManager,
  ],
};
