import { Component, Output, EventEmitter, inject } from '@angular/core';
import { TBOManager } from '../../bo/bo-manager';
import { TBO } from '../../fr/fr-bo';
import { TStammdatenColGrid, TSimpleStammdatenGrid } from '../../col/stammdaten/stammdaten-grid';
import { TStammdatenNode } from '../../col/stammdaten/stammdaten-node';
import { TTable } from '../../grid/grid-def';
import { IconData, EntriesIcons } from '../icon-legend/icon-data';
import { MaterialModule } from '../material/material.module';
import { IconBarLegendComponent } from '../icon-bar-legend/icon-bar-legend.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entries-tab',
  imports: [CommonModule, MaterialModule, IconBarLegendComponent],
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css'],
})
export class EntriesComponent {
  ColGrid: TStammdatenColGrid;
  ColTable: TTable;

  @Output() entriesTableChanged = new EventEmitter<number>();

  legend: IconData[];
  LegendVisible = false;

  public BOManager = inject(TBOManager);

  constructor() {
    this.initAndShow();
    this.legend = IconData.readIconData(EntriesIcons);
  }

  getNode(): TStammdatenNode {
    return this.BOManager.BO.StammdatenNode;
  }

  initGrid() {
    this.BOManager.BO = this.BOManager.BO;

    const g = new TStammdatenColGrid(this.BOManager.BO);

    g.Grid = new TSimpleStammdatenGrid();

    g.OnGetBaseNode = this.getNode.bind(this);
    g.SetColBOReference(this.BOManager.BO.StammdatenBO);
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

  thClick(c: number) {
    if (this.ColGrid.ColsActive.SortColIndex === c) {
      this.ColGrid.DisplayOrder.Descending = !this.ColGrid.DisplayOrder.Descending;
    } else {
      this.ColGrid.ColsActive.SortColIndex = c;
      this.ColGrid.DisplayOrder.Descending = false;
    }
    this.show();
  }

  empty() {
    this.BOManager.BO.StammdatenNode.Clear();
    this.show();
    this.entriesTableChanged.emit(0);
  }

  clear() {
    this.BOManager.BO.StammdatenNode.Collection.ClearList();
    this.show();
    this.entriesTableChanged.emit(1);
  }

  ensureCount() {
    const cl = this.BOManager.BO.StammdatenNode.Collection;

    while (cl.Count < this.BOManager.BO.BOParams.StartlistCount) {
      cl.Add();
    }
    this.show();
  }

  pushEntry() {
    this.getNode().Collection.Add();
    this.show();
  }

  popEntry() {
    this.getNode().Collection.Items.pop();
    this.show();
    this.entriesTableChanged.emit(4);
  }

  sortOrderClear() {
    this.ColGrid.ColsActive.SortColIndex = -1;
    this.show();
  }

  loadNames() {
    const bo = this.BOManager.BO;

    while (bo.StammdatenNode.Collection.Count < 8) {
      bo.StammdatenNode.Collection.Add();
    }

    // --- FN column (N1), and LN column (N2)
    bo.Dispatch('FR.*.SNR1001.FN=N1');
    bo.Dispatch('FR.*.SNR1001.LN=is often');
    bo.Dispatch('FR.*.SNR1002.FN=concatenated with');
    bo.Dispatch('FR.*.SNR1002.LN=N2');
    bo.Dispatch('FR.*.SNR1003.FN=and shown in');
    bo.Dispatch('FR.*.SNR1003.LN=');
    bo.Dispatch('FR.*.SNR1004.FN=computed');
    bo.Dispatch('FR.*.SNR1004.LN=DN column');
    bo.Dispatch('FR.*.SNR1005.FN=see');
    bo.Dispatch('FR.*.SNR1005.LN=event table');
    bo.Dispatch('FR.*.SNR1006.FN=');
    bo.Dispatch('FR.*.SNR1006.LN=');

    // --- SN column (N3)
    bo.Dispatch('FR.*.SNR1001.SN=SN 1');
    bo.Dispatch('FR.*.SNR1002.SN=SN 2');
    bo.Dispatch('FR.*.SNR1003.SN=SN 3');
    bo.Dispatch('FR.*.SNR1004.SN=SN 4');
    bo.Dispatch('FR.*.SNR1005.SN=SN 5');
    bo.Dispatch('FR.*.SNR1006.SN=SN 6');

    // --- NC column (N4)
    bo.Dispatch('FR.*.SNR1001.NC=NAT');
    bo.Dispatch('FR.*.SNR1002.NC=GER');
    bo.Dispatch('FR.*.SNR1003.NC=AUS II');
    bo.Dispatch('FR.*.SNR1004.NC=');
    bo.Dispatch('FR.*.SNR1005.NC=any string');
    bo.Dispatch('FR.*.SNR1006.NC=GER 15135');

    // --- GR column (N5)
    bo.Dispatch('FR.*.SNR1001.GR=F');
    bo.Dispatch('FR.*.SNR1002.GR=M');
    bo.Dispatch('FR.*.SNR1003.GR=Mixed');
    bo.Dispatch('FR.*.SNR1004.GR=');
    bo.Dispatch('FR.*.SNR1005.GR=');
    bo.Dispatch('FR.*.SNR1006.GR=');

    // --- PB column (N6)
    bo.Dispatch('FR.*.SNR1001.PB=just');
    bo.Dispatch('FR.*.SNR1002.PB=another');
    bo.Dispatch('FR.*.SNR1003.PB=string');
    bo.Dispatch('FR.*.SNR1004.PB=column');
    bo.Dispatch('FR.*.SNR1005.PB=');
    bo.Dispatch('FR.*.SNR1006.PB=');

    // --- diagonal
    bo.Dispatch('FR.*.SNR1001.N1=N1');
    bo.Dispatch('FR.*.SNR1002.N2=N2');
    bo.Dispatch('FR.*.SNR1003.N3=N3');
    bo.Dispatch('FR.*.SNR1004.N4=N4');
    bo.Dispatch('FR.*.SNR1005.N5=N5');
    bo.Dispatch('FR.*.SNR1006.N6=N6');

    // --- row 7
    bo.Dispatch('FR.*.SNR1007.FN=FN');
    bo.Dispatch('FR.*.SNR1007.LN=LN');
    bo.Dispatch('FR.*.SNR1007.SN=SN');
    bo.Dispatch('FR.*.SNR1007.NC=NC');
    bo.Dispatch('FR.*.SNR1007.GR=GR');
    bo.Dispatch('FR.*.SNR1007.PB=PB');

    // --- row 8
    bo.Dispatch('FR.*.SNR1008.FN=First Name');
    bo.Dispatch('FR.*.SNR1008.LN=Last Name');
    bo.Dispatch('FR.*.SNR1008.SN=Short Name');
    bo.Dispatch('FR.*.SNR1008.NC=NOC');
    bo.Dispatch('FR.*.SNR1008.GR=Gender');
    bo.Dispatch('FR.*.SNR1008.PB=Personal Best');

    this.show();
    this.entriesTableChanged.emit(1);
  }

  toggleLegend() {
    this.LegendVisible = !this.LegendVisible;
  }
}
