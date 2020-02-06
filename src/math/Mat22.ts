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

    get col1 (): Vec2
    {
        return new Vec2(this.a, this.c);
    }

    get col2 (): Vec2
    {
        return new Vec2(this.b, this.d);
    }

    static add (mA: Mat22, mB: Mat22): Mat22
    {
        return new Mat22(
            mA.a + mB.a,
            mA.c + mB.c,
            mA.b + mB.b,
            mA.d + mB.d
        );

        // return new Mat22().setFromVec2(
            // Vec2.add(mA.col1, mB.col1),
            // Vec2.add(mA.col2, mB.col2)
        // );
    }

    static mulMV (m: Mat22, v: Vec2): Vec2
    {
        return new Vec2(
            m.a * v.x + m.b * v.y,
            m.c * v.x + m.d * v.y
        );

        // return new Vec2(
            // m.col1.x * v.x + m.col2.x * v.y,
            // m.col1.y * v.x + m.col2.y * v.y
            // );
    }

    static mulMM (mA: Mat22, mB: Mat22): Mat22
    {
        //     Mat22.mulMV(mA, mB.col1),
        const a = mA.a * mB.a + mA.c * mB.c;
        const c = mA.b * mB.a + mA.d * mB.c;

        //     Mat22.mulMV(mA, mB.col2)
        const b = mA.a * mB.b + mA.c * mB.d;
        const d = mA.b * mB.b + mA.d * mB.d;

        return new Mat22(a, c, b, d);

        // return new Mat22(
        //     Mat22.mulMV(mA, mB.col1),
        //     Mat22.mulMV(mA, mB.col2)
        // );
    }

    static abs (m: Mat22): Mat22
    {
        return new Mat22(
            Math.abs(m.a),
            Math.abs(m.c),
            Math.abs(m.b),
            Math.abs(m.d)
        );

        // return new Mat22(
        //     Vec2.abs(m.col1),
        //     Vec2.abs(m.col2)
        // );
    }

    static transpose (m: Mat22): Mat22
    {
        return new Mat22(
            m.a,
            m.b,
            m.c,
            m.d
        );

        // return new Mat22(
        //     new Vec2(m.col1.x, m.col2.x),
        //     new Vec2(m.col1.y, m.col2.y)
        // );
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

        // const a: number = m.col1.x;
        // const b: number = m.col2.x;
        // const c: number = m.col1.y;
        // const d: number = m.col2.y;

        // const adjugate: Mat22 = new Mat22();

        // let det: number = a * d - b * c;

        //  1 / determinant, multiplied by adjugate matrix
        // det = 1 / det;

        // adjugate.col1.x = det *  d;
        // adjugate.col2.x = det * -b;

        // adjugate.col1.y = det * -c;
        // adjugate.col2.y = det *  a;

        // return adjugate;
    }
}
