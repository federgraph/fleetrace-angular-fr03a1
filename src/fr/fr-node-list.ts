import { TRaceNode } from '../col/race/race-node';
import { TBO } from './fr-bo';
import { TEventNode } from '../col/event/event-row-collection';

export class TNodeList {
  private EventNode: TEventNode;
  private RaceNodeList: TRaceNode[];

  constructor(public BO: TBO) {
    this.RaceNodeList = new Array<TRaceNode>();
  }

  AddEventNode(en: TEventNode) {
    this.EventNode = en;
  }

  AddRaceNode(rn: TRaceNode) {
    this.RaceNodeList.push(rn);
  }

  private FindRaceNodeByNameID(rd: string): TRaceNode {
    for (let i = 0; i < this.RaceNodeList.length - 1; i++) {
      const rn = this.RaceNodeList[i];
      if (rn.NameID === rd) {
        return rn;
      }
    }
    return null;
  }

  public ClearList(rd: string): void {
    if (rd === this.EventNode.NameID) {
      this.EventNode.Collection.ClearList();
      this.EventNode.Modified = true;
      return;
    }

    const bn: TRaceNode = this.FindRaceNodeByNameID(rd);
    if (bn) {
      bn.Collection.ClearList();
      bn.Modified = true;
      return;
    }

    this.EventNode.Collection.ClearList();
    this.RaceNodeList.forEach((rn: TRaceNode) => {
      rn.Collection.ClearList();
    });
  }

  ClearResult(rd: string): void {
    if (rd === this.EventNode.NameID) {
      this.EventNode.Collection.ClearResult();
      if (!this.Loading) {
        this.EventNode.Calc();
      }
      return;
    }

    const bn: TRaceNode = this.FindRaceNodeByNameID(rd);
    if (bn) {
      bn.Collection.ClearResult();
      if (!this.Loading) {
        bn.Calc();
      }
      return;
    }

    this.EventNode.Collection.ClearResult();
    if (!this.Loading) {
      this.EventNode.Calc();
    }
    this.RaceNodeList.forEach((rn: TRaceNode) => {
      rn.Collection.ClearResult();
      if (!this.Loading) {
        rn.Calc();
      }
    });
  }

  CalcNodes(): void {
    if (this.EventNode.Modified) {
      this.EventNode.Calc();
    }
    this.RaceNodeList.forEach((rn: TRaceNode) => {
      if (rn.Modified) {
        rn.Calc();
      }
    });
  }

  get Loading(): boolean {
    return this.BO.Loading;
  }
}
