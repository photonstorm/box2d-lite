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

export default function Collide (contacts: Contact[], bodyA: Body, bodyB: Body): number
{
    // Setup
    let hA = Vec2.mulSV(0.5, bodyA.width); // half the width of bodyA
    let hB = Vec2.mulSV(0.5, bodyB.width); // half the width of bodyB

    let posA = bodyA.position;
    let posB = bodyB.position;

    let RotA = new Mat22(bodyA.rotation);
    let RotB = new Mat22(bodyB.rotation);

    let RotAT = Mat22.transpose(RotA);
    let RotBT = Mat22.transpose(RotB);

    let dp: Vec2 = Vec2.sub(posB, posA);
    let dA: Vec2 = Mat22.mulMV(RotAT, dp);
    let dB: Vec2 = Mat22.mulMV(RotBT, dp);

    let C = Mat22.mulMM(RotAT, RotB);
    let absC = Mat22.abs(C);
    let absCT = Mat22.transpose(absC);

    // Box A faces
    let faceA = Vec2.sub(Vec2.sub(Vec2.abs(dA), hA), Mat22.mulMV(absC, hB));

    if (faceA.x > 0 || faceA.y > 0)
    {
        return 0;
    }

    // Box B faces
    let faceB = Vec2.sub(Vec2.sub(Vec2.abs(dB), Mat22.mulMV(absCT, hA)), hB);

    if (faceB.x > 0 || faceB.y > 0)
    {
        return 0;
    }

    //  Find best axis

    // Box A faces

    let axis: Axis = Axis.FACE_A_X;
    let separation: number = faceA.x;
    let normal: Vec2 = (dA.x > 0) ? RotA.col1 : Vec2.neg(RotA.col1);

    const RELATIVE_TOL = 0.95;
    const ABSOLUTE_TOL = 0.01;

    if (faceA.y > RELATIVE_TOL * separation + ABSOLUTE_TOL * hA.y)
    {
        axis = Axis.FACE_A_Y;
        separation = faceA.y;
        normal = (dA.y > 0) ? RotA.col2 : Vec2.neg(RotA.col2);
    }

    // Box B faces
    if (faceB.x > RELATIVE_TOL * separation + ABSOLUTE_TOL * hB.x)
    {
        axis = Axis.FACE_B_X;
        separation = faceB.x;
        normal = (dB.x > 0) ? RotB.col1 : Vec2.neg(RotB.col1);
    }

    if (faceB.y > RELATIVE_TOL * separation + ABSOLUTE_TOL * hB.y)
    {
        axis = Axis.FACE_B_Y;
        separation = faceB.y;
        normal = (dB.y > 0) ? RotB.col2 : Vec2.neg(RotB.col2);
    }
    
    //  Setup clipping plane data based on the separating axis
    let frontNormal: Vec2;
    let sideNormal: Vec2;
    let incidentEdge: ClipVertex[] = [];
    let front: number;
    let negSide: number;
    let posSide: number;
    let negEdge: EdgeNumbers;
    let posEdge: EdgeNumbers;
    let side: number;

    //  Compute the clipping lines and the line segment to be clipped.

    switch (axis)
    {
        case Axis.FACE_A_X:
            frontNormal = normal;
            front = Vec2.dot(posA, frontNormal) + hA.x;
            sideNormal = RotA.col2;
            side = Vec2.dot(posA, sideNormal);
            negSide = -side + hA.y;
            posSide =  side + hA.y;
            negEdge = EdgeNumbers.EDGE3;
            posEdge = EdgeNumbers.EDGE1;
            ComputeIncidentEdge(incidentEdge, hB, posB, RotB, frontNormal);
            break;

        case Axis.FACE_A_Y:
            frontNormal = normal;
            front = Vec2.dot(posA, frontNormal) + hA.y;
            sideNormal = RotA.col1;
            side = Vec2.dot(posA, sideNormal);
            negSide = -side + hA.x;
            posSide =  side + hA.x;
            negEdge = EdgeNumbers.EDGE2;
            posEdge = EdgeNumbers.EDGE4;
            ComputeIncidentEdge(incidentEdge, hB, posB, RotB, frontNormal);
            break;
          
        case Axis.FACE_B_X:
            frontNormal = Vec2.neg(normal);
            front = Vec2.dot(posB, frontNormal) + hB.x;
            sideNormal = RotB.col2;
            side = Vec2.dot(posB, sideNormal);
            negSide = -side + hB.y;
            posSide =  side + hB.y;
            negEdge = EdgeNumbers.EDGE3;
            posEdge = EdgeNumbers.EDGE1;
            ComputeIncidentEdge(incidentEdge, hA, posA, RotA, frontNormal);
            break;

        case Axis.FACE_B_Y:
            frontNormal = Vec2.neg(normal);
            front = Vec2.dot(posB, frontNormal) + hB.y;
            sideNormal = RotB.col1;
            side = Vec2.dot(posB, sideNormal);
            negSide = -side + hB.x;
            posSide =  side + hB.x;
            negEdge = EdgeNumbers.EDGE2;
            posEdge = EdgeNumbers.EDGE4;
            ComputeIncidentEdge(incidentEdge, hA, posA, RotA, frontNormal);
            break;
    }

    //  Clip other face with 5 box planes (1 face plane, 4 edge planes)

    let clipPoints1: ClipVertex[] = [];
    let clipPoints2: ClipVertex[] = [];

    //  Clip to box side 1
    let np: number = ClipSegmentToLine(clipPoints1, incidentEdge, Vec2.neg(sideNormal), negSide, negEdge);

    if (np < 2)
    {
        return 0;
    }

    //  Clip to negative box side 1
    np = ClipSegmentToLine(clipPoints2, clipPoints1,  sideNormal, posSide, posEdge);

    if (np < 2)
    {
        return 0;
    }

    // Now clipPoints2 contains the clipping points.
    // Due to roundoff, it is possible that clipping removes all points.

    let numContacts: number = 0;

    for (let i = 0; i < 2; i++)
    {
        let separation = Vec2.dot(frontNormal, clipPoints2[i].v) - front;

        if (separation <= 0)
        {
            contacts[numContacts] = new Contact();
            contacts[numContacts].separation = separation;
            contacts[numContacts].normal = normal;

            // slide contact point onto reference face (easy to cull)
            contacts[numContacts].position = Vec2.sub(clipPoints2[i].v, Vec2.mulSV(separation, frontNormal));
            contacts[numContacts].feature = clipPoints2[i].fp;

            if (axis === Axis.FACE_B_X || axis === Axis.FACE_B_Y)
            {
                contacts[numContacts].feature.flip();
            }

            numContacts++;
        }
    }

    return numContacts;
}
