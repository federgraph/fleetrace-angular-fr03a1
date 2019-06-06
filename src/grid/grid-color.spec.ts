import { ColorConst, TColorRec, TColorTranslator } from './grid-color';
import { Color } from '../util/fb-color';

describe('grid-color', () => {

    it('- TColorTranslator should pass GetValue tests', () => {
        const cr = new TColorTranslator();

        const c = 0x708090;
        let v: number;

        v = cr.GetRValue(c);
        expect(v).toEqual(0x70);

        v = cr.GetGValue(c);
        expect(v).toEqual(0x80);

        v = cr.GetBValue(c);
        expect(v).toEqual(0x90);
    });

    it('should pass getRGBHexString() test', () => {
        const cr = new TColorTranslator();
        const s = cr.getRGBHexString('slategray');
        const c = Number.parseInt('0x' + s, 16);
        expect(c === 0x708090).toBe(true);
    });

    it('should pass GetRGB() test', () => {
        const cr = new TColorTranslator();
        const c = cr.GetRGB(0x70, 0x80, 0x90);
        expect(c === 0x708090).toBe(true);
    });

    it('should pass HellRot test', () => {
        const cr = new TColorTranslator();
        const c = ColorConst.clHellRot;
        let v: number;

        v = cr.GetRValue(c);
        expect(v).toEqual(0x80);
        v = cr.GetGValue(c);
        expect(v).toEqual(0x80);
        v = cr.GetBValue(c);
        expect(v).toEqual(255);
    });

    it('should pass shift test', () => {
        let v: number;

        v = (255 << 16);
        expect(v).toEqual(0xFF0000);
        v = v >> 16;
        expect(v).toEqual(255);
    });

    it('should pass hexColorString() test', () => {
        const cr = new TColorTranslator();
        let s: string;

        s = cr.hexColorString('abc');
        expect(s).toBe('#ffffff');

        s = cr.hexColorString('red');
        expect(s).toBe('#ff0000');
    });

    it('should pass Color test 1', () => {
        const c = new Color(255, 160, 128);
        expect(c.r).toBe(255);
        expect(c.g).toBe(160);
        expect(c.b).toBe(128);
        expect(c.toHex()).toBe('#ffa080');
    });

    it('should pass Color test 2', () => {
        const c = new Color(255, 0, 0);
        expect(c.r).toBe(255);
        expect(c.g).toBe(0);
        expect(c.b).toBe(0);
        expect(c.toHex()).toBe('#ff0000');
    });

    it('should pass Color test 3', () => {
        const cr = new TColorTranslator();
        const s = cr.TranslateColor(TColorRec.Red);
        expect(s).toBe('#ff0000');
    });

    it('should pass Color test 3', () => {
        const nf = new Intl.NumberFormat('en-us', {minimumFractionDigits: 2});
        const n = 1;
        const s = nf.format(n);
        expect(s).toBe('1.00');
    });

});
