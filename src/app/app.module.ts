import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { LayoutModule } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';

import { AppComponent } from './app.component';
import { EntriesComponent } from './entries/entries.component';
import { RaceComponent } from './race/race.component';
import { EventComponent } from './event/event.component';
import { EventMenuComponent } from './event-menu/event-menu.component';
import { TestDataComponent } from './test-data/test-data.component';
import { HelpComponent } from './help/help.component';
import { TimingWidgetComponent } from './timing-widget/timing-widget.component';
import { TimingButtonsComponent } from './timing-buttons/timing-buttons.component';
import { FormEventParamsComponent } from './form-event-params/form-event-params.component';
import { FormEventParamsQuickComponent } from './form-event-params-quick/form-event-params-quick.component';
import { FormEventPropsQuickComponent } from './form-event-props-quick/form-event-props-quick.component';
import { FormEventPropsComponent } from './form-event-props/form-event-props.component';
import { FormEntryRowComponent } from './form-entry-row/form-entry-row.component';
import { BibComponent } from './bib/bib.component';
import { JsonInfoComponent } from './json-info/json-info.component';
import { IconLegendComponent } from './icon-legend/icon-legend.component';
import { SaveComponent } from './save/save.component';
import { LoadComponent } from './load/load.component';
import { IconBarLegendComponent } from './icon-bar-legend/icon-bar-legend.component';
import { FeaturedEventComponent } from './featured-event/featured-event.component';
import { ResultHashComponent } from './result-hash/result-hash.component';
import { ResultUploadComponent } from './result-upload/result-upload.component';
import { UrlOptionComponent } from './url-option/url-option.component';

import { TIniImage } from '../fr/fr-ini-image';
import { TMainParams } from '../bo/bo-main-params';
import { TBOParams } from '../bo/bo-params';
import { TMsgToken } from '../bo/bo-msg-token';
import { TBOManager } from '../bo/bo-manager';

import { ONLINE_SERVICES } from './shared/services';
import { ApiComponent } from './api/api.component';
import { ConnectionControlComponent } from './connection-control/connection-control.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatTabsModule,
    MatCardModule,
    AppComponent,
    EventMenuComponent,
    TestDataComponent,
    EventComponent,
    RaceComponent,
    EntriesComponent,
    BibComponent,
    HelpComponent,
    TimingWidgetComponent,
    TimingButtonsComponent,
    FormEventParamsComponent,
    FormEventParamsQuickComponent,
    FormEventPropsQuickComponent,
    FormEventPropsComponent,
    FormEntryRowComponent,
    JsonInfoComponent,
    IconLegendComponent,
    SaveComponent,
    LoadComponent,
    IconBarLegendComponent,
    FeaturedEventComponent,
    ResultHashComponent,
    ResultUploadComponent,
    ApiComponent,
    ConnectionControlComponent,
    UrlOptionComponent,
  ],
  providers: [TIniImage, TMainParams, TBOParams, TMsgToken, TBOManager, ONLINE_SERVICES],
})
export class AppModule {}
