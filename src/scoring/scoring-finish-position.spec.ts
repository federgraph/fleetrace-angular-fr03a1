import { TFinishPosition } from './scoring-finish-position';
import { Constants } from './scoring-penalty';

describe('scoring-finish-position', () => {
  it('should pass isValidFinish test ', () => {
    const fp = new TFinishPosition(1);

    let b: boolean = fp.isValidFinish();
    expect(b).toBe(true);

    b = fp.isFinisher();
    expect(b).toBe(true);
  });

  it('should be able to test for nofinish penalty', () => {
    const nf = Constants.NF;

    let f = 0;
    let t = f & nf;
    expect(t === 0).toBe(true);

    f = Constants.DNS;
    t = f & nf;
    expect(t !== 0).toBe(true);
  });
});
