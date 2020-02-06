import ClipVertex from './ClipVertex';
import { EdgeNumbers } from './EdgeNumbers';
import Mat22 from './math/Mat22';
import Vec2 from './math/Vec2';

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

export default function ComputeIncidentEdge (c: ClipVertex[], h: Vec2, pos: Vec2, Rot: Mat22, normalX: number, normalY: number): void
{
    //  The normal is from the reference box
    //  Convert it to the incident box frame and flip sign

    // let RotT: Mat22 = Mat22.transpose(Rot);

    let invA = Rot.a;
    let invB = Rot.c;
    let invC = Rot.b;
    let invD = Rot.d;

    // let n: Vec2 = new Vec2(
    //     -(RotT.a * normalX + RotT.b * normalY),
    //     -(RotT.c * normalX + RotT.d * normalY)
    // );

    let n: Vec2 = new Vec2(
        -(invA * normalX + invB * normalY),
        -(invC * normalX + invD * normalY)
    );

    let nAbs: Vec2 = Vec2.abs(n);

    const clipVertex0: ClipVertex = new ClipVertex();
    const clipVertex1: ClipVertex = new ClipVertex();

    if (nAbs.x > nAbs.y)
    {
        if (Math.sign(n.x) > 0)
        {
            clipVertex0.v.set(h.x, -h.y);
            clipVertex0.fp.e.inEdge2 = EdgeNumbers.EDGE3;
            clipVertex0.fp.e.outEdge2 = EdgeNumbers.EDGE4;

            clipVertex1.v.set(h.x, h.y);
            clipVertex1.fp.e.inEdge2 = EdgeNumbers.EDGE4;
            clipVertex1.fp.e.outEdge2 = EdgeNumbers.EDGE1;
        }
        else
        {
            clipVertex0.v.set(-h.x, h.y);
            clipVertex0.fp.e.inEdge2 = EdgeNumbers.EDGE1;
            clipVertex0.fp.e.outEdge2 = EdgeNumbers.EDGE2;

            clipVertex1.v.set(-h.x, -h.y);
            clipVertex1.fp.e.inEdge2 = EdgeNumbers.EDGE2;
            clipVertex1.fp.e.outEdge2 = EdgeNumbers.EDGE3;
        }
    }
    else
    {
        if (Math.sign(n.y) > 0)
        {
            clipVertex0.v.set(h.x, h.y);
            clipVertex0.fp.e.inEdge2 = EdgeNumbers.EDGE4;
            clipVertex0.fp.e.outEdge2 = EdgeNumbers.EDGE1;

            clipVertex1.v.set(-h.x, h.y);
            clipVertex1.fp.e.inEdge2 = EdgeNumbers.EDGE1;
            clipVertex1.fp.e.outEdge2 = EdgeNumbers.EDGE2;
        }
        else
        {
            clipVertex0.v.set(-h.x, -h.y);
            clipVertex0.fp.e.inEdge2 = EdgeNumbers.EDGE2;
            clipVertex0.fp.e.outEdge2 = EdgeNumbers.EDGE3;

            clipVertex1.v.set(h.x, -h.y);
            clipVertex1.fp.e.inEdge2 = EdgeNumbers.EDGE3;
            clipVertex1.fp.e.outEdge2 = EdgeNumbers.EDGE4;
        }
    }

    // clipVertex0.v = Vec2.add(pos, Mat22.mulMV(Rot, clipVertex0.v));
    // clipVertex1.v = Vec2.add(pos, Mat22.mulMV(Rot, clipVertex1.v));
    
    //  inline:
    const v0 = clipVertex0.v;
    const v1 = clipVertex1.v;

    let mx = pos.x + (Rot.a * v0.x + Rot.b * v0.y);
    let my = pos.y + (Rot.c * v0.x + Rot.d * v0.y);

    v0.set(mx, my);

    mx = pos.x + (Rot.a * v1.x + Rot.b * v1.y);
    my = pos.y + (Rot.c * v1.x + Rot.d * v1.y);

    v1.set(mx, my);

    c[0] = clipVertex0;
    c[1] = clipVertex1;
}
