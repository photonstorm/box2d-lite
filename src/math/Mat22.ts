import Vec2 from './Vec2';

/**
 * Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
 *
 * Permission to use, copy, modify, distribute and sell this software
 * and its documentation for any purpose is hereby granted without fee,
 * provided that the above copyright notice appear in all copies.
 * Erin Catto makes no representations about the suitability 
 * of this software for any purpose.  
 * It is provided "as is" without express or implied warranty.
 * 
 * Ported to TypeScript by Richard Davey, 2020.
 */

export default class Mat22
{
    col1: Vec2 = new Vec2();
    col2: Vec2 = new Vec2();

    constructor (aOvA?: number | Vec2, vB?: Vec2)
    {
        if (typeof aOvA === 'number' && vB === undefined)
        {
            const c = Math.cos(aOvA);
            const s = Math.sin(aOvA);

            this.col1.set(c, s);
            this.col2.set(-s, c);
        }
        else if (typeof aOvA === 'object' && typeof vB === 'object')
        {
            this.col1 = aOvA;
            this.col2 = vB;
        }
    }

    static add (mA: Mat22, mB: Mat22): Mat22
    {
        return new Mat22(Vec2.add(mA.col1, mB.col1), Vec2.add(mA.col2, mB.col2));
    }

    static mulMV (m: Mat22, v: Vec2): Vec2
    {
        return new Vec2(m.col1.x * v.x + m.col2.x * v.y, m.col1.y * v.x + m.col2.y * v.y);
    }

    static mulMM (mA: Mat22, mB: Mat22): Mat22
    {
        return new Mat22(Mat22.mulMV(mA, mB.col1), Mat22.mulMV(mA, mB.col2));
    }

    static abs (m: Mat22): Mat22
    {
        return new Mat22(Vec2.abs(m.col1), Vec2.abs(m.col2));
    }

    static transpose (m: Mat22): Mat22
    {
        return new Mat22(new Vec2(m.col1.x, m.col2.x), new Vec2(m.col1.y, m.col2.y));
    }
      
    static invert (m: Mat22): Mat22
    {
        const a: number = m.col1.x;
        const b: number = m.col2.x;
        const c: number = m.col1.y;
        const d: number = m.col2.y;

        const adjugate: Mat22 = new Mat22();

        let det: number = a * d - b * c;

        //  1 / determinant, multiplied by adjugate matrix
        det = 1 / det;

        adjugate.col1.x = det *  d;
        adjugate.col2.x = det * -b;

        adjugate.col1.y = det * -c;
        adjugate.col2.y = det *  a;

        return adjugate;
    }
}
