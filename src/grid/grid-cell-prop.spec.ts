import { TCellProp, TCellProps } from './grid-cell-prop';
import { ColorConst, TColorRec } from './grid-color';

describe('TCellProp', () => {

    it('should return true for property HasGroup if GroupColor != clFleetNone', () => {
        const cr = new TCellProp();

        cr.GroupColor = ColorConst.clFleetNone;
        expect(cr.HasGroup).toBe(false);

        cr.GroupColor = TColorRec.Red;
        expect(cr.HasGroup).toBe(true);
    });

});

describe('TCellProps', () => {

    it('should work as expected', () => {
        const cl = new TCellProps();
        let cc = cl.ColCount;
        expect(cc).toBe(0);
        
        cl.ColCount = 1;
        cc = cl.ColCount;
        expect(cc).toBe(1);

        const ARow = 0;
        const ACol = 1;

        let cp = cl.GetCellProp(ACol, ARow);
        let c = cp.Color;
        expect(c).toBe(TColorRec.White);

        cp.Color = 1;
        cp = cl.GetCellProp(ACol, ARow);
        c = cp.Color;
        expect(c).toBe(1);

        cl.Clear();
        expect(cl.ColCount).toBe(0);
    });

});
