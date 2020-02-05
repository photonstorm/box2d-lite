import FeaturePair from './FeaturePair';
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

export default class Contact
{
    position: Vec2 = new Vec2();
    normal: Vec2 = new Vec2();
    r1: Vec2 = new Vec2();
    r2: Vec2 = new Vec2();
    separation: number = 0;
    Pn: number = 0;         // accumulated normal impulse
    Pt: number = 0;	        // accumulated tangent impulse
    Pnb: number = 0;        // accumulated normal impulse for position bias
    massNormal: number = 0;
    massTangent: number = 0;
    bias: number = 0;
    feature: FeaturePair = new FeaturePair();

    constructor ()
    {
    }
}
