import Body from './Body';
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

export default class World
{
    bodyIdSeed: number = 0;
    bodies: Body[] = [];
    joints = [];
    arbiters = [];
    gravity: Vec2 = new Vec2();
    iterations: number = 10;
    accumulateImpulses: boolean = true;
    warmStarting: boolean = true;
    positionCorrection: boolean = true;

    constructor (gravity: Vec2 = new Vec2(0, 9.807), iterations: number = 10)
    {
        this.gravity.x = gravity.x;
        this.gravity.y = gravity.y;

        this.iterations = iterations;
    }

    addBody (body: Body): World
    {
        this.bodyIdSeed++;

        body.id = this.bodyIdSeed;

        this.bodies.push(body);

        return this;
    }

    addJoint (): World
    {
        return this;
    }

    clear (): World
    {
        this.bodies = [];
        this.joints = [];
        this.arbiters = [];

        return this;
    }

    broadPhase ()
    {
        let bodies = this.bodies;
        let length = bodies.length;
        let arbiters = this.arbiters;

        for (let i: number = 0; i < length; i++)
        {
            let bodyA: Body = bodies[i];

            for (let j: number = i + 1; j < length; j++)
            {
                let bodyB: Body = bodies[j];

                if (bodyA.invMass === 0 && bodyB.invI === 0)
                {
                    continue;
                }

                // let arbiter
            }
        }
    }

}