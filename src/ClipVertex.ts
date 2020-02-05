import Vec2 from './math/Vec2';
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

 export default class ClipVertex
{
    v: Vec2 = new Vec2();
    fp: FeaturePair = new FeaturePair();
}
