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
    a: number;          // col1.x
    c: number;          // col1.y

    b: number;          // col2.x
    d: number;          // col2.y

    constructor (a: number = 0, c: number = 0, b: number = 0, d: number = 0)
    {
        //  col1
        this.a = a;
        this.c = c;
        
        //  col2
        this.b = b;
        this.d = d;

        window['mat22Total']++;
    }

    set (v: number)
    {
        const c = Math.cos(v);
        const s = Math.sin(v);

        this.a = c;
        this.c = s;
        
        this.b = -s;
        this.d = c;

        return this;
    }

    setFromVec2 (vA: Vec2, vB: Vec2)
    {
        this.a = vA.x;
        this.c = vA.y;

        this.b = vB.x;
        this.d = vB.y;

        return this;
    }

    static add (mA: Mat22, mB: Mat22): Mat22
    {
        return new Mat22(
            mA.a + mB.a,
            mA.c + mB.c,
            mA.b + mB.b,
            mA.d + mB.d
        );
    }

    static mulMV (m: Mat22, v: Vec2): Vec2
    {
        return new Vec2(
            m.a * v.x + m.b * v.y,
            m.c * v.x + m.d * v.y
        );
    }

    static mulMM (mA: Mat22, mB: Mat22): Mat22
    {
        const a = mA.a * mB.a + mA.c * mB.c;
        const c = mA.b * mB.a + mA.d * mB.c;

        const b = mA.a * mB.b + mA.c * mB.d;
        const d = mA.b * mB.b + mA.d * mB.d;

        return new Mat22(a, c, b, d);
    }

    static abs (m: Mat22): Mat22
    {
        return new Mat22(
            Math.abs(m.a),
            Math.abs(m.c),
            Math.abs(m.b),
            Math.abs(m.d)
        );
    }

    static transpose (m: Mat22): Mat22
    {
        return new Mat22(
            m.a,
            m.b,
            m.c,
            m.d
        );
    }
      
    static invert (m: Mat22): Mat22
    {
        const a: number = m.a;
        const c: number = m.c;

        const b: number = m.b;
        const d: number = m.d;

        let det: number = 1 / (a * d - b * c);

        return new Mat22(
            det * d,
            det * -b,
            det * -c,
            det * a
        );
    }
}
