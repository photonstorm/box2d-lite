import Arbiter from './Arbiter';
import Body from './Body';
import Vec2 from './math/Vec2';
import Joint from './Joint';
import Quad from './Quad';

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
    joints: Joint[] = [];
    arbiters: Arbiter[] = [];

    gravity: Vec2 = new Vec2();

    accumulateImpulses: boolean = true;
    warmStarting: boolean = true;
    
    iterations: number = 10;
    positionCorrection: number = 0.2;
    allowedPenetration: number = 0.01; // slop

    width: number;
    height: number;

    quadTree: Quad;

    constructor (width: number, height: number, gravity: Vec2 = new Vec2(0, 9.807), iterations: number = 10)
    {
        this.gravity.x = gravity.x;
        this.gravity.y = gravity.y;

        this.width = width;
        this.height = height;

        this.iterations = iterations;

        this.quadTree = new Quad(0, 0, this.width, this.height);
    }

    addBody (body: Body): World
    {
        this.bodyIdSeed++;

        body.id = this.bodyIdSeed;

        this.bodies.push(body);

        return this;
    }

    addJoint (joint: Joint): World
    {
        this.joints.push(joint);

        return this;
    }

    clear (): World
    {
        this.bodies = [];
        this.joints = [];
        this.arbiters = [];

        return this;
    }

    /**
     * Determine overlapping bodies and update contact points.
     * WARNING: Horribly slow O(N^2)
     */
    OLDbroadPhase ()
    {
        window['arbitersTotal'] = 0;
        window['arbitersMerged'] = 0;

        let bodies = this.bodies;
        let length = bodies.length;
        let arbiters = this.arbiters;

        for (let i: number = 0; i < length - 1; i++)
        {
            let bodyA: Body = bodies[i];

            for (let j: number = i + 1; j < length; j++)
            {
                let bodyB: Body = bodies[j];

                if (bodyA.invMass === 0 && bodyB.invMass === 0)
                {
                    continue;
                }

                let key: string = bodyA.id + ':' + bodyB.id;
                let arbiter = new Arbiter(this, bodyA, bodyB, key);

                // let arbiterKey = new ArbiterKey(arbiter.body1, arbiter.body2);

                window['arbitersTotal']++;

                let iter: number = -1;

                for (let a: number = 0; a < arbiters.length; a++)
                {
                    //  We have an arbiter for this body pair already, store the array index in `iter`
                    if (arbiters[a].id === key)
                    {
                        iter = a;
                        break;
                    }
                }

                //  if in contact (passed AABB check and clip check)
                if (arbiter.numContacts > 0)
                {
                    window['arbitersMerged']++;

                    if (iter === -1)
                    {
                        //  new arbiter, create a Pair and shove into the array
                        // arbiters.push(new ArbiterPair(arbiterKey, arbiter));
                        arbiters.push(arbiter);
                    }
                    else
                    {
                        //  Already in the array, so update the Arbiter instance, passing in the new contacts
                        // arbiters[iter].second.update(arbiter.contacts, arbiter.numContacts);
                        arbiters[iter].update(arbiter.contacts, arbiter.numContacts);
                    }
                }
                else if (arbiter.numContacts === 0 && iter > -1)
                {
                    //  Nuke empty Arbiter Pair, as the two bodies no longer have any contact
                    arbiters.splice(iter, 1);
                }
            }
        }
    }

    OLDstep (delta: number)
    {
        let inverseDelta = (delta > 0) ? 1 / delta : 0;

        this.OLDbroadPhase();

        //  Integrate forces

        const bodies = this.bodies;
        const gravity = this.gravity;

        for (let i: number = 0; i < bodies.length; i++)
        {
            bodies[i].preStep(delta, gravity);
        }

        //  Pre-steps

        const arbiters = this.arbiters;
        const joints = this.joints;

        for (let i: number = 0; i < arbiters.length; i++)
        {
            arbiters[i].preStep(inverseDelta);
        }

        for (let i: number = 0; i < joints.length; i++)
        {
            joints[i].preStep(inverseDelta);
        }
        
        //  Perform iterations

        for (let i: number = 0; i < this.iterations; i++)
        {
            //  Apply impulse
            for (let arb: number = 0; arb < arbiters.length; arb++)
            {
                arbiters[arb].applyImpulse();
            }
        
            //  Apply joint impulse
            for (let j: number = 0; j < joints.length; j++)
            {
                joints[j].applyImpulse();
            }
        }
        
        //  Integrate velocities

        for (let i: number = 0; i < bodies.length; i++)
        {
            bodies[i].postStep(delta);
        }
    }

    broadPhase ()
    {
        window['arbitersTotal'] = 0;
        window['arbitersMerged'] = 0;

        const quad = this.quadTree;

        quad.clear();

        const bodies = this.bodies;
        const length = bodies.length;
        const arbiters = this.arbiters;

        //  Seed the quadtree

        for (let i: number = 0; i < length; i++)
        {
            quad.add(bodies[i].bounds);
        }

        for (let i: number = 0; i < length; i++)
        {
            let bodyA: Body = bodies[i];

            let results = quad.getIntersections(bodyA.bounds);

            for (let j: number = 0; j < results.length; j++)
            {
                let bodyB: Body = results[j].body;

                if (bodyA.id === bodyB.id || (bodyA.invMass === 0 && bodyB.invMass === 0))
                {
                    continue;
                }

                let key: string = bodyA.id + ':' + bodyB.id;

                let foundPair: boolean = false;

                for (let a: number = 0; a < arbiters.length; a++)
                {
                    //  We have an arbiter for this body pair already
                    //  Make sure it wasn't created this frame too, if it wasn't, we can update it
                    if (arbiters[a].id === key)
                    {
                        foundPair = true;
                        break;
                    }
                }

                if (foundPair)
                {
                    continue;
                }
                else
                {
                    //  They intersect!
                    //  Need a new Arbiter as we don't have one for this pair
                    let arbiter = new Arbiter(this, bodyA, bodyB, key);

                    window['arbitersTotal']++;

                    if (arbiter.numContacts > 0)
                    {
                        //  Even though they intersect, we still check the contacts (as only the bounds intersect)
                        arbiters.push(arbiter);
                    }
                }
            }
        }
    }

    step (delta: number)
    {
        const arbiters = this.arbiters;
        const joints = this.joints;

        let inverseDelta = (delta > 0) ? 1 / delta : 0;

        //  refresh all of the current arbiters
        for (let i: number = 0; i < arbiters.length; i++)
        {
            arbiters[i].refresh();
        }

        this.broadPhase();

        //  Integrate forces

        const bodies = this.bodies;
        const gravity = this.gravity;

        for (let i: number = 0; i < bodies.length; i++)
        {
            bodies[i].preStep(delta, gravity);
        }

        //  Pre-steps

        const remainingArbiters: Arbiter[] = [];

        for (let i: number = 0; i < arbiters.length; i++)
        {
            if (arbiters[i].preStep(inverseDelta))
            {
                remainingArbiters.push(arbiters[i]);
            }
        }

        //  Swizzle them
        this.arbiters = remainingArbiters;

        for (let i: number = 0; i < joints.length; i++)
        {
            joints[i].preStep(inverseDelta);
        }
        
        //  Perform iterations

        for (let i: number = 0; i < this.iterations; i++)
        {
            //  Apply impulse
            for (let arb: number = 0; arb < remainingArbiters.length; arb++)
            {
                remainingArbiters[arb].applyImpulse();
            }
        
            //  Apply joint impulse
            for (let j: number = 0; j < joints.length; j++)
            {
                joints[j].applyImpulse();
            }
        }
        
        //  Integrate velocities

        for (let i: number = 0; i < bodies.length; i++)
        {
            bodies[i].postStep(delta);
        }
    }
}