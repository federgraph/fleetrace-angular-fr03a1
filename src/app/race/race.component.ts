import { Component, Input } from '@angular/core';
import { TBOManager } from '../../bo/bo-manager';
import { TRaceColGrid, TSimpleRaceGrid } from '../../col/race/race-grid';
import { TRaceNode } from '../../col/race/race-node';
import { TBO } from '../../fr/fr-bo';
import { TTable } from '../../grid/grid-def';
import { IconData, RaceIcons } from '../icon-legend/icon-data';

@Component({
  selector: 'app-race-tab',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.css']
})
export class RaceComponent {
  FRace = 1;
  FTimePoint = 0;

  ColGrid: TRaceColGrid;

  ColTable: TTable;

  legend: IconData[];
  LegendVisible = false;

  resetRaceAndTimePoint() {
    this.FRace = 1;
    this.FTimePoint = 0;
  }
  initRaceAndTimePoint(r: number, tp: number) {
    this.FRace = r;
    this.FTimePoint = tp;
  }

  get race(): number {
    return this.FRace;
  }
  @Input() set race(value: number) {
    this.FRace = value;
    this.show();
  }

  get timepoint(): number {
    return this.FTimePoint;
  }
  @Input() set timepoint(value: number) {
    this.FTimePoint = value;
    this.BOManager.BO.RaceBO.CurrentNode.Layout = value;
    this.BOManager.BO.RaceBO.InitColsActive(this.ColGrid);
    this.show();
  }

  constructor(public BOManager: TBOManager) {
    this.initGrid();
    this.legend = IconData.readIconData(RaceIcons);
  }

  getNode(): TRaceNode {
    return this.BOManager.BO.RNode[this.race];
  }

  initGrid() {
    this.clearMark();

    const g = new TRaceColGrid(this.BOManager.BO);

    g.Grid = new TSimpleRaceGrid();
    g.OnGetBaseNode = this.getNode.bind(this);
    g.SetColBOReference(this.BOManager.BO.RaceBO);
    g.ColsAvail.Init();
    g.ColBO.InitColsActive(g);
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
    this.BOManager.BO = this.BOManager.BO;
    if (this.race < this.BOManager.BO.RNode.length) {
      const rn = this.BOManager.BO.RNode[this.race];
      if (rn) {
        rn.Modified = true;
        this.BOManager.BO.Calc();
        this.show();
      }
      else {
        console.log(`rn invalid for this.race = ${this.race} in race.component.calc `);
      }
    }
    else {
      console.log(`out of range: RNode[${this.race}] in race.component.calc `);
    }

  }

  clearRace() {
    this.BOManager.BO.RNode[this.race].Collection.ClearResult();
    this.calc();
  }

  clearTP() {
    this.BOManager.BO.RNode[this.race].Collection.ClearTP(this.timepoint);
    this.calc();
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

  toggleLayout() {
    const cb = this.BOManager.BO.RaceBO;
    if (!cb)
      return;

    if (cb.TableLayout === 0)
      cb.TableLayout = 1;
    else
      cb.TableLayout = 0;

    cb.InitColsActiveLayout(this.ColGrid, this.FTimePoint);
    this.show();
  }

  updateEvent() {
    const ru = this.BOManager.BO.RNode[this.race];
    this.BOManager.BO.CopyFromRaceNode(ru, false);
  }

  toMRank() {
    const ru = this.BOManager.BO.RNode[this.race];
    ru.CopyToMRank();
    this.show();
  }

  fromMRank() {
    const ru = this.BOManager.BO.RNode[this.race];
    if (ru) {
      ru.CopyFromMRank();
      this.show();
    }
    else {
      console.log(`out of range: RNode[${this.race}} in race.component.fromMRank`);
    }
  }

  clearMark() {
    const ru = this.BOManager.BO.RNode[this.race];
    if (ru) {
      ru.ColBO.CurrentRow = null;
    }
  }

  mark(bib: number) {
    const ru = this.BOManager.BO.RNode[this.race];
    ru.ColBO.CurrentRow = ru.FindBib(bib);
  }

  markAndShow(bib: number) {
    this.mark(bib);
    this.show();
  }

  toggleLegend() {
    this.LegendVisible = !this.LegendVisible;
  }

}
