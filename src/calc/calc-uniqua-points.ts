import { TEventProps, TScoringSystem } from '../fr/fr-event-props';
import {
  TEventRowCollectionItem,
  TEventRowCollection,
  TEventNode,
} from '../col/event/event-row-collection';
import { TBO } from '../fr/fr-bo';

export class TUniquaPoints {
  constructor(public BO: TBO) {}

  Calc(qn: TEventNode): void {
    let u: TEventProps;
    let cl: TEventRowCollection;
    let cr: TEventRowCollectionItem;
    let cr1: TEventRowCollectionItem;
    // ---
    let f: number; // Faktor
    let s: number; // Zahl der mindestens einmal gezeiteten Boote
    let z: number; // Anzahl der Wettfahrten
    // int m; // Multiplikator
    let PL: number; // Punktzahl des fiktiven Letzten
    let P1: number; // Punktzahl des Gesamtersten
    let PX: number; // Punktzahl des Bootes
    // double RA; // RanglistenPunkte aus dieser Regatta (kann m mal eingehen)
    let Platz: number;
    // double QR; // Punkte aus dieser Regatta für WMA/EMA

    try {
      u = this.BO.EventProps;

      // Ranglistenpunkte
      f = u.Faktor; // Ranglistenfaktor der Regatta
      s = u.Gezeitet; // Zahl der mindestens einmal gezeiteten Boote
      if (s === 0) {
        return;
      }

      z = u.Gesegelt; // Anzahl der Wettfahrten
      // m = 1; // Multiplikator

      // Punktzahl des fiktiven letzten
      if (u.ScoringSystem === TScoringSystem.LowPoint) {
        PL = s * z; // Low Point System
      } else {
        PL = (s + 6) * z; // Bonus System
      }

      cl = qn.Collection;

      // Punktzahl des ersten
      cr1 = cl.Items[cl.Items[0].PLZ];
      if (cr1 != null) {
        P1 = cr1.GRace.CPoints; // schnelle Variante über Platzziffer
      } else {
        P1 = 0;
        for (let i1 = 0; i1 < cl.Count; i1++) {
          cr = cl.Items[i1];
          if (cr.GRace.CPoints < P1) {
            P1 = cr.GRace.CPoints;
          }
        }
      }

      for (let i2 = 0; i2 < cl.Count; i2++) {
        cr = cl.Items[i2];

        // Ranglistenpunkte
        PX = cr.GRace.CPoints; // Punktzahl des Bootes
        if (PL - P1 !== 0) {
          cr.RA = (f * 100 * (PL - PX)) / (PL - P1);
        } else {
          cr.RA = 0;
        }
        // begrenzen
        if (cr.RA < 0) {
          cr.RA = 0;
        }

        // Punkte für WMA/EMA
        Platz = cr.GRace.Rank;
        if (s !== 0) {
          cr.QR = (100 * (s + 1 - Platz)) / s;
        } else {
          cr.QR = 0;
        }
        // begrenzen
        if (cr.QR < 0) {
          cr.QR = 0;
        }
      }
    } catch {}
  }
}
