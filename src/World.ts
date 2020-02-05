import Arbiter from './Arbiter';
import ArbiterKey from './ArbiterKey';
import ArbiterPair from './ArbiterPair';
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
    arbiters: ArbiterPair[] = [];
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

    /**
     * Determine overlapping bodies and update contact points
     */
    broadPhase ()
    {
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

                let arbiter = new Arbiter(this, bodyA, bodyB);
                let arbiterKey = new ArbiterKey(bodyA, bodyB);

                let iter = -1;

                for (let a: number = 0; a < arbiters.length; a++)
                {
                    if (arbiters[a].first.value === arbiterKey.value)
                    {
                        iter = a;
                        break;
                    }
                }

                if (arbiter.numContacts > 0)
                {
                    if (iter === -1)
                    {
                        arbiters.push(new ArbiterPair(arbiterKey, arbiter));
                    }
                    else
                    {
                        arbiters[iter].second.update(arbiter.contacts, arbiter.numContacts);
                    }
                }
                else if (arbiter.numContacts === 0 && iter > -1)
                {
                    //  Nuke empty arbiter with no contacts
                    arbiters.splice(iter, 1);
                }
            }
        }
    }

    step (delta: number)
    {
        let inverseDelta = (delta > 0) ? 1 / delta : 0;

        this.broadPhase();

        //  Integrate forces

        const bodies = this.bodies;
        const gravity = this.gravity;

        for (let i: number = 0; i < bodies.length; i++)
        {
            let body = bodies[i];

            if (body.invMass === 0)
            {
                continue;
            }

            body.velocity.add(Vec2.mulSV(delta, (Vec2.add(gravity, Vec2.mulSV(body.invMass, body.force)))));
            body.angularVelocity += delta * body.invI * body.torque;
        }

        //  Pre-steps

        const arbiters = this.arbiters;
        const joints = this.joints;

        for (let i: number = 0; i < arbiters.length; i++)
        {
            arbiters[i].second.preStep(inverseDelta);
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
                arbiters[arb].second.applyImpulse();
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
            let body = bodies[i];

            body.position.add(Vec2.mulSV(delta, body.velocity));
            body.rotation += delta * body.angularVelocity;

            body.force.set(0, 0);
            body.torque = 0;
        }
    }


}