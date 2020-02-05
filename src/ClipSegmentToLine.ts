import ClipVertex from './ClipVertex';
import { EdgeNumbers } from './EdgeNumbers';
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

export default function ClipSegmentToLine (vOut: ClipVertex[], vIn: ClipVertex[], normal: Vec2, offset: number, clipEdge: EdgeNumbers): number
{
    //  Start with no output points
    let numOut = 0;
  
    // Calculate the distance of end points to the line
    let distance0 = Vec2.dot(normal, vIn[0].v) - offset;
    let distance1 = Vec2.dot(normal, vIn[1].v) - offset;
  
    // If the points are behind the plane
    if (distance0 <= 0)
    {
        vOut[numOut] = vIn[0];
        numOut++;
    }

    if (distance1 <= 0)
    {
        vOut[numOut] = vIn[1];
        numOut++;
    }
  
    //  If the points are on different sides of the plane
    if (distance0 * distance1 < 0)
    {
        // Find intersection point of edge and plane
        let interp = distance0 / (distance0 - distance1);

        vOut[numOut] = new ClipVertex();

        vOut[numOut].v = Vec2.add(vIn[0].v, Vec2.mulSV(interp , Vec2.sub(vIn[1].v, vIn[0].v)));
  
        if (distance0 > 0)
        {
            vOut[numOut].fp = vIn[0].fp;
            vOut[numOut].fp.e.inEdge1 = clipEdge;
            vOut[numOut].fp.e.inEdge2 = EdgeNumbers.NO_EDGE;
        }
        else
        {
            vOut[numOut].fp = vIn[1].fp;
            vOut[numOut].fp.e.outEdge1 = clipEdge;
            vOut[numOut].fp.e.outEdge2 = EdgeNumbers.NO_EDGE;
        }
  
        numOut++;
    }
  
    return numOut;
}
