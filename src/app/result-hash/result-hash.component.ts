import { Component, inject, OnInit } from '@angular/core';
import { TStringList } from '../../util/fb-strings';
import { TEventRowCollectionItem } from '../../col/event/event-row-collection';
import { TBOManager } from '../../bo/bo-manager';
import { TableToken } from '../../fr/fr-excel-importer';
import { TUtils } from '../../util/fb-classes';
import { MaterialModule } from '../material/material.module';

@Component({
  selector: 'app-result-hash',
  imports: [MaterialModule],
  templateUrl: './result-hash.component.html',
  styleUrls: ['./result-hash.component.scss'],
})
export class ResultHashComponent implements OnInit {
  CL = new TStringList();
  CompareMsg = '';
  ComparedOK = true;

  Info = 'info';
  TestOutput: string;

  public BOManager = inject(TBOManager);

  constructor() {}

  ngOnInit() {}

  show() {
    // this.CL.Clear();
    // this.TestOutput = this.getMsgList(this.CL);

    this.CL.Clear();

    this.writeCompareList(this.CL);

    this.Info = 'show called.';
    this.TestOutput = this.CL.Text;

    this.CL.Clear();
  }

  check() {
    this.checkMsgList(this.CL);
    this.Info = this.CompareMsg;
    if (this.ComparedOK) {
      this.TestOutput = '';
    } else {
      this.TestOutput = this.CL.Text;
    }
    this.CL.Clear();
  }

  clear() {
    this.Info = 'info';
    this.TestOutput = '';
  }

  getMsgList(SL: TStringList): string {
    const cl = this.BOManager.BO.EventNode.Collection;
    let cr: TEventRowCollectionItem;
    let v0: number;
    let v1: number;
    for (let i = 0; i < cl.Count; i++) {
      cr = cl.Items[i];
      if (cr.PLZ >= 0) {
        cr = cl.Items[cr.PLZ];
        v0 = cr.Bib;
        v1 = Math.round(cr.Race[0].CTime);
      } else {
        // should never come into here
        v0 = i;
        v1 = 0;
      }
      SL.Add(`${v0}=${v1}`); // Format('%.3d=%.5d', [v0, v1]);
    }
    return SL.Text;
  }

  writeCompareList(ML: TStringList) {
    ML.Add(TableToken.CompareListStart);
    this.getMsgList(ML);
    ML.Add(TableToken.CompareListEnd);
  }

  checkMsgList(SL: TStringList): boolean {
    // let ML: TStringList;
    let b1: number;
    let b2: number;
    let p1: number;
    let p2: number;

    SL.Clear();
    this.getMsgList(SL);

    let result = true;
    this.CompareMsg = 'Check OK';
    this.ComparedOK = true;
    const ML = this.BOManager.BO.ExcelImporter.CompareList;
    if (ML.Count === 0) {
      result = false;
      this.CompareMsg = 'Original CompareList (ML) is empty.';
      return result;
    } else if (ML.Count !== this.BOManager.BO.BOParams.StartlistCount) {
      result = false;
      this.CompareMsg = 'CompareList.Count does not match StartList.Count.';
      return result;
    } else if (ML.Count === SL.Count) {
      for (let i = 0; i < SL.Count; i++) {
        b1 = TUtils.StrToIntDef(SL.KeyFromIndex(i), -1);
        b2 = TUtils.StrToIntDef(ML.KeyFromIndex(i), -1);
        if (b1 === b2) {
          p1 = TUtils.StrToIntDef(SL.ValueFromIndex(i), -1);
          p2 = TUtils.StrToIntDef(ML.ValueFromIndex(i), -1);
          if (p1 !== p2) {
            result = false;
            SL.Update(i, `${i}: ${ML.Items(i)} : ${SL.Items(i)}`);
            this.CompareMsg = `Points mismatch at Index ${i}`;
            this.ComparedOK = false;
            // break;
          }
        } else {
          result = false;
          SL.Update(i, `${i}: ${ML.Items(i)} : ${SL.Items(i)}`);
          this.CompareMsg = `Bib mismatch at Index ${i}`;
          this.ComparedOK = false;
          // break;
        }
      }
    }
    return result;
  }

  getMemoString(): string {
    const SL = new TStringList();
    this.CL.Clear();
    this.getMsgList(this.CL);
    SL.Add('');
    const b = this.checkMsgList(this.CL);
    if (b) {
      SL.Add('CompareList-Check ok');
    } else {
      SL.Add('CompareList-Check failed - ' + this.CompareMsg);
    }

    for (let i = 0; i < this.CL.Count; i++) {
      SL.Add(this.CL.Items(i));
    }

    return SL.Text;
  }
}
