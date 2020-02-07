import { Axis } from './Axis';
import Body from './Body';
import ComputeIncidentEdge from './ComputeIncidentEdge';
import Contact from './Contact';
import ClipVertex from './ClipVertex';
import { EdgeNumbers } from './EdgeNumbers';
import Mat22 from './math/Mat22';
import Vec2 from './math/Vec2';
import ClipSegmentToLine from './ClipSegmentToLine';

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

// Box vertex and edge numbering:
//
//        ^ y
//        |
//        e1
//   v2 ------ v1
//    |        |
// e2 |        | e4  --> x
//    |        |
//   v3 ------ v4
//        e3

function computeFaceAX (posA: Vec2, posB: Vec2, RotA: Mat22, RotB: Mat22, hA: Vec2, hB: Vec2, frontNormalX: number, frontNormalY: number, clipPoints2: ClipVertex[])
{
    let front: number = Vec2.dotXYV(frontNormalX, frontNormalY, posA) + hA.x;

    let sideNormalX: number = RotA.b;
    let sideNormalY: number = RotA.d;

    let side: number = Vec2.dotXYV(sideNormalX, sideNormalY, posA);

    let negSide: number = -side + hA.y;
    let posSide: number =  side + hA.y;

    //  The results get stored in this incidentEdge array
    let incidentEdge: ClipVertex[] = [];

    ComputeIncidentEdge(incidentEdge, hB, posB, RotB, frontNormalX, frontNormalY);

    //  Clip other face with 5 box planes (1 face plane, 4 edge planes)
    let clipPoints1: ClipVertex[] = [];

    //  Clip to box side 1
    let np: number = ClipSegmentToLine(clipPoints1, incidentEdge, -sideNormalX, -sideNormalY, negSide, EdgeNumbers.EDGE3);

    if (np < 2)
    {
        return null;
    }

    //  Clip to negative box side 1
    np = ClipSegmentToLine(clipPoints2, clipPoints1, sideNormalX, sideNormalY, posSide, EdgeNumbers.EDGE1);

    if (np < 2)
    {
        return null;
    }

    //  The contact separation section needs:
    return front;
}

function computeFaceAY (posA: Vec2, posB: Vec2, RotA: Mat22, RotB: Mat22, hA: Vec2, hB: Vec2, frontNormalX: number, frontNormalY: number, clipPoints2: ClipVertex[])
{
    let front: number = Vec2.dotXYV(frontNormalX, frontNormalY, posA) + hA.y;

    let sideNormalX: number = RotA.a;
    let sideNormalY: number = RotA.c;

    let side: number = Vec2.dotXYV(sideNormalX, sideNormalY, posA);

    let negSide: number = -side + hA.x;
    let posSide: number =  side + hA.x;

    //  The results get stored in this incidentEdge array
    let incidentEdge: ClipVertex[] = [];

    ComputeIncidentEdge(incidentEdge, hB, posB, RotB, frontNormalX, frontNormalY);

    //  Clip other face with 5 box planes (1 face plane, 4 edge planes)
    let clipPoints1: ClipVertex[] = [];

    //  Clip to box side 1
    let np: number = ClipSegmentToLine(clipPoints1, incidentEdge, -sideNormalX, -sideNormalY, negSide, EdgeNumbers.EDGE2);

    if (np < 2)
    {
        return null;
    }

    //  Clip to negative box side 1
    np = ClipSegmentToLine(clipPoints2, clipPoints1, sideNormalX, sideNormalY, posSide, EdgeNumbers.EDGE4);

    if (np < 2)
    {
        return null;
    }

    //  The contact separation section needs:
    return front;
}

function computeFaceBX (posA: Vec2, posB: Vec2, RotA: Mat22, RotB: Mat22, hA: Vec2, hB: Vec2, frontNormalX: number, frontNormalY: number, clipPoints2: ClipVertex[])
{
    let front: number = Vec2.dotXYV(frontNormalX, frontNormalY, posB) + hB.x;

    let sideNormalX: number = RotB.b;
    let sideNormalY: number = RotB.d;

    let side: number = Vec2.dotXYV(sideNormalX, sideNormalY, posB);

    let negSide: number = -side + hB.y;
    let posSide: number =  side + hB.y;

    //  The results get stored in this incidentEdge array
    let incidentEdge: ClipVertex[] = [];

    ComputeIncidentEdge(incidentEdge, hA, posA, RotA, frontNormalX, frontNormalY);

    //  Clip other face with 5 box planes (1 face plane, 4 edge planes)
    let clipPoints1: ClipVertex[] = [];

    //  Clip to box side 1
    let np: number = ClipSegmentToLine(clipPoints1, incidentEdge, -sideNormalX, -sideNormalY, negSide, EdgeNumbers.EDGE3);

    if (np < 2)
    {
        return null;
    }

    //  Clip to negative box side 1
    np = ClipSegmentToLine(clipPoints2, clipPoints1, sideNormalX, sideNormalY, posSide, EdgeNumbers.EDGE1);

    if (np < 2)
    {
        return null;
    }

    //  The contact separation section needs:
    return front;
}

function computeFaceBY (posA: Vec2, posB: Vec2, RotA: Mat22, RotB: Mat22, hA: Vec2, hB: Vec2, frontNormalX: number, frontNormalY: number, clipPoints2: ClipVertex[])
{
    let front: number = Vec2.dotXYV(frontNormalX, frontNormalY, posB) + hB.y;

    let sideNormalX: number = RotB.a;
    let sideNormalY: number = RotB.c;

    let side: number = Vec2.dotXYV(sideNormalX, sideNormalY, posB);

    let negSide: number = -side + hB.x;
    let posSide: number =  side + hB.x;

    //  The results get stored in this incidentEdge array
    let incidentEdge: ClipVertex[] = [];

    ComputeIncidentEdge(incidentEdge, hA, posA, RotA, frontNormalX, frontNormalY);

    //  Clip other face with 5 box planes (1 face plane, 4 edge planes)
    let clipPoints1: ClipVertex[] = [];

    //  Clip to box side 1
    let np: number = ClipSegmentToLine(clipPoints1, incidentEdge, -sideNormalX, -sideNormalY, negSide, EdgeNumbers.EDGE2);

    if (np < 2)
    {
        return null;
    }

    //  Clip to negative box side 1
    np = ClipSegmentToLine(clipPoints2, clipPoints1, sideNormalX, sideNormalY, posSide, EdgeNumbers.EDGE4);

    if (np < 2)
    {
        return null;
    }

    //  The contact separation section needs:
    return front;
}

//  Our cached collision vecs and mat22s
let hA: Vec2 = new Vec2();
let hB: Vec2 = new Vec2();
let RotA: Mat22 = new Mat22();
let RotB: Mat22 = new Mat22();
let RotAT: Mat22 = new Mat22();
let RotBT: Mat22 = new Mat22();
let dp: Vec2 = new Vec2();
let dA: Vec2 = new Vec2();
let dB: Vec2 = new Vec2();
let C: Mat22 = new Mat22();
let absC: Mat22 = new Mat22();
let absCT: Mat22 = new Mat22();
let faceA: Vec2 = new Vec2();
let faceA1: Vec2 = new Vec2();
let faceA2: Vec2 = new Vec2();
let faceB: Vec2 = new Vec2();
let faceB1: Vec2 = new Vec2();
let faceB2: Vec2 = new Vec2();

export default function Collide (contacts: Contact[], bodyA: Body, bodyB: Body): number
{
    // Setup

    // static mulSV (s: number, v: Vec2): Vec2
    // {
    //     return new Vec2(s * v.x, s * v.y);
    // }

    // let hA = Vec2.mulSV(0.5, bodyA.width); // half the width of bodyA
    // let hB = Vec2.mulSV(0.5, bodyB.width); // half the width of bodyB

    //  half the width of bodyA
    hA.set(
        0.5 * bodyA.width.x,
        0.5 * bodyA.width.y
    );

    //  half the width of bodyB
    hB.set(
        0.5 * bodyB.width.x,
        0.5 * bodyB.width.y
    );

    let posA = bodyA.position;
    let posB = bodyB.position;

    // let RotA = new Mat22().set(bodyA.rotation);
    // let RotB = new Mat22().set(bodyB.rotation);

    RotA.set(bodyA.rotation);
    RotB.set(bodyB.rotation);

    RotAT.transpose(bodyA.rotation);
    RotBT.transpose(bodyB.rotation);

    // let RotAT = Mat22.transpose(RotA);
    // let RotBT = Mat22.transpose(RotB);

    // let dp: Vec2 = Vec2.sub(posB, posA);

    dp.set(
        posB.x - posA.x,
        posB.y - posA.y
    );

    // static mulMV (m: Mat22, v: Vec2): Vec2
    // {
    //     return new Vec2(
    //         m.a * v.x + m.b * v.y,
    //         m.c * v.x + m.d * v.y
    //     );
    // }

    // let dA: Vec2 = Mat22.mulMV(RotAT, dp);

    dA.set(
        RotAT.a * dp.x + RotAT.b * dp.y,
        RotAT.c * dp.x + RotAT.d * dp.y
    );

    // let dB: Vec2 = Mat22.mulMV(RotBT, dp);

    dB.set(
        RotBT.a * dp.x + RotBT.b * dp.y,
        RotBT.c * dp.x + RotBT.d * dp.y
    );

    // let C = Mat22.mulMM(RotAT, RotB);

    C.mulMM(RotAT, RotB);

    // let absC = Mat22.abs(C);

    Mat22.absM(C, absC);

    // let absCT = Mat22.transpose(absC);

    Mat22.transposeM(absC, absCT);

    // Box A faces

    //                        faceA1                      faceA2
    // let faceA = Vec2.sub(  Vec2.sub(Vec2.abs(dA), hA), Mat22.mulMV(absC, hB)  );

    faceA1.set(
        Math.abs(dA.x) - hA.x,
        Math.abs(dA.y) - hA.y
    );

    //  store result in faceA2
    Mat22.mulMVV(absC, hB, faceA2);

    faceA.set(
        faceA1.x - faceA2.x,
        faceA1.y - faceA2.y
    );

    if (faceA.x > 0 || faceA.y > 0)
    {
        return 0;
    }

    // Box B faces

    // let faceB = Vec2.sub(
    //                      faceB1                 faceB2
    //                      Vec2.sub(Vec2.abs(dB), Mat22.mulMV(absCT, hA)),
    //                      hB);

    //  store result in faceB2
    Mat22.mulMVV(absCT, hA, faceB2);

    faceB1.set(
        Math.abs(dB.x) - faceB2.x,
        Math.abs(dB.y) - faceB2.y
    );

    faceB.set(
        faceB1.x - hB.x,
        faceB1.y - hB.y
    );

    if (faceB.x > 0 || faceB.y > 0)
    {
        return 0;
    }

    //  Find best axis

    // Box A faces

    let axis: Axis = Axis.FACE_A_X;
    let separation: number = faceA.x;

    // let normal: Vec2 = (dA.x > 0) ? RotA.col1 : Vec2.neg(RotA.col1);

    let normalX: number = 0;
    let normalY: number = 0;

    if (dA.x > 0)
    {
        normalX = RotA.a;
        normalY = RotA.c;
    }
    else
    {
        normalX = -RotA.a;
        normalY = -RotA.c;
    }

    const RELATIVE_TOL = 0.95;
    const ABSOLUTE_TOL = 0.01;

    if (faceA.y > RELATIVE_TOL * separation + ABSOLUTE_TOL * hA.y)
    {
        axis = Axis.FACE_A_Y;
        separation = faceA.y;

        if (dA.y > 0)
        {
            normalX = RotA.b;
            normalY = RotA.d;
        }
        else
        {
            normalX = -RotA.b;
            normalY = -RotA.d;
        }
    }

    // Box B faces
    if (faceB.x > RELATIVE_TOL * separation + ABSOLUTE_TOL * hB.x)
    {
        axis = Axis.FACE_B_X;
        separation = faceB.x;

        if (dB.x > 0)
        {
            normalX = RotB.a;
            normalY = RotB.c;
        }
        else
        {
            normalX = -RotB.a;
            normalY = -RotB.c;
        }
    }

    if (faceB.y > RELATIVE_TOL * separation + ABSOLUTE_TOL * hB.y)
    {
        axis = Axis.FACE_B_Y;
        separation = faceB.y;

        if (dB.y > 0)
        {
            normalX = RotB.b;
            normalY = RotB.d;
        }
        else
        {
            normalX = -RotB.b;
            normalY = -RotB.d;
        }
    }
    
    //  Setup clipping plane data based on the separating axis

    //  Compute the clipping lines and the line segment to be clipped.

    let frontNormalX: number = normalX;
    let frontNormalY: number = normalY;
    let clipPoints: ClipVertex[] = [];
    let front = null;

    if (axis === Axis.FACE_A_X)
    {
        front = computeFaceAX(posA, posB, RotA, RotB, hA, hB, frontNormalX, frontNormalY, clipPoints);
    }
    else if (axis === Axis.FACE_A_Y)
    {
        front = computeFaceAY(posA, posB, RotA, RotB, hA, hB, frontNormalX, frontNormalY, clipPoints);
    }
    else if (axis === Axis.FACE_B_X)
    {
        frontNormalX = -normalX;
        frontNormalY = -normalY;

        front = computeFaceBX(posA, posB, RotA, RotB, hA, hB, frontNormalX, frontNormalY, clipPoints);
    }
    else if (axis === Axis.FACE_B_Y)
    {
        frontNormalX = -normalX;
        frontNormalY = -normalY;

        front = computeFaceBY(posA, posB, RotA, RotB, hA, hB, frontNormalX, frontNormalY, clipPoints);
    }

    if (front === null)
    {
        return 0;
    }

    // Now clipPoints contains the clipping points.
    // Due to roundoff, it is possible that clipping removes all points.

    let numContacts: number = 0;

    for (let i = 0; i < 2; i++)
    {
        let separation = Vec2.dotXYV(frontNormalX, frontNormalY, clipPoints[i].v) - front;

        if (separation <= 0)
        {
            contacts[numContacts] = new Contact(
                separation,
                normalX,
                normalY,
                clipPoints[i].v.x - (separation * frontNormalX),
                clipPoints[i].v.y - (separation * frontNormalY),
                clipPoints[i].fp
            );

            // contacts[numContacts].separation = separation;
            // contacts[numContacts].normal.set(normalX, normalY);

            // contacts[numContacts].position = new Vec2(
            //     clipPoints[i].v.x - (separation * frontNormalX),
            //     clipPoints[i].v.y - (separation * frontNormalY)
            // );

            // contacts[numContacts].position.set(
            //     clipPoints[i].v.x - (separation * frontNormalX),
            //     clipPoints[i].v.y - (separation * frontNormalY)
            // );

            // contacts[numContacts].feature = clipPoints[i].fp;

            if (axis === Axis.FACE_B_X || axis === Axis.FACE_B_Y)
            {
                contacts[numContacts].feature.flip();
            }

            numContacts++;
        }
    }

    return numContacts;
}
