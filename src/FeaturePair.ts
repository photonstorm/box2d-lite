import Edges from './Edges';

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

export default class FeaturePair
{
    e: Edges;
    value: number;

    constructor ()
    {
        this.e = new Edges();
        this.value = 0;
    }

    flip ()
    {
        const edges = this.e;

        const tempIn = edges.inEdge1;
        const tempOut = edges.outEdge1;

        edges.inEdge1 = edges.inEdge2;
        edges.inEdge2 = tempIn;

        edges.outEdge1 = edges.outEdge2;
        edges.outEdge2 = tempOut;
    }
}
