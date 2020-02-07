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

    width: Vec2 = new Vec2();

    friction: number = 0.2;
    mass: number = Number.MAX_VALUE;
    invMass: number = 0;
    I: number = Number.MAX_VALUE;
    invI: number = 0;

    fixedRotation: boolean = false;

    id: number = 0;

    constructor (width: Vec2, mass: number)
    {
        this.set(width, mass);
    }

    set (width: Vec2, mass: number): Body
    {
        this.width = width;
        this.mass = mass;

        if (mass < Number.MAX_VALUE)
        {
            this.invMass = 1 / mass;
            this.I = mass * (width.x * width.x + width.y * width.y) / 12;
            this.invI = 1 / this.I;
        }
        else
        {
            this.invMass = 0;
            this.I = Number.MAX_VALUE;
            this.invI = 0;
        }

        return this;
    }

    addForce (force: Vec2): Body
    {
        this.force.add(force);

        return this;
    }
}
