import { TStringList } from './fb-strings';

describe('TStringList', () => {
  let SL: TStringList;

  beforeEach(() => {
    SL = new TStringList();
    SL.Add('Hello');
    SL.Add('World');
  });

  it('should have Hello and World Items during test ', () => {
    const s = SL.Items(0);
    const t = SL.SL[1];
    expect(s).toBe('Hello');
    expect(t).toBe('World');
  });

  it('should have Count property returning the number of Items ', () => {
    const c = SL.Count;
    expect(c).toBe(2);
  });

  it('should return the index of a string if present or -1 ', () => {
    let i: number;
    i = SL.IndexOf('World');
    expect(i).toBe(1);
    i = SL.IndexOf('StringDoesNotExist');
    expect(i).toBe(-1);
  });

  it('should have a CommaText property ', () => {
    const ct = SL.CommaText;
    expect(ct).toBe('Hello,World');
  });

  it('should have a working Delete method ', () => {
    SL.Add('from');
    SL.Add('Delete-Test.');
    SL.Delete(1);
    const ct = SL.CommaText;
    expect(ct).toBe('Hello,from,Delete-Test.');
  });

  it('should have a working Insert method ', () => {
    SL.Insert(1, 'crazy');
    const ct = SL.CommaText;
    expect(ct).toBe('Hello,crazy,World');
  });

});

