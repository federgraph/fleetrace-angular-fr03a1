import { TGridCells, TCell } from './grid-cells';

describe('grid-cells', () => {

    it('should return true for property HasGroup if GroupColor != clFleetNone', () => {
        const o = new TGridCells();
        let s = 'Hello';

        const k1 = new TCell(0, 0);
        o.map.set(k1.value, s);

        expect(o.map.has(k1.value)).toBe(true);
        expect(o.map.get(k1.value)).toEqual(s);

        const k2 = new TCell(0, 0);
        expect(o.map.has(k2.value)).toBe(true);
        expect(o.map.get(k2.value)).toEqual(s);

        o.SetCells(0, 0, s);
        expect(o.GetCells(0, 0)).toEqual(s);

        s = 'World';
        o.SetCells(0, 1, s);
        expect(o.GetCells(0, 1)).toBe(s);
    });

});

