import { Component } from '@angular/core';
import { TBOManager } from '../../bo/bo-manager';
import {
  IconData,
  IconbarIcons,
  ToolbarIcons,
  PreTextIcons,
  TextAreaIcons,
  EditbarIcons,
  CheckbarIcons,
  PreparebarIcons,
  ExplorerbarIcons,
  MsgEdit1Icons,
  EventNavIcons,
  MsgEdit2Icons,
  EventIcons,
  RaceIcons,
  EntriesIcons
} from './icon-data';

import { IconPool } from '../icon-bar-legend/icon-pool';

@Component({
  selector: 'app-icon-legend',
  templateUrl: './icon-legend.component.html',
  styleUrls: ['./icon-legend.component.css']
})
export class IconLegendComponent {

  toolbarIcons: IconData[];

  eventNavIcons: IconData[];
  iconbarIcons: IconData[];
  explorerbarIcons: IconData[];

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

  constructor(public BOManager: TBOManager) {
    this.toolbarIcons = IconData.readIconData(ToolbarIcons);

    this.eventNavIcons = IconData.readIconData(EventNavIcons);
    this.iconbarIcons = IconData.readIconData(IconbarIcons);
    this.explorerbarIcons = IconData.readIconData(ExplorerbarIcons);

    this.iconbarIcons.unshift(...this.eventNavIcons);
    this.explorerbarIcons.unshift(...this.eventNavIcons);

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
