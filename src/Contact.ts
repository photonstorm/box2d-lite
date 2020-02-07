import FeaturePair from './FeaturePair';

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
    separation: number;
    Pn: number;         // accumulated normal impulse
    Pt: number;	        // accumulated tangent impulse
    Pnb: number;        // accumulated normal impulse for position bias
    massNormal: number;
    massTangent: number;
    bias: number;
    feature: FeaturePair;
    positionX: number;
    positionY: number;
    normalX: number;
    normalY: number;
    r1X: number;
    r1Y: number;
    r2X: number;
    r2Y: number;

    constructor (separation: number, normalX: number, normalY: number, positionX: number, positionY: number, feature: FeaturePair)
    {
        this.positionX = positionX;
        this.positionY = positionY;
        this.normalX = normalX;
        this.normalY = normalY;
        this.r1X = 0;
        this.r1Y = 0;
        this.r2X = 0;
        this.r2Y = 0;
        this.separation = separation;
        this.Pn = 0;
        this.Pt = 0;
        this.Pnb = 0;
        this.massNormal = 0;
        this.massTangent = 0;
        this.bias = 0;
        this.feature = feature;
    }
}
