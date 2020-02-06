import Body from './Body';
import Clamp from './math/Clamp';
import Collide from './Collide';
import Contact from './Contact';
import World from './World';
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

export default class Arbiter
{
    world: World;
    body1: Body;
    body2: Body;
    contacts: Contact[];
    numContacts: number;
    friction: number;

    constructor (world: World, body1: Body, body2: Body)
    {
        this.world = world;

        if (body1.id < body2.id)
        {
            this.body1 = body1;
            this.body2 = body2;
        }
        else
        {
            this.body1 = body2;
            this.body2 = body1;
        }

        this.contacts = [];

        this.numContacts = Collide(this.contacts, this.body1, this.body2);

        this.friction = Math.sqrt(this.body1.friction * this.body2.friction);
    }

    update (newContacts: Contact[], numNewContacts: number)
    {
        let mergedContacts = [];

        let contacts = this.contacts;
        let numContacts = this.numContacts;
        let warmStarting = this.world.warmStarting;

        for (let i: number = 0; i < numNewContacts; i++)
        {
            let cNew = newContacts[i];
            let k = -1;

            for (let j: number = 0; j < numContacts; j++)
            {
                let cOld = contacts[j];

                if (cNew.feature.value === cOld.feature.value)
                {
                    k = j;
                    break;
                }
            }

            if (k > -1)
            {
                let cOld = contacts[k];

                if (warmStarting)
                {
                    cNew.Pn = cOld.Pn;
                    cNew.Pt = cOld.Pt;
                    cNew.Pnb = cOld.Pnb;
                }
                else
                {
                    cNew.Pn = 0;
                    cNew.Pt = 0;
                    cNew.Pnb = 0;
                }

                mergedContacts[i] = cNew;
            }
            else
            {
                mergedContacts[i] = newContacts[i];
            }
        }

        this.contacts = mergedContacts;
        this.numContacts = numNewContacts;
    }

    preStep (inverseDelta: number)
    {
        //  slop
        const allowedPenetration = 0.01;

        let contacts = this.contacts;
        let numContacts = this.numContacts;
        let biasFactor = (this.world.positionCorrection) ? 0.2 : 0;
        let body1 = this.body1;
        let body2 = this.body2;
        let accumulateImpulses = this.world.accumulateImpulses;

        for (let i: number = 0; i < numContacts; i++)
        {
            let c = contacts[i];

            let r1: Vec2 = Vec2.sub(c.position, body1.position);
            let r2: Vec2 = Vec2.sub(c.position, body2.position);

            //  Precompute normal mass, tangent mass and bias
            let rn1 = Vec2.dot(r1, c.normal);
            let rn2 = Vec2.dot(r2, c.normal);
            let normal = body1.invMass + body2.invMass;

            normal += body1.invI * (Vec2.dot(r1, r1) - rn1 * rn1) + body2.invI * (Vec2.dot(r2, r2) - rn2 * rn2);

            c.massNormal = 1 / normal;

            let tangent = Vec2.crossVS(c.normal, 1);
            let rt1 = Vec2.dot(r1, tangent);
            let rt2 = Vec2.dot(r2, tangent);
            let kTangent = body1.invMass + body2.invMass;
            kTangent += body1.invI * (Vec2.dot(r1, r1) - rt1 * rt1) + body2.invI * (Vec2.dot(r2, r2) - rt2 * rt2);

            c.massTangent = 1 / kTangent;

            c.bias = -biasFactor * inverseDelta * Math.min(0, c.separation + allowedPenetration);

            if (accumulateImpulses)
            {
                //  Normal + Friction impulse
                let P = Vec2.add(Vec2.mulSV(c.Pn, c.normal), Vec2.mulSV(c.Pt, tangent));

                body1.velocity.sub(Vec2.mulSV(body1.invMass, P));
                body1.angularVelocity -= body1.invI * Vec2.crossVV(r1, P);

                body2.velocity.add(Vec2.mulSV(body2.invMass, P));
                body2.angularVelocity += body2.invI * Vec2.crossVV(r2, P);
            }
        }
    }

    applyImpulse ()
    {
        let contacts = this.contacts;
        let numContacts = this.numContacts;
        let body1 = this.body1;
        let body2 = this.body2;
        let accumulateImpulses = this.world.accumulateImpulses;

        for (let i: number = 0; i < numContacts; i++)
        {
            let c = contacts[i];

            let r1 = c.r1;
            let r2 = c.r2;

            r1.set(
                c.position.x - body1.position.x,
                c.position.y - body1.position.y
            );

            r2.set(
                c.position.x - body2.position.x,
                c.position.y - body2.position.y
            );

            //  Relative velocity at contact

            let cross1x = -body2.angularVelocity * r2.y;
            let cross1y = body2.angularVelocity * r2.x;

            let cross2x = -body1.angularVelocity * r1.y;
            let cross2y = body1.angularVelocity * r1.x;

            let addX = body2.velocity.x + cross1x;
            let addY = body2.velocity.y + cross1y;

            let subX = addX - body1.velocity.x;
            let subY = addY - body1.velocity.y;

            let dVx = subX - cross2x;
            let dVy = subY - cross2y;

            //  Compute normal impulse

            let vn = Vec2.dotXYV(dVx, dVy, c.normal);

            let dPn = c.massNormal * (-vn + c.bias);

            if (accumulateImpulses)
            {
                //  Clamp accumulated impulse
                let Pn0 = c.Pn;
                c.Pn = Math.max(Pn0 + dPn, 0);
                dPn = c.Pn - Pn0;
            }
            else
            {
                dPn = Math.max(dPn, 0);
            }

            //  Apply contact impulse

            let PnX = dPn * c.normal.x;
            let PnY = dPn * c.normal.y;

            body1.velocity.x -= (body1.invMass * PnX);
            body1.velocity.y -= (body1.invMass * PnY);
            body1.angularVelocity -= body1.invI * Vec2.crossVXY(c.r1, PnX, PnY);

            body2.velocity.x += (body2.invMass * PnX);
            body2.velocity.y += (body2.invMass * PnY);
            body2.angularVelocity += body2.invI * Vec2.crossVXY(c.r2, PnX, PnY);

            //  Relative velocity at contact

            let tangent = Vec2.crossVS(c.normal, 1);

            let vt = Vec2.dotXYV(dVx, dVy, tangent);

            let dPt = c.massTangent * (-vt);

            if (accumulateImpulses)
            {
                // Compute friction impulse
                let maxPt = this.friction * c.Pn;

                // Clamp friction
                let oldTangentImpulse = c.Pt;
                c.Pt = Clamp(oldTangentImpulse + dPt, -maxPt, maxPt);
                dPt = c.Pt - oldTangentImpulse;
            }
            else
            {
                let maxPt = this.friction * dPn;
                dPt = Clamp(dPt, -maxPt, maxPt);
            }

            // Apply contact impulse

            PnX = dPt * tangent.x;
            PnY = dPt * tangent.y;

            body1.velocity.x -= (body1.invMass * PnX);
            body1.velocity.y -= (body1.invMass * PnY);
            body1.angularVelocity -= body1.invI * Vec2.crossVXY(c.r1, PnX, PnY);

            body2.velocity.x += (body2.invMass * PnX);
            body2.velocity.y += (body2.invMass * PnY);
            body2.angularVelocity += body2.invI * Vec2.crossVXY(c.r2, PnX, PnY);
        }
    }
}
