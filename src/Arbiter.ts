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
        let mergedContacts: Contact[] = [];

        let contacts: Contact[] = this.contacts;
        let numContacts: number = this.numContacts;
        let warmStarting: boolean = this.world.warmStarting;

        for (let i: number = 0; i < numNewContacts; i++)
        {
            let cNew: Contact = newContacts[i];
            let k: number = -1;

            for (let j: number = 0; j < numContacts; j++)
            {
                let cOld: Contact = contacts[j];

                if (cNew.feature.value === cOld.feature.value)
                {
                    k = j;
                    break;
                }
            }

            if (k > -1)
            {
                let cOld: Contact = contacts[k];

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
        const allowedPenetration = this.world.allowedPenetration;

        let contacts: Contact[] = this.contacts;
        let numContacts: number = this.numContacts;
        let biasFactor: number = this.world.positionCorrection;
        let body1: Body = this.body1;
        let body2: Body = this.body2;
        let accumulateImpulses: boolean = this.world.accumulateImpulses;

        for (let i: number = 0; i < numContacts; i++)
        {
            let c: Contact = contacts[i];

            let r1X: number = c.positionX - body1.position.x;
            let r1Y: number = c.positionY - body1.position.y;

            let r2X: number = c.positionX - body2.position.x;
            let r2Y: number = c.positionY - body2.position.y;

            //  Precompute normal mass, tangent mass and bias

            let rn1: number = Vec2.dotXY(r1X, r1Y, c.normalX, c.normalY);
            let rn2: number = Vec2.dotXY(r2X, r2Y, c.normalX, c.normalY);

            let normal: number = body1.invMass + body2.invMass;

            normal += body1.invI * (Vec2.dotXY(r1X, r1Y, r1X, r1Y) - rn1 * rn1) + body2.invI * (Vec2.dotXY(r2X, r2Y, r2X, r2Y) - rn2 * rn2);

            c.massNormal = 1 / normal;

            let tangentX: number = c.normalY;
            let tangentY: number = -1 * c.normalX;

            let rt1: number = Vec2.dotXY(r1X, r1Y, tangentX, tangentY);
            let rt2: number = Vec2.dotXY(r2X, r2Y, tangentX, tangentY);

            let kTangent: number = body1.invMass + body2.invMass;

            kTangent += body1.invI * (Vec2.dotXY(r1X, r1Y, r1X, r1Y) - rt1 * rt1) + body2.invI * (Vec2.dotXY(r2X, r2Y, r2X, r2Y) - rt2 * rt2);

            c.massTangent = 1 / kTangent;

            c.bias = -biasFactor * inverseDelta * Math.min(0, c.separation + allowedPenetration);

            if (accumulateImpulses)
            {
                //  Normal + Friction impulse

                let pX: number = (c.Pn * c.normalX) + (c.Pt * tangentX);
                let pY: number = (c.Pn * c.normalY) + (c.Pt * tangentY);

                body1.velocity.x -= (body1.invMass * pX);
                body1.velocity.y -= (body1.invMass * pY);

                if (!body1.fixedRotation)
                {
                    body1.angularVelocity -= body1.invI * (r1X * pY - r1Y * pX);
                }

                body2.velocity.x += (body2.invMass * pX);
                body2.velocity.y += (body2.invMass * pY);

                if (!body2.fixedRotation)
                {
                    body2.angularVelocity += body2.invI * (r2X * pY - r2Y * pX);
                }
            }
        }
    }

    applyImpulse ()
    {
        let contacts: Contact[] = this.contacts;
        let numContacts: number = this.numContacts;
        let body1: Body = this.body1;
        let body2: Body = this.body2;
        let accumulateImpulses: boolean = this.world.accumulateImpulses;

        for (let i: number = 0; i < numContacts; i++)
        {
            let c: Contact = contacts[i];

            c.r1X = c.positionX - body1.position.x;
            c.r1Y = c.positionY - body1.position.y;

            c.r2X = c.positionX - body2.position.x;
            c.r2Y = c.positionY - body2.position.y;

            let subX: number = (body2.velocity.x + (-body2.angularVelocity * c.r2Y)) - body1.velocity.x;
            let subY: number = (body2.velocity.y + (body2.angularVelocity * c.r2X)) - body1.velocity.y;

            let dVx: number = subX - (-body1.angularVelocity * c.r1Y);
            let dVy: number = subY - (body1.angularVelocity * c.r1X);
            
            //  Compute normal impulse

            let vn: number = Vec2.dotXY(dVx, dVy, c.normalX, c.normalY);

            let dPn: number = c.massNormal * (-vn + c.bias);

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

            let PnX: number = dPn * c.normalX;
            let PnY: number = dPn * c.normalY;

            body1.velocity.x -= (body1.invMass * PnX);
            body1.velocity.y -= (body1.invMass * PnY);

            if (!body1.fixedRotation)
            {
                body1.angularVelocity -= body1.invI * Vec2.crossXY(c.r1X, c.r1Y, PnX, PnY);
            }

            body2.velocity.x += (body2.invMass * PnX);
            body2.velocity.y += (body2.invMass * PnY);

            if (!body2.fixedRotation)
            {
                body2.angularVelocity += body2.invI * Vec2.crossXY(c.r2X, c.r2Y, PnX, PnY);
            }

            //  Relative velocity at contact

            let tangentX: number = c.normalY;
            let tangentY: number = -1 * c.normalX;

            let vt = Vec2.dotXY(dVx, dVy, tangentX, tangentY);

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

            PnX = dPt * tangentX;
            PnY = dPt * tangentY;

            body1.velocity.x -= (body1.invMass * PnX);
            body1.velocity.y -= (body1.invMass * PnY);

            if (!body1.fixedRotation)
            {
                body1.angularVelocity -= body1.invI * Vec2.crossXY(c.r1X, c.r1Y, PnX, PnY);
            }

            body2.velocity.x += (body2.invMass * PnX);
            body2.velocity.y += (body2.invMass * PnY);

            if (!body2.fixedRotation)
            {
                body2.angularVelocity += body2.invI * Vec2.crossXY(c.r2X, c.r2X, PnX, PnY);
            }
        }
    }
}
