import AABB from './math/AABB';
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

export default class Body
{
    position: Vec2 = new Vec2();
    rotation: number = 0;

    velocity: Vec2 = new Vec2();
    angularVelocity: number = 0;

    force: Vec2 = new Vec2();
    torque: number = 0;

    width: number;
    height: number;

    friction: number = 0.2;
    mass: number = Number.MAX_VALUE;
    invMass: number = 0;
    I: number = Number.MAX_VALUE;
    invI: number = 0;

    fixedRotation: boolean = false;

    id: number = 0;

    bounds: AABB;

    constructor (width: number, height: number, mass: number)
    {
        this.bounds = new AABB(this);

        this.set(width, height, mass);
    }

    set (width: number, height: number, mass: number): Body
    {
        this.width = width;
        this.height = height;
        this.mass = mass;

        if (mass < Number.MAX_VALUE)
        {
            this.invMass = 1 / mass;
            this.I = mass * (width * width + height * height) / 12;
            this.invI = 1 / this.I;
        }
        else
        {
            this.invMass = 0;
            this.I = Number.MAX_VALUE;
            this.invI = 0;
        }

        this.bounds.update();

        return this;
    }

    addForce (force: Vec2): Body
    {
        this.force.add(force);

        return this;
    }

    preStep (delta: number, gravity: Vec2)
    {
        if (this.invMass !== 0)
        {
            this.velocity.x += delta * (gravity.x + (this.invMass * this.force.x));
            this.velocity.y += delta * (gravity.y + (this.invMass * this.force.y));
    
            if (!this.fixedRotation)
            {
                this.angularVelocity += delta * this.invI * this.torque;
            }
        }
    }

    postStep (delta: number)
    {
        this.position.x += delta * this.velocity.x;
        this.position.y += delta * this.velocity.y;

        if (!this.fixedRotation)
        {
            this.rotation += delta * this.angularVelocity;
        }

        this.force.set(0, 0);
        this.torque = 0;

        this.bounds.update();
    }
}
