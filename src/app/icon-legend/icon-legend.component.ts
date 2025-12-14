import { Component, inject } from '@angular/core';
import { TBOManager } from '../../bo/bo-manager';
import {
  IconData,
  ToolbarIcons,
  CardToggleIcons,
  TabToggleIcons,
  OptionToggleIcons,
  ComponentToggleIcons,
  CommandIcons,
  PreTextIcons,
  TextAreaIcons,
  EditbarIcons,
  EventIcons,
  CheckbarIcons,
  PreparebarIcons,
  MsgEdit1Icons,
  EventNavIcons,
  MsgEdit2Icons,
  RaceIcons,
  EntriesIcons,
} from './icon-data';

import { IconPool } from '../icon-bar-legend/icon-pool';
import { MaterialModule } from '../material/material.module';
import { IconBarLegendComponent } from '../icon-bar-legend/icon-bar-legend.component';

@Component({
  imports: [MaterialModule, IconBarLegendComponent],
  selector: 'app-icon-legend',
  templateUrl: './icon-legend.component.html',
  styleUrls: ['./icon-legend.component.css'],
})
export class IconLegendComponent {
  toolbarIcons: IconData[];
  eventNavIcons: IconData[];
  cardToggleIcons: IconData[];
  tabToggleIcons: IconData[];
  optionToggleIcons: IconData[];
  componentToggleIcons: IconData[];
  commandIcons: IconData[];
  checkbarIcons: IconData[];
  editbarIcons: IconData[];
  msgEdit1Icons: IconData[];
  msgEdit2Icons: IconData[];
  preparebarIcons: IconData[];
  textAreaIcons: IconData[];
  preTextIcons: IconData[];
  eventIcons: IconData[];
  raceIcons: IconData[];
  entriesIcons: IconData[];
  pool: string[];
  PoolVisible = false;

  public BOManager = inject(TBOManager);

  constructor() {
    this.toolbarIcons = IconData.readIconData(ToolbarIcons);

    this.eventNavIcons = IconData.readIconData(EventNavIcons);
    this.cardToggleIcons = IconData.readIconData(CardToggleIcons);
    this.tabToggleIcons = IconData.readIconData(TabToggleIcons);
    this.optionToggleIcons = IconData.readIconData(OptionToggleIcons);
    this.componentToggleIcons = IconData.readIconData(ComponentToggleIcons);
    this.commandIcons = IconData.readIconData(CommandIcons);
    this.checkbarIcons = IconData.readIconData(CheckbarIcons);
    this.editbarIcons = IconData.readIconData(EditbarIcons);
    this.msgEdit1Icons = IconData.readIconData(MsgEdit1Icons);
    this.msgEdit2Icons = IconData.readIconData(MsgEdit2Icons);
    this.preparebarIcons = IconData.readIconData(PreparebarIcons);
    this.textAreaIcons = IconData.readIconData(TextAreaIcons);
    this.preTextIcons = IconData.readIconData(PreTextIcons);
    this.eventIcons = IconData.readIconData(EventIcons);
    this.raceIcons = IconData.readIconData(RaceIcons);
    this.entriesIcons = IconData.readIconData(EntriesIcons);

    this.pool = IconPool.sort();
  }

  togglePool() {
    this.PoolVisible = !this.PoolVisible;
  }
}
