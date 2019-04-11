import { Component, Input } from '@angular/core';
import { TBOManager } from '../../bo/bo-manager';
import { TEventColGrid, TSimpleEventGrid } from '../../col/event/event-grid';
import { TEventNode } from '../../col/event/event-row-collection';
import { TBO } from '../../fr/fr-bo';
import { TTable } from '../../grid/grid-def';
import { TColorMode } from '../../col/event/event-enums';
import { IconData, EventIcons } from '../icon-legend/icon-data';

@Component({
  selector: 'app-event-tab',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {

  @Input() EventName = "Event Name";

  ColGrid: TEventColGrid;

  ColorBtnCaption: string = "";

  ColTable: TTable;

  legend: IconData[];
  LegendVisible = false;

  constructor(public BOManager: TBOManager) {
    this.initGrid();
    this.BOManager.BO.EventProps.DetailUrl = "DetailUrl";

    this.calc();
    this.updateColorBtnCaption();

    this.legend = IconData.readIconData(EventIcons);
  }

  getNode(): TEventNode {
    return this.BOManager.BO.EventNode;
  }

  initGrid() {
    this.clearMark();

    const g = new TEventColGrid(this.BOManager.BO);

    g.Grid = new TSimpleEventGrid();
    g.OnGetBaseNode = this.getNode.bind(this);
    g.SetColBOReference(this.BOManager.BO.EventBO);
    g.ColsAvail.Init();
    g.ColBO.InitColsActiveLayout(g, 0);
    g.SetupGrid();
    g.UpdateAll();

    this.ColGrid = g;    
  }

  show() {
    this.ColGrid.UpdateAll();
    this.ColTable = this.ColGrid.NewTable();
  }

  initAndShow() {
    this.initGrid();
    this.show();
  }

  calc() {
    this.BOManager.BO.EventNode.Modified = true;
    this.BOManager.BO.Calc();
    this.show();
  }

  clear() {
    for (let i = 1; i < this.BOManager.BO.EventNode.RCount; i++) {
      this.BOManager.BO.EventNode.ClearRace(i);
    }
    this.calc();
  }

  /** this method can be called from the constructor */
  private loadResult1() {
    const cl = this.BOManager.BO.EventNode.Collection.Items;

    cl[0].Race[1].OTime = 2;
    cl[1].Race[1].OTime = 7;
    cl[2].Race[1].OTime = 5;
    cl[3].Race[1].OTime = 1;
    cl[4].Race[1].OTime = 6;
    cl[5].Race[1].OTime = 8;
    cl[6].Race[1].OTime = 4;
    cl[7].Race[1].OTime = 3;

    cl[0].Race[2].OTime = 3;
    cl[1].Race[2].OTime = 4;
    cl[2].Race[2].OTime = 8;
    cl[3].Race[2].OTime = 7;
    cl[4].Race[2].OTime = 5;
    cl[5].Race[2].OTime = 6;
    cl[6].Race[2].OTime = 2;
    cl[7].Race[2].OTime = 1;

    this.calc();
  }

  /** this method can NOT be called from the constructor */
  loadResult() {
    const bo = this.BOManager.BO;
    bo.EventBO.RelaxedInputMode = true;

    // use Pos to assign RaceValue to an entry in the race
    bo.Dispatch('FR.*.W1.Pos1.RV=2');
    bo.Dispatch('FR.*.W1.Pos2.RV=7');
    bo.Dispatch('FR.*.W1.Pos3.RV=5');
    bo.Dispatch('FR.*.W1.Pos4.RV=1');
    bo.Dispatch('FR.*.W1.Pos5.RV=6');
    bo.Dispatch('FR.*.W1.Pos6.RV=8');
    bo.Dispatch('FR.*.W1.Pos7.RV=4');
    bo.Dispatch('FR.*.W1.Pos8.RV=3');

    // or use Bib
    bo.Dispatch('FR.*.W2.Bib1.RV=3');
    bo.Dispatch('FR.*.W2.Bib2.RV=4');
    bo.Dispatch('FR.*.W2.Bib3.RV=8');
    bo.Dispatch('FR.*.W2.Bib4.RV=7');
    bo.Dispatch('FR.*.W2.Bib5.RV=5');
    bo.Dispatch('FR.*.W2.Bib6.RV=6');
    bo.Dispatch('FR.*.W2.Bib7.RV=2');
    bo.Dispatch('FR.*.W2.Bib8.RV=1');

    bo.EventBO.RelaxedInputMode = false;

    this.calc();
  }

  modify() {
    this.BOManager.BO.Dispatch('FR.*.W1.Pos1.RV=99');
    this.calc();
  }

  setLayout(value: number) {
    this.BOManager.BO.EventNode.ShowPoints = value;
    this.show();
  }

  thClick(c: number) {
    if (this.ColGrid.ColsActive.SortColIndex === c) {
      this.ColGrid.DisplayOrder.Descending = !this.ColGrid.DisplayOrder.Descending;
    }
    else {
      this.ColGrid.ColsActive.SortColIndex = c;
      this.ColGrid.DisplayOrder.Descending = false;
    }
    this.show();
  }

  sortOrderClear() {
    this.ColGrid.ColsActive.SortColIndex = -1;
    this.show();
  }

  colorBtnClick(value: number = 0) {
    let cm: TColorMode = this.BOManager.BO.EventNode.ColorMode;
    switch (value) {
      case 0:
        switch (cm) {
          case TColorMode.ColorMode_None: cm = TColorMode.ColorMode_Error; break;
          case TColorMode.ColorMode_Error: cm = TColorMode.ColorMode_Fleet; break;
          case TColorMode.ColorMode_Fleet: cm = TColorMode.ColorMode_None; break;
        }
        break;
      case 1: cm = TColorMode.ColorMode_None; break;
      case 2: cm = TColorMode.ColorMode_Error; break;
      case 3: cm = TColorMode.ColorMode_Fleet; break;
    }
    this.BOManager.BO.EventNode.ColorMode = cm;
    this.updateColorBtnCaption();
    this.show();
  }

  updateColorBtnCaption() {
    switch (this.BOManager.BO.EventNode.ColorMode) {
      case TColorMode.ColorMode_None: this.ColorBtnCaption = 'Color N'; break;
      case TColorMode.ColorMode_Error: this.ColorBtnCaption = 'Color E'; break;
      case TColorMode.ColorMode_Fleet: this.ColorBtnCaption = 'Color F'; break;
    }
  }

  clearMark() {
    this.BOManager.BO.EventBO.CurrentRow = null;
  }

  mark(bib: number) {
    this.BOManager.BO.EventBO.CurrentRow = this.BOManager.BO.EventNode.FindBib(bib);
  }

  markAndShow(bib: number) {    
    this.mark(bib);
    this.show();
  }

  toggleLegend() {
    this.LegendVisible = ! this.LegendVisible;
  }
  
}
