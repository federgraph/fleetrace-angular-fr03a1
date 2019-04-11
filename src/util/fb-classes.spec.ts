import { TStringList } from './fb-strings';
import { TUtils, TLineParser,TStringContainer } from './fb-classes';

describe('TUtils', () => {
  // let Utils: TStringList;
 
  it('should have good IsFalse method ', () => {
    let b;
    b = TUtils.IsFalse('0');
    expect(b).toBe(true);        
    b = TUtils.IsFalse('F');
    expect(b).toBe(true);        
    b = TUtils.IsFalse('f');
    expect(b).toBe(true);        
    b = TUtils.IsFalse('FALSE');
    expect(b).toBe(true);        
    b = TUtils.IsFalse('false');
    expect(b).toBe(true);        

    b = TUtils.IsFalse('t');
    expect(b).toBe(false);            
  });  

  it('should have good IsTrue method ', () => {
    let b;
    b = TUtils.IsTrue('1');
    expect(b).toBe(true);        
    b = TUtils.IsTrue('T');
    expect(b).toBe(true);        
    b = TUtils.IsTrue('t');
    expect(b).toBe(true);        
    b = TUtils.IsTrue('True');
    expect(b).toBe(true);        
    
    b = TUtils.IsTrue('?');
    expect(b).toBe(false);            
    b = TUtils.IsTrue('');
    expect(b).toBe(false);            
  });  

  it('should have an IsEmptyOrTrue method that also accepts an empty string for true ', () => {
    let b;
    b = TUtils.IsEmptyOrTrue('');
    expect(b).toBe(true);          
  });  

  it('should have working StartsWith method ', () => {
    let b;
    b = TUtils.StartsWith('Hello World', 'Hello');
    expect(b).toBe(true);          
    b = TUtils.StartsWith('Hello World', 'World');
    expect(b).toBe(false);              
  });  

  it('should have working EndsWith method ', () => {
    let b;
    b = TUtils.EndsWith('Hello World', 'World');
    expect(b).toBe(true);          
    b = TUtils.EndsWith('Hello World', 'Hello');
    expect(b).toBe(false);              
  });  

  it('should have working Cut method ', () => {
    const Token = new TStringContainer();

    let s = 'A.B.Hello.World';
    const delim = '.';

    s = TUtils.Cut(delim, s, Token);
    expect(s).toBe('B.Hello.World');
    expect(Token.value).toBe('A');

    s = TUtils.Cut(delim, s, Token);
    expect(s).toBe('Hello.World');
    expect(Token.value).toBe('B');

    s = TUtils.Cut(delim, s, Token);
    expect(s).toBe('World');
    expect(Token.value).toBe('Hello');

    s = TUtils.Cut(delim, s, Token);
    expect(s).toBe('');
    expect(Token.value).toBe('World');    
  });  
  
  it('should have working IncludeTrailingSlash method ', () => {
    const s = TUtils.IncludeTrailingSlash('Hello');
    expect(s).toBe('Hello/');          
    expect(s.endsWith('/')).toBe(true);

    const t = TUtils.IncludeTrailingSlash(s);
    expect(s).toBe(s);    
  });  

  it('should have working IncludeTrailingBackSlash method ', () => {
    const s = TUtils.IncludeTrailingBackSlash('Hello');
    expect(s).toBe('Hello\\');          
    expect(s.endsWith('\\')).toBe(true);

    const t = TUtils.IncludeTrailingBackSlash(s);
    expect(s).toBe(s);    
  });  
  
  it('should have working StringToBoolean method ', () => {
    let b: boolean;
    b = TUtils.StrToBoolDef('', true);
    expect(b).toBe(true);          
    b = TUtils.StrToBoolDef('', false);
    expect(b).toBe(false);
    b = TUtils.StrToBoolDef('t', false);
    expect(b).toBe(true); // default value not used beause of parsable value
  });  

  it('should have working StringToBoolean method ', () => {
    let b: boolean;
    b = TUtils.StrToBoolDef('', true);
    expect(b).toBe(true);          
    b = TUtils.StrToBoolDef('', false);
    expect(b).toBe(false);
    b = TUtils.StrToBoolDef('t', false);
    expect(b).toBe(true); // default value not used beause of parsable value
  });  

  it('should have working StringReplaceAll method ', () => {
    const s = "Alle meine Entchen";

    // replace all occurrences
    let t = TUtils.StringReplaceAll(s, ' ', '_');
    expect(t).toBe("Alle_meine_Entchen");          

    // (note, this replaces only first occurrence)
    t = s.replace(' ', '_');
    expect(t).toBe("Alle_meine Entchen");          
  });  

  it('should have working Odd method ', () => {
    let b: boolean;
    b = TUtils.Odd(5);
    expect(b).toBe(true);          
    b = TUtils.Odd(4);
    expect(b).toBe(false);              
  });  

  it('should have working StrToIntDef method ', () => {
    let n: number;
    n = TUtils.StrToIntDef('5', 1);
    expect(n).toBe(5);          
    n = TUtils.StrToIntDef('a', 1);
    expect(n).toBe(1);          
  });  
  
});

describe('TLineParser', () => {
    let LP: TLineParser;
  
    beforeEach(() => {
      LP = new TLineParser();
    });
     
    it('should have working ParseLine method ', () => {
      let b = LP.ParseLine('Key=Value');
      expect(b).toBe(true);              
      let s = LP.SL.Items(0);
      expect(s).toBe('Key=Value');                    

      b = LP.ParseLine('Key = Value');
      s = LP.SL.Items(0);
      expect(s).toBe('Key=Value');                          

      b = LP.ParseLine('Key Part_Value Part');
      s = LP.SL.Items(0);
      expect(s).toBe('Key_Part_Value_Part');                                
    });  
   
  });
  
  
