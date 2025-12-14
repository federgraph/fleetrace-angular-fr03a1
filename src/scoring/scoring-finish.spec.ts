import { TFinishPosition } from './scoring-finish-position';
import { Constants, TRSPenalty } from './scoring-penalty';
import { TFinish } from './scoring-finish';
import { TRace } from './scoring-race';
import { TEntry } from './scoring-entry';

describe('scoring-finish', () => {
  it('test construction of TFinish(r, e)', () => {
    const e = new TEntry();
    e.EntryID = 1;
    e.SailID = 1001;

    const r = new TRace(1);
    r.IsRacing = true;

    const cr = new TFinish(r, null);
    const fp = cr.FinishPosition;
    expect(fp.fFinishPosition).toBe(Constants.NOF);
    expect(fp.isValidFinish()).toBe(false);
    expect(fp.isFinisher()).toBe(false);
  });

  it('test construction of TFinish(r, e, fp)', () => {
    const r = new TRace(1);
    r.IsRacing = true;

    const e = new TEntry();
    e.EntryID = 1;
    e.SailID = 1001;

    let fp = new TFinishPosition(2);

    const cr = new TFinish(r, e, fp);
    fp = cr.FinishPosition;
    expect(fp.fFinishPosition).toBe(Constants.NOF);
    expect(fp.isValidFinish()).toBe(false);
    expect(fp.isFinisher()).toBe(false);
    expect(fp.intValue()).toBe(Constants.NOF);
    expect(fp.toString()).toBe('No Finish');
  });

  it('test construction of TFinish(r, e, fp, p)', () => {
    const r = new TRace(1);
    r.IsRacing = true;

    const e = new TEntry();
    e.EntryID = 1;
    e.SailID = 1001;

    let fp = new TFinishPosition(2);

    const p = new TRSPenalty(1);

    const cr = new TFinish(r, e, fp, p);
    fp = cr.FinishPosition;
    expect(fp.fFinishPosition).toBe(2);
    expect(fp.isValidFinish()).toBe(true);
    expect(fp.isFinisher()).toBe(true);
    expect(fp.intValue()).toBe(2);
    expect(fp.toString()).toBe('2');
  });
});
