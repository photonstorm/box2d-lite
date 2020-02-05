import Body from './Body';

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

export default class ArbiterKey
{
    bodyA: Body;
    bodyB: Body;
    value: string;

    constructor (bodyA: Body, bodyB: Body)
    {
        this.bodyA = bodyA;
        this.bodyB = bodyB;
        this.value = bodyA.id + ':' + bodyB.id;
    }
}
