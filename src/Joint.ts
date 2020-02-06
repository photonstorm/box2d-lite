import Body from './Body';
import World from './World';
import Vec2 from './math/Vec2';
import Mat22 from './math/Mat22';

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

export default class Joint
{
    M: Mat22 = new Mat22();

    localAnchor1: Vec2 = new Vec2();
    localAnchor2: Vec2 = new Vec2();

    r1: Vec2 = new Vec2();
    r2: Vec2 = new Vec2();

    bias: Vec2 = new Vec2();
    P: Vec2 = new Vec2(); // accumulated impulse

    world: World;

    body1: Body;
    body2: Body;

    biasFactor: number = 0.2;
    softness: number = 0;
  
    constructor ()
    {
    }

    set (world: World, body1: Body, body2: Body, anchor: Vec2)
    {
        this.world = world;

        this.body1 = body1;
        this.body2 = body2;

        let Rot1 = new Mat22().set(body1.rotation);
        let Rot2 = new Mat22().set(body2.rotation);
        let Rot1T = Mat22.transpose(Rot1);
        let Rot2T = Mat22.transpose(Rot2);

        this.localAnchor1 = Mat22.mulMV(Rot1T, Vec2.sub(anchor, body1.position));
        this.localAnchor2 = Mat22.mulMV(Rot2T, Vec2.sub(anchor, body2.position));
    }

    preStep (inverseDelta: number)
    {
        const body1 = this.body1;
        const body2 = this.body2;

        //  Pre-compute anchors, mass matrix and bias

        let Rot1 = new Mat22().set(body1.rotation);
        let Rot2 = new Mat22().set(body2.rotation);

        let r1 = Mat22.mulMV(Rot1, this.localAnchor1);
        let r2 = Mat22.mulMV(Rot2, this.localAnchor2);

        //  Inverse mass matrix

        let K1 = new Mat22(
            body1.invMass + body2.invMass,
            0,
            0,
            body1.invMass + body2.invMass
        );

        //  body1 rotational mass matrix i.e. moment of inertia
        let K2 = new Mat22(
            body1.invI * r1.y * r1.y,
            -body1.invI * r1.x * r1.y,
            -body1.invI * r1.x * r1.y,
            body1.invI * r1.x * r1.x
        );

        //  body2 rotational mass matrix i.e. moment of inertia
        let K3 = new Mat22(
            body2.invI * r2.y * r2.y,
            -body2.invI * r2.x * r2.y,
            -body2.invI * r2.x * r2.y,
            body2.invI * r2.x * r2.x
        );

        let K = Mat22.add(Mat22.add(K1, K2), K3);

        K.a += this.softness;
        K.d += this.softness;
      
        this.M = Mat22.invert(K);
      
        let p1 = Vec2.add(body1.position, r1);
        let p2 = Vec2.add(body2.position, r2);
        let dp = Vec2.sub(p2, p1);
      
        if (this.world.positionCorrection)
        {
            this.bias = Vec2.mulSV(-this.biasFactor, Vec2.mulSV(inverseDelta, dp));
        }
        else
        {
            this.bias.set(0, 0);
        }
        
        if (this.world.warmStarting)
        {
            // Apply accumulated impulse.
            body1.velocity.sub(Vec2.mulSV(body1.invMass, this.P));
            body1.angularVelocity -= body1.invI * Vec2.crossVV(r1, this.P);

            body2.velocity.add(Vec2.mulSV(body2.invMass, this.P));
            body2.angularVelocity += body2.invI * Vec2.crossVV(r2, this.P);
        }
        else
        {
            this.P.set(0, 0);
        }

        this.r1 = r1;
        this.r2 = r2;
    }

    applyImpulse ()
    {
        const body1 = this.body1;
        const body2 = this.body2;

        const r1 = this.r1;
        const r2 = this.r2;

        let dv = Vec2.sub(
            Vec2.sub(Vec2.add(body2.velocity, Vec2.crossSV(body2.angularVelocity, r2)), body1.velocity),
            Vec2.crossSV(body1.angularVelocity, r1)
        );

        let impulse = new Vec2();

        impulse = Mat22.mulMV(this.M, Vec2.sub(Vec2.sub(this.bias, dv), Vec2.mulSV(this.softness, this.P)));

        body1.velocity.sub(Vec2.mulSV(body1.invMass, impulse));
        body1.angularVelocity -= body1.invI * Vec2.crossVV(r1, impulse);

        body2.velocity.add(Vec2.mulSV(body2.invMass, impulse));
        body2.angularVelocity += body2.invI * Vec2.crossVV(r2, impulse);

        this.P.add(impulse);
    }
}
