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
    position: Vec2;
    normal: Vec2;
    r1: Vec2;
    r2: Vec2;
    separation: number;
    Pn: number;         // accumulated normal impulse
    Pt: number;	        // accumulated tangent impulse
    Pnb: number;        // accumulated normal impulse for position bias
    massNormal: number;
    massTangent: number;
    bias: number;
    feature: FeaturePair;

    constructor ()
    {
        this.position = new Vec2();
        this.normal = new Vec2();
        this.r1 = new Vec2();
        this.r2 = new Vec2();
        this.separation = 0;
        this.Pn = 0;
        this.Pt = 0;
        this.Pnb = 0;
        this.massNormal = 0;
        this.massTangent = 0;
        this.bias = 0;
        this.feature = new FeaturePair();
    }
}
