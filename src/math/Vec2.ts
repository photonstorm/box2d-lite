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

export default class Vec2
{
    x: number;
    y: number;

    constructor (x: number = 0, y: number = 0)
    {
        this.x = x;
        this.y = y;

        window['vec2Total']++;
    }

    set (x: number = 0, y: number = 0)
    {
        this.x = x;
        this.y = y;

        return this;
    }

    add (v: Vec2)
    {
        this.x += v.x;
        this.y += v.y;
    }

    sub (v: Vec2)
    {
        this.x -= v.x;
        this.y -= v.y;
    }

    mul (s: number)
    {
        this.x *= s;
        this.y *= s;
    }

    static add (vA: Vec2, vB: Vec2): Vec2
    {
        return new Vec2(vA.x + vB.x, vA.y + vB.y);
    }

    static addV (vA: Vec2, vB: Vec2, out: Vec2): Vec2
    {
        return out.set(vA.x + vB.x, vA.y + vB.y);
    }

    static sub (vA: Vec2, vB: Vec2): Vec2
    {
        return new Vec2(vA.x - vB.x, vA.y - vB.y);
    }

    static subV (vA: Vec2, vB: Vec2, out: Vec2): Vec2
    {
        return out.set(vA.x - vB.x, vA.y - vB.y);
    }

    static mulVV (vA: Vec2, vB: Vec2): Vec2
    {
        return new Vec2(vA.x * vB.x, vA.y * vB.y);
    }

    static mulSV (s: number, v: Vec2): Vec2
    {
        return new Vec2(s * v.x, s * v.y);
    }

    static mulSVV (s: number, v: Vec2, out: Vec2): Vec2
    {
        return out.set(s * v.x, s * v.y);
    }

    static abs (v: Vec2): Vec2
    {
        return new Vec2(Math.abs(v.x), Math.abs(v.y));
    }

    static neg (v: Vec2): Vec2
    {
        return new Vec2(-v.x, -v.y);
    }

    static dot (vA: Vec2, vB: Vec2): number
    {
        return vA.x * vB.x + vA.y * vB.y;
    }

    static dotXYV (x: number, y: number, vB: Vec2): number
    {
        return x * vB.x + y * vB.y;
    }

    static dotXY (xA: number, yA: number, xB: number, yB: number): number
    {
        return xA * xB + yA * yB;
    }

    static crossVV (vA: Vec2, vB: Vec2): number
    {
        return vA.x * vB.y - vA.y * vB.x;
    }

    static crossVXY (vA: Vec2, x: number, y: number): number
    {
        return vA.x * y - vA.y * x;
    }

    static crossXY (x1: number, y1: number, x2: number, y2: number): number
    {
        return x1 * y2 - y1 * x2;
    }

    static crossVS (v: Vec2, s: number): Vec2
    {
        return new Vec2(s * v.y, -s * v.x);
    }

    static crossSV (s: number, v: Vec2): Vec2
    {
        return new Vec2(-s * v.y, s * v.x);
    }

    static crossSVV (s: number, v: Vec2, out: Vec2): Vec2
    {
        return out.set(-s * v.y, s * v.x);
    }
}
