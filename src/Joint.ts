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

let Rot1: Mat22 = new Mat22();
let Rot2: Mat22 = new Mat22();
let Rot1T: Mat22 = new Mat22();
let Rot2T: Mat22 = new Mat22();

let K1: Mat22 = new Mat22();
let K2: Mat22 = new Mat22();
let K3: Mat22 = new Mat22();
let K4: Mat22 = new Mat22();
let K: Mat22 = new Mat22();

let v1: Vec2 = new Vec2();
let v2: Vec2 = new Vec2();
let v3: Vec2 = new Vec2();
let v4: Vec2 = new Vec2();
let impulse: Vec2 = new Vec2();

export default class Joint
{
    M: Mat22;

    localAnchor1: Vec2;
    localAnchor2: Vec2;

    r1: Vec2;
    r2: Vec2;

    bias: Vec2;

    // accumulated impulse
    P: Vec2;

    world: World;

    body1: Body;
    body2: Body;

    biasFactor: number;
    softness: number;
  
    constructor ()
    {
        this.M = new Mat22();

        this.localAnchor1 = new Vec2();
        this.localAnchor2 = new Vec2();

        this.r1 = new Vec2();
        this.r2 = new Vec2();

        this.bias = new Vec2();
        this.P = new Vec2();

        this.biasFactor = 0.2;
        this.softness = 0;
    }

    set (world: World, body1: Body, body2: Body, anchor: Vec2)
    {
        this.world = world;

        this.body1 = body1;
        this.body2 = body2;

        Rot1.set(body1.rotation);
        Rot2.set(body2.rotation);
    
        Rot1T.transpose(body1.rotation);
        Rot2T.transpose(body2.rotation);

        Vec2.subV(anchor, body1.position, v1);
        Vec2.subV(anchor, body2.position, v2);

        Mat22.mulMVV(Rot1T, v1, this.localAnchor1);
        Mat22.mulMVV(Rot2T, v2, this.localAnchor2);
    }

    preStep (inverseDelta: number)
    {
        const body1 = this.body1;
        const body2 = this.body2;

        //  Pre-compute anchors, mass matrix and bias

        // let Rot1 = new Mat22().set(body1.rotation);
        // let Rot2 = new Mat22().set(body2.rotation);

        Rot1.set(body1.rotation);
        Rot2.set(body2.rotation);

        let r1 = Mat22.mulMVV(Rot1, this.localAnchor1, this.r1);
        let r2 = Mat22.mulMVV(Rot2, this.localAnchor2, this.r2);

        //  Inverse mass matrix

        K1.setValues(body1.invMass + body2.invMass, 0, 0, body1.invMass + body2.invMass);

        // let K1 = new Mat22(
        //     body1.invMass + body2.invMass,
        //     0,
        //     0,
        //     body1.invMass + body2.invMass
        // );

        //  body1 rotational mass matrix i.e. moment of inertia

        K2.setValues(
            body1.invI * r1.y * r1.y,
            -body1.invI * r1.x * r1.y,
            -body1.invI * r1.x * r1.y,
            body1.invI * r1.x * r1.x
        );

        // let K2 = new Mat22(
        //     body1.invI * r1.y * r1.y,
        //     -body1.invI * r1.x * r1.y,
        //     -body1.invI * r1.x * r1.y,
        //     body1.invI * r1.x * r1.x
        // );

        //  body2 rotational mass matrix i.e. moment of inertia

        K3.setValues(
            body2.invI * r2.y * r2.y,
            -body2.invI * r2.x * r2.y,
            -body2.invI * r2.x * r2.y,
            body2.invI * r2.x * r2.x
        );

        // let K3 = new Mat22(
        //     body2.invI * r2.y * r2.y,
        //     -body2.invI * r2.x * r2.y,
        //     -body2.invI * r2.x * r2.y,
        //     body2.invI * r2.x * r2.x
        // );

        //  K4 holds the output
        Mat22.addV(K1, K2, K4);

        //  K holds the output
        Mat22.addV(K4, K3, K);

        // let K = Mat22.add(Mat22.add(K1, K2), K3);

        K.a += this.softness;
        K.d += this.softness;
      
        //  this.M holds the output
        Mat22.invertV(K, this.M);

        // this.M = Mat22.invert(K);
      
        // let p1 = Vec2.add(body1.position, r1);
        // v1.set(
        //     body1.position.x + r1.x,
        //     body1.position.y + r1.y
        // );

        Vec2.addV(body1.position, r1, v1);

        // let p2 = Vec2.add(body2.position, r2);
        // v2.set(
        //     body2.position.x + r2.x,
        //     body2.position.y + r2.y
        // );

        Vec2.addV(body2.position, r2, v2);

        // let dp = Vec2.sub(p2, p1);
        // v3.set(
        //     v2.x - v1.x,
        //     v2.y - v1.y
        // );

        Vec2.subV(v2, v1, v3);
      
        if (this.world.positionCorrection)
        {
            // this.bias = Vec2.mulSV(-this.biasFactor, Vec2.mulSV(inverseDelta, dp));
            // this.bias = Vec2.mulSV(-this.biasFactor, Vec2.mulSVV(inverseDelta, v3, v1));
            Vec2.mulSVV(-this.biasFactor, Vec2.mulSVV(inverseDelta, v3, v1), this.bias);
        }
        else
        {
            this.bias.set(0, 0);
        }
        
        if (this.world.warmStarting)
        {
            // Apply accumulated impulse.

            // body1.velocity.sub(Vec2.mulSV(body1.invMass, this.P));

            body1.velocity.sub(Vec2.mulSVV(body1.invMass, this.P, v1));

            body1.angularVelocity -= body1.invI * Vec2.crossVV(r1, this.P);

            // body2.velocity.add(Vec2.mulSV(body2.invMass, this.P));

            body2.velocity.add(Vec2.mulSVV(body2.invMass, this.P, v1));

            body2.angularVelocity += body2.invI * Vec2.crossVV(r2, this.P);
        }
        else
        {
            this.P.set(0, 0);
        }

        // this.r1 = r1;
        // this.r2 = r2;
    }

    applyImpulse ()
    {
        const body1 = this.body1;
        const body2 = this.body2;

        const r1 = this.r1;
        const r2 = this.r2;

        // let dv = Vec2.sub(
        //     Vec2.sub(Vec2.add(body2.velocity, Vec2.crossSV(body2.angularVelocity, r2)), body1.velocity),
        //     Vec2.crossSV(body1.angularVelocity, r1)
        // );

        //     Vec2.sub(                                        v3
        //       Vec2.add(body2.velocity,                       v2
        //         Vec2.crossSV(body2.angularVelocity, r2)),    v1
        //       body1.velocity),

        Vec2.crossSVV(body2.angularVelocity, r2, v1);
        Vec2.addV(body2.velocity, v1, v2);
        Vec2.subV(v2, body1.velocity, v3);

        Vec2.crossSVV(body1.angularVelocity, r1, v4);

        //  keep v1 (v2, v3, v4 can be re-used)
        let dv = Vec2.subV(v3, v4, v1);

        // let impulse = new Vec2();

        // Vec2.sub(this.bias, dv) = v2
        Vec2.subV(this.bias, dv, v2);

        // Vec2.mulSV(this.softness, this.P) = v3
        Vec2.mulSVV(this.softness, this.P, v3);

        Vec2.subV(v2, v3, v4);

        //                      v4              v2                       v3
        // Mat22.mulMVV(this.M, Vec2.sub(Vec2.sub(this.bias, dv), Vec2.mulSV(this.softness, this.P)), impulse);

        Mat22.mulMVV(this.M, v4, impulse);

        body1.velocity.sub(Vec2.mulSVV(body1.invMass, impulse, v1));

        body1.angularVelocity -= body1.invI * Vec2.crossVV(r1, impulse);

        body2.velocity.add(Vec2.mulSVV(body2.invMass, impulse, v1));

        body2.angularVelocity += body2.invI * Vec2.crossVV(r2, impulse);

        this.P.add(impulse);
    }
}
