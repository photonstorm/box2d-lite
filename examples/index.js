class AABB {
    constructor(body) {
        this.body = body;
        this.x = 0;
        this.y = 0;
        this.x1 = 0;
        this.x2 = 0;
        this.y1 = 0;
        this.y2 = 0;
        this.width = 0;
        this.height = 0;
    }
    update() {
        const body = this.body;
        this.x = body.position.x;
        this.y = body.position.y;
        //  The top-right and bottom-right corners (unrotated)
        const c1x = body.width * 0.5;
        const c2x = body.width * 0.5;
        const c1y = -body.height * 0.5;
        const c2y = body.height * 0.5;
        const sin = Math.sin(body.rotation);
        const cos = Math.cos(body.rotation);
        //  Transformed corners
        const x1x = c1x * cos - c1y * sin;
        const x1y = c1x * sin + c1y * cos;
        const x2x = c2x * cos - c2y * sin;
        const x2y = c2x * sin + c2y * cos;
        //  Extents
        const ex = Math.max(Math.abs(x1x), Math.abs(x2x));
        const ey = Math.max(Math.abs(x1y), Math.abs(x2y));
        this.x1 = this.x - ex;
        this.x2 = this.x + ex;
        this.y1 = this.y - ey;
        this.y2 = this.y + ey;
        this.width = this.x2 - this.x1;
        this.height = this.y2 - this.y1;
    }
    isPoint() {
        return (this.width === 0 && this.height === 0);
    }
    intersects(bounds) {
        return !(bounds.x1 > this.x2 ||
            bounds.x2 < this.x1 ||
            bounds.y1 > this.y2 ||
            bounds.y2 < this.y1);
    }
    destroy() {
        this.body = null;
    }
}

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
class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    set(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
    }
    mul(s) {
        this.x *= s;
        this.y *= s;
    }
    static add(vA, vB) {
        return new Vec2(vA.x + vB.x, vA.y + vB.y);
    }
    static addV(vA, vB, out) {
        return out.set(vA.x + vB.x, vA.y + vB.y);
    }
    static sub(vA, vB) {
        return new Vec2(vA.x - vB.x, vA.y - vB.y);
    }
    static subV(vA, vB, out) {
        return out.set(vA.x - vB.x, vA.y - vB.y);
    }
    static mulVV(vA, vB) {
        return new Vec2(vA.x * vB.x, vA.y * vB.y);
    }
    static mulSV(s, v) {
        return new Vec2(s * v.x, s * v.y);
    }
    static mulSVV(s, v, out) {
        return out.set(s * v.x, s * v.y);
    }
    static abs(v) {
        return new Vec2(Math.abs(v.x), Math.abs(v.y));
    }
    static neg(v) {
        return new Vec2(-v.x, -v.y);
    }
    static dot(vA, vB) {
        return vA.x * vB.x + vA.y * vB.y;
    }
    static dotXYV(x, y, vB) {
        return x * vB.x + y * vB.y;
    }
    static dotXY(xA, yA, xB, yB) {
        return xA * xB + yA * yB;
    }
    static crossVV(vA, vB) {
        return vA.x * vB.y - vA.y * vB.x;
    }
    static crossVXY(vA, x, y) {
        return vA.x * y - vA.y * x;
    }
    static crossXY(x1, y1, x2, y2) {
        return x1 * y2 - y1 * x2;
    }
    static crossVS(v, s) {
        return new Vec2(s * v.y, -s * v.x);
    }
    static crossSV(s, v) {
        return new Vec2(-s * v.y, s * v.x);
    }
    static crossSVV(s, v, out) {
        return out.set(-s * v.y, s * v.x);
    }
}

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
class Body {
    constructor(x, y, width, height, mass) {
        this.position = new Vec2();
        this.rotation = 0;
        this.velocity = new Vec2();
        this.angularVelocity = 0;
        this.force = new Vec2();
        this.torque = 0;
        this.friction = 0.2;
        this.mass = Number.MAX_VALUE;
        this.invMass = 0;
        this.I = Number.MAX_VALUE;
        this.invI = 0;
        this.fixedRotation = false;
        this.id = 0;
        this.bounds = new AABB(this);
        this.position.set(x, y);
        this.setSize(width, height, mass);
    }
    setSize(width, height, mass) {
        this.width = width;
        this.height = height;
        this.mass = mass;
        if (mass < Number.MAX_VALUE) {
            this.invMass = 1 / mass;
            this.I = mass * (width * width + height * height) / 12;
            this.invI = 1 / this.I;
        }
        else {
            this.invMass = 0;
            this.I = Number.MAX_VALUE;
            this.invI = 0;
        }
        this.bounds.update();
        return this;
    }
    addForce(force) {
        this.force.add(force);
        return this;
    }
    preStep(delta, gravity) {
        if (this.invMass !== 0) {
            this.velocity.x += delta * (gravity.x + (this.invMass * this.force.x));
            this.velocity.y += delta * (gravity.y + (this.invMass * this.force.y));
            if (!this.fixedRotation) {
                this.angularVelocity += delta * this.invI * this.torque;
            }
        }
    }
    postStep(delta) {
        this.position.x += delta * this.velocity.x;
        this.position.y += delta * this.velocity.y;
        if (!this.fixedRotation) {
            this.rotation += delta * this.angularVelocity;
        }
        this.force.set(0, 0);
        this.torque = 0;
        this.bounds.update();
    }
}

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
class Mat22 {
    constructor(a = 0, c = 0, b = 0, d = 0) {
        //  col1
        this.a = a;
        this.c = c;
        //  col2
        this.b = b;
        this.d = d;
    }
    set(v) {
        const c = Math.cos(v);
        const s = Math.sin(v);
        this.a = c;
        this.c = s;
        this.b = -s;
        this.d = c;
        return this;
    }
    setValues(a, c, b, d) {
        this.a = a;
        this.c = c;
        this.b = b;
        this.d = d;
        return this;
    }
    setFromVec2(vA, vB) {
        this.a = vA.x;
        this.c = vA.y;
        this.b = vB.x;
        this.d = vB.y;
        return this;
    }
    mulMM(mA, mB) {
        this.a = mA.a * mB.a + mA.c * mB.c;
        this.c = mA.b * mB.a + mA.d * mB.c;
        this.b = mA.a * mB.b + mA.c * mB.d;
        this.d = mA.b * mB.b + mA.d * mB.d;
        return this;
    }
    transpose(v) {
        const c = Math.cos(v);
        const s = Math.sin(v);
        this.a = c;
        this.c = -s;
        this.b = s;
        this.d = c;
        return this;
    }
    static add(mA, mB) {
        return new Mat22(mA.a + mB.a, mA.c + mB.c, mA.b + mB.b, mA.d + mB.d);
    }
    static addV(mA, mB, out) {
        return out.setValues(mA.a + mB.a, mA.c + mB.c, mA.b + mB.b, mA.d + mB.d);
    }
    static mulMV(m, v) {
        return new Vec2(m.a * v.x + m.b * v.y, m.c * v.x + m.d * v.y);
    }
    static mulMVV(m, v, out) {
        out.set(m.a * v.x + m.b * v.y, m.c * v.x + m.d * v.y);
        return out;
    }
    static mulMM(mA, mB) {
        const a = mA.a * mB.a + mA.c * mB.c;
        const c = mA.b * mB.a + mA.d * mB.c;
        const b = mA.a * mB.b + mA.c * mB.d;
        const d = mA.b * mB.b + mA.d * mB.d;
        return new Mat22(a, c, b, d);
    }
    static abs(m) {
        return new Mat22(Math.abs(m.a), Math.abs(m.c), Math.abs(m.b), Math.abs(m.d));
    }
    static absM(m, out) {
        out.a = Math.abs(m.a);
        out.c = Math.abs(m.c);
        out.b = Math.abs(m.b);
        out.d = Math.abs(m.d);
        return out;
    }
    static transpose(m) {
        return new Mat22(m.a, m.b, m.c, m.d);
    }
    static transposeM(m, out) {
        out.a = m.a;
        out.c = m.b;
        out.b = m.c;
        out.d = m.d;
        return out;
    }
    static invert(m) {
        const a = m.a;
        const c = m.c;
        const b = m.b;
        const d = m.d;
        let det = 1 / (a * d - b * c);
        return new Mat22(det * d, det * -b, det * -c, det * a);
    }
    static invertV(m, out) {
        const a = m.a;
        const c = m.c;
        const b = m.b;
        const d = m.d;
        let det = 1 / (a * d - b * c);
        return out.setValues(det * d, det * -b, det * -c, det * a);
    }
}

class CanvasRenderer {
    constructor(canvas) {
        this.showBodies = true;
        this.showBounds = true;
        this.showContacts = true;
        this.showJoints = true;
        this.zoom = 1;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this._M0 = new Mat22();
        this._M1 = new Mat22();
        this._v1 = new Vec2();
        this._v2 = new Vec2();
        this._v3 = new Vec2();
        this._v4 = new Vec2();
        this._orientation = new Vec2();
    }
    init(zoom) {
        const context = this.context;
        context.setTransform();
        context.translate(this.canvas.width / 2, this.canvas.height / 2);
        context.scale(zoom, zoom);
        this.zoom = zoom;
    }
    render(world, zoom = 1, panX = 0, panY = 0) {
        const context = this.context;
        const bodies = world.bodies;
        const joints = world.joints;
        const arbiters = world.arbiters;
        //  Set the scale and pan
        const w = this.canvas.width;
        const h = this.canvas.height;
        context.setTransform();
        context.clearRect(0, 0, w, h);
        //  center it
        context.translate(w / 2, h / 2);
        //  pan it
        context.translate(panX * zoom, panY * zoom);
        context.scale(zoom, zoom);
        this.zoom = zoom;
        if (this.showBodies) {
            for (let i = 0; i < bodies.length; i++) {
                this.renderBody(bodies[i], context);
            }
        }
        if (this.showBounds) {
            for (let i = 0; i < bodies.length; i++) {
                this.renderBodyBounds(bodies[i], context);
            }
        }
        if (this.showContacts) {
            for (let i = 0; i < arbiters.length; i++) {
                // let arbiter = arbiters[i].second;
                let arbiter = arbiters[i];
                for (let c = 0; c < arbiter.contacts.length; c++) {
                    this.renderContact(arbiter.contacts[c], context);
                }
            }
        }
        if (this.showJoints) {
            for (let i = 0; i < joints.length; i++) {
                this.renderJoint(joints[i], context);
            }
        }
    }
    renderBodyBounds(body, ctx) {
        ctx.strokeStyle = 'grey';
        ctx.lineWidth = 0.5 / this.zoom;
        ctx.strokeRect(body.bounds.x1, body.bounds.y1, body.bounds.width, body.bounds.height);
    }
    renderBody(body, ctx) {
        this._M0.set(body.rotation);
        let position = body.position;
        let hX = 0.5 * body.width;
        let hY = 0.5 * body.height;
        const v1 = this._v1;
        const v2 = this._v2;
        const v3 = this._v3;
        const v4 = this._v4;
        v1.set(position.x + (this._M0.a * -hX + this._M0.b * -hY), position.y + (this._M0.c * -hX + this._M0.d * -hY));
        v2.set(position.x + (this._M0.a * hX + this._M0.b * -hY), position.y + (this._M0.c * hX + this._M0.d * -hY));
        v3.set(position.x + (this._M0.a * hX + this._M0.b * hY), position.y + (this._M0.c * hX + this._M0.d * hY));
        v4.set(position.x + (this._M0.a * -hX + this._M0.b * hY), position.y + (this._M0.c * -hX + this._M0.d * hY));
        const orientation = this._orientation;
        orientation.set(position.x + (this._M0.a * hX), position.y + (this._M0.c * hX));
        // draw centroid of rectangle
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 0.5 / this.zoom;
        ctx.beginPath();
        ctx.arc(body.position.x, body.position.y, 2 / this.zoom, 0, 2 * Math.PI);
        // draw shape
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.lineTo(v3.x, v3.y);
        ctx.lineTo(v4.x, v4.y);
        ctx.lineTo(v1.x, v1.y);
        // draw orientation line
        ctx.moveTo(position.x, position.y);
        ctx.lineTo(orientation.x, orientation.y);
        //  stroke it all
        ctx.stroke();
    }
    renderContact(contact, ctx) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 0.5 / this.zoom;
        ctx.beginPath();
        ctx.arc(contact.positionX, contact.positionY, 2 / this.zoom, 0, 2 * Math.PI);
        ctx.stroke();
    }
    renderJoint(joint, ctx) {
        let b1 = joint.body1;
        let b2 = joint.body2;
        this._M0.set(b1.rotation);
        this._M1.set(b2.rotation);
        let position1 = b1.position;
        let position2 = b2.position;
        const p1 = this._v1;
        const p2 = this._v2;
        p1.set(position1.x + (this._M0.a * joint.localAnchor1.x + this._M0.b * joint.localAnchor1.y), position1.y + (this._M0.c * joint.localAnchor1.x + this._M0.d * joint.localAnchor1.y));
        p2.set(position2.x + (this._M1.a * joint.localAnchor2.x + this._M1.b * joint.localAnchor2.y), position2.y + (this._M1.c * joint.localAnchor2.x + this._M1.d * joint.localAnchor2.y));
        ctx.strokeStyle = 'rgb(128, 128, 204)';
        ctx.lineWidth = 0.5 / this.zoom;
        ctx.setLineDash([2 / this.zoom, 2 / this.zoom]);
        ctx.beginPath();
        ctx.moveTo(position1.x, position1.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.moveTo(position2.x, position2.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

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
let Rot1 = new Mat22();
let Rot2 = new Mat22();
let Rot1T = new Mat22();
let Rot2T = new Mat22();
let K1 = new Mat22();
let K2 = new Mat22();
let K3 = new Mat22();
let K4 = new Mat22();
let K = new Mat22();
let v1 = new Vec2();
let v2 = new Vec2();
let v3 = new Vec2();
let v4 = new Vec2();
let impulse = new Vec2();
class Joint {
    constructor() {
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
    set(world, body1, body2, anchor) {
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
    preStep(inverseDelta) {
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
        K2.setValues(body1.invI * r1.y * r1.y, -body1.invI * r1.x * r1.y, -body1.invI * r1.x * r1.y, body1.invI * r1.x * r1.x);
        // let K2 = new Mat22(
        //     body1.invI * r1.y * r1.y,
        //     -body1.invI * r1.x * r1.y,
        //     -body1.invI * r1.x * r1.y,
        //     body1.invI * r1.x * r1.x
        // );
        //  body2 rotational mass matrix i.e. moment of inertia
        K3.setValues(body2.invI * r2.y * r2.y, -body2.invI * r2.x * r2.y, -body2.invI * r2.x * r2.y, body2.invI * r2.x * r2.x);
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
        if (this.world.positionCorrection) {
            // this.bias = Vec2.mulSV(-this.biasFactor, Vec2.mulSV(inverseDelta, dp));
            // this.bias = Vec2.mulSV(-this.biasFactor, Vec2.mulSVV(inverseDelta, v3, v1));
            Vec2.mulSVV(-this.biasFactor, Vec2.mulSVV(inverseDelta, v3, v1), this.bias);
        }
        else {
            this.bias.set(0, 0);
        }
        if (this.world.warmStarting) {
            // Apply accumulated impulse.
            // body1.velocity.sub(Vec2.mulSV(body1.invMass, this.P));
            body1.velocity.sub(Vec2.mulSVV(body1.invMass, this.P, v1));
            body1.angularVelocity -= body1.invI * Vec2.crossVV(r1, this.P);
            // body2.velocity.add(Vec2.mulSV(body2.invMass, this.P));
            body2.velocity.add(Vec2.mulSVV(body2.invMass, this.P, v1));
            body2.angularVelocity += body2.invI * Vec2.crossVV(r2, this.P);
        }
        else {
            this.P.set(0, 0);
        }
        // this.r1 = r1;
        // this.r2 = r2;
    }
    applyImpulse() {
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

function Clamp(a, low, high) {
    return Math.max(low, Math.min(a, high));
}

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
var Axis;
(function (Axis) {
    Axis[Axis["FACE_A_X"] = 0] = "FACE_A_X";
    Axis[Axis["FACE_A_Y"] = 1] = "FACE_A_Y";
    Axis[Axis["FACE_B_X"] = 2] = "FACE_B_X";
    Axis[Axis["FACE_B_Y"] = 3] = "FACE_B_Y";
})(Axis || (Axis = {}));

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
var EdgeNumbers;
(function (EdgeNumbers) {
    EdgeNumbers[EdgeNumbers["NO_EDGE"] = 0] = "NO_EDGE";
    EdgeNumbers[EdgeNumbers["EDGE1"] = 1] = "EDGE1";
    EdgeNumbers[EdgeNumbers["EDGE2"] = 2] = "EDGE2";
    EdgeNumbers[EdgeNumbers["EDGE3"] = 3] = "EDGE3";
    EdgeNumbers[EdgeNumbers["EDGE4"] = 4] = "EDGE4";
})(EdgeNumbers || (EdgeNumbers = {}));

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
class Edges {
    constructor() {
        this.inEdge1 = EdgeNumbers.NO_EDGE;
        this.outEdge1 = EdgeNumbers.NO_EDGE;
        this.inEdge2 = EdgeNumbers.NO_EDGE;
        this.outEdge2 = EdgeNumbers.NO_EDGE;
    }
}

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
class FeaturePair {
    constructor() {
        this.e = new Edges();
        this.value = 0;
    }
    flip() {
        const edges = this.e;
        const tempIn = edges.inEdge1;
        const tempOut = edges.outEdge1;
        edges.inEdge1 = edges.inEdge2;
        edges.inEdge2 = tempIn;
        edges.outEdge1 = edges.outEdge2;
        edges.outEdge2 = tempOut;
    }
}

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
class ClipVertex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.fp = new FeaturePair();
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
}

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
function ComputeIncidentEdge(c, h, pos, Rot, normalX, normalY) {
    //  The normal is from the reference box
    //  Convert it to the incident box frame and flip sign
    let invA = Rot.a;
    let invB = Rot.c;
    let invC = Rot.b;
    let invD = Rot.d;
    const nX = -(invA * normalX + invB * normalY);
    const nY = -(invC * normalX + invD * normalY);
    const absX = Math.abs(nX);
    const absY = Math.abs(nY);
    const clipVertex0 = new ClipVertex(0, 0);
    const clipVertex1 = new ClipVertex(0, 0);
    if (absX > absY) {
        if (Math.sign(nX) > 0) {
            clipVertex0.set(h.x, -h.y);
            clipVertex0.fp.e.inEdge2 = EdgeNumbers.EDGE3;
            clipVertex0.fp.e.outEdge2 = EdgeNumbers.EDGE4;
            clipVertex1.set(h.x, h.y);
            clipVertex1.fp.e.inEdge2 = EdgeNumbers.EDGE4;
            clipVertex1.fp.e.outEdge2 = EdgeNumbers.EDGE1;
        }
        else {
            clipVertex0.set(-h.x, h.y);
            clipVertex0.fp.e.inEdge2 = EdgeNumbers.EDGE1;
            clipVertex0.fp.e.outEdge2 = EdgeNumbers.EDGE2;
            clipVertex1.set(-h.x, -h.y);
            clipVertex1.fp.e.inEdge2 = EdgeNumbers.EDGE2;
            clipVertex1.fp.e.outEdge2 = EdgeNumbers.EDGE3;
        }
    }
    else {
        if (Math.sign(nY) > 0) {
            clipVertex0.set(h.x, h.y);
            clipVertex0.fp.e.inEdge2 = EdgeNumbers.EDGE4;
            clipVertex0.fp.e.outEdge2 = EdgeNumbers.EDGE1;
            clipVertex1.set(-h.x, h.y);
            clipVertex1.fp.e.inEdge2 = EdgeNumbers.EDGE1;
            clipVertex1.fp.e.outEdge2 = EdgeNumbers.EDGE2;
        }
        else {
            clipVertex0.set(-h.x, -h.y);
            clipVertex0.fp.e.inEdge2 = EdgeNumbers.EDGE2;
            clipVertex0.fp.e.outEdge2 = EdgeNumbers.EDGE3;
            clipVertex1.set(h.x, -h.y);
            clipVertex1.fp.e.inEdge2 = EdgeNumbers.EDGE3;
            clipVertex1.fp.e.outEdge2 = EdgeNumbers.EDGE4;
        }
    }
    let mx = pos.x + (Rot.a * clipVertex0.x + Rot.b * clipVertex0.y);
    let my = pos.y + (Rot.c * clipVertex0.x + Rot.d * clipVertex0.y);
    clipVertex0.set(mx, my);
    mx = pos.x + (Rot.a * clipVertex1.x + Rot.b * clipVertex1.y);
    my = pos.y + (Rot.c * clipVertex1.x + Rot.d * clipVertex1.y);
    clipVertex1.set(mx, my);
    c[0] = clipVertex0;
    c[1] = clipVertex1;
}

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
class Contact {
    constructor(separation, normalX, normalY, positionX, positionY, feature) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.normalX = normalX;
        this.normalY = normalY;
        this.r1X = 0;
        this.r1Y = 0;
        this.r2X = 0;
        this.r2Y = 0;
        this.separation = separation;
        this.Pn = 0;
        this.Pt = 0;
        this.Pnb = 0;
        this.massNormal = 0;
        this.massTangent = 0;
        this.bias = 0;
        this.feature = feature;
    }
}

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
function ClipSegmentToLine(vOut, vIn, normalX, normalY, offset, clipEdge) {
    //  Start with no output points
    let numOut = 0;
    // Calculate the distance of end points to the line
    let distance0 = Vec2.dotXY(normalX, normalY, vIn[0].x, vIn[0].y) - offset;
    let distance1 = Vec2.dotXY(normalX, normalY, vIn[1].x, vIn[1].y) - offset;
    // If the points are behind the plane
    if (distance0 <= 0) {
        vOut[numOut] = vIn[0];
        numOut++;
    }
    if (distance1 <= 0) {
        vOut[numOut] = vIn[1];
        numOut++;
    }
    //  If the points are on different sides of the plane
    if (distance0 * distance1 < 0) {
        // Find intersection point of edge and plane
        let interp = distance0 / (distance0 - distance1);
        let clip = new ClipVertex(vIn[0].x + (interp * (vIn[1].x - vIn[0].x)), vIn[0].y + (interp * (vIn[1].y - vIn[0].y)));
        if (distance0 > 0) {
            clip.fp = vIn[0].fp;
            clip.fp.e.inEdge1 = clipEdge;
            clip.fp.e.inEdge2 = EdgeNumbers.NO_EDGE;
        }
        else {
            clip.fp = vIn[1].fp;
            clip.fp.e.outEdge1 = clipEdge;
            clip.fp.e.outEdge2 = EdgeNumbers.NO_EDGE;
        }
        vOut[numOut] = clip;
        numOut++;
    }
    return numOut;
}

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
// Box vertex and edge numbering:
//
//        ^ y
//        |
//        e1
//   v2 ------ v1
//    |        |
// e2 |        | e4  --> x
//    |        |
//   v3 ------ v4
//        e3
function computeFaceAX(posA, posB, RotA, RotB, hA, hB, frontNormalX, frontNormalY, clipPoints2) {
    let front = Vec2.dotXYV(frontNormalX, frontNormalY, posA) + hA.x;
    let sideNormalX = RotA.b;
    let sideNormalY = RotA.d;
    let side = Vec2.dotXYV(sideNormalX, sideNormalY, posA);
    let negSide = -side + hA.y;
    let posSide = side + hA.y;
    //  The results get stored in this incidentEdge array
    let incidentEdge = [];
    ComputeIncidentEdge(incidentEdge, hB, posB, RotB, frontNormalX, frontNormalY);
    //  Clip other face with 5 box planes (1 face plane, 4 edge planes)
    let clipPoints1 = [];
    //  Clip to box side 1
    let np = ClipSegmentToLine(clipPoints1, incidentEdge, -sideNormalX, -sideNormalY, negSide, EdgeNumbers.EDGE3);
    if (np < 2) {
        return null;
    }
    //  Clip to negative box side 1
    np = ClipSegmentToLine(clipPoints2, clipPoints1, sideNormalX, sideNormalY, posSide, EdgeNumbers.EDGE1);
    if (np < 2) {
        return null;
    }
    //  The contact separation section needs:
    return front;
}
function computeFaceAY(posA, posB, RotA, RotB, hA, hB, frontNormalX, frontNormalY, clipPoints2) {
    let front = Vec2.dotXYV(frontNormalX, frontNormalY, posA) + hA.y;
    let sideNormalX = RotA.a;
    let sideNormalY = RotA.c;
    let side = Vec2.dotXYV(sideNormalX, sideNormalY, posA);
    let negSide = -side + hA.x;
    let posSide = side + hA.x;
    //  The results get stored in this incidentEdge array
    let incidentEdge = [];
    ComputeIncidentEdge(incidentEdge, hB, posB, RotB, frontNormalX, frontNormalY);
    //  Clip other face with 5 box planes (1 face plane, 4 edge planes)
    let clipPoints1 = [];
    //  Clip to box side 1
    let np = ClipSegmentToLine(clipPoints1, incidentEdge, -sideNormalX, -sideNormalY, negSide, EdgeNumbers.EDGE2);
    if (np < 2) {
        return null;
    }
    //  Clip to negative box side 1
    np = ClipSegmentToLine(clipPoints2, clipPoints1, sideNormalX, sideNormalY, posSide, EdgeNumbers.EDGE4);
    if (np < 2) {
        return null;
    }
    //  The contact separation section needs:
    return front;
}
function computeFaceBX(posA, posB, RotA, RotB, hA, hB, frontNormalX, frontNormalY, clipPoints2) {
    let front = Vec2.dotXYV(frontNormalX, frontNormalY, posB) + hB.x;
    let sideNormalX = RotB.b;
    let sideNormalY = RotB.d;
    let side = Vec2.dotXYV(sideNormalX, sideNormalY, posB);
    let negSide = -side + hB.y;
    let posSide = side + hB.y;
    //  The results get stored in this incidentEdge array
    let incidentEdge = [];
    ComputeIncidentEdge(incidentEdge, hA, posA, RotA, frontNormalX, frontNormalY);
    //  Clip other face with 5 box planes (1 face plane, 4 edge planes)
    let clipPoints1 = [];
    //  Clip to box side 1
    let np = ClipSegmentToLine(clipPoints1, incidentEdge, -sideNormalX, -sideNormalY, negSide, EdgeNumbers.EDGE3);
    if (np < 2) {
        return null;
    }
    //  Clip to negative box side 1
    np = ClipSegmentToLine(clipPoints2, clipPoints1, sideNormalX, sideNormalY, posSide, EdgeNumbers.EDGE1);
    if (np < 2) {
        return null;
    }
    //  The contact separation section needs:
    return front;
}
function computeFaceBY(posA, posB, RotA, RotB, hA, hB, frontNormalX, frontNormalY, clipPoints2) {
    let front = Vec2.dotXYV(frontNormalX, frontNormalY, posB) + hB.y;
    let sideNormalX = RotB.a;
    let sideNormalY = RotB.c;
    let side = Vec2.dotXYV(sideNormalX, sideNormalY, posB);
    let negSide = -side + hB.x;
    let posSide = side + hB.x;
    //  The results get stored in this incidentEdge array
    let incidentEdge = [];
    ComputeIncidentEdge(incidentEdge, hA, posA, RotA, frontNormalX, frontNormalY);
    //  Clip other face with 5 box planes (1 face plane, 4 edge planes)
    let clipPoints1 = [];
    //  Clip to box side 1
    let np = ClipSegmentToLine(clipPoints1, incidentEdge, -sideNormalX, -sideNormalY, negSide, EdgeNumbers.EDGE2);
    if (np < 2) {
        return null;
    }
    //  Clip to negative box side 1
    np = ClipSegmentToLine(clipPoints2, clipPoints1, sideNormalX, sideNormalY, posSide, EdgeNumbers.EDGE4);
    if (np < 2) {
        return null;
    }
    //  The contact separation section needs:
    return front;
}
//  Our cached collision vecs and mat22s
let hA = new Vec2();
let hB = new Vec2();
let RotA = new Mat22();
let RotB = new Mat22();
let RotAT = new Mat22();
let RotBT = new Mat22();
let dp = new Vec2();
let dA = new Vec2();
let dB = new Vec2();
let C = new Mat22();
let absC = new Mat22();
let absCT = new Mat22();
let faceA = new Vec2();
let faceA1 = new Vec2();
let faceA2 = new Vec2();
let faceB = new Vec2();
let faceB1 = new Vec2();
let faceB2 = new Vec2();
function Collide(contacts, bodyA, bodyB) {
    // Setup
    //  half the width of bodyA
    hA.set(0.5 * bodyA.width, 0.5 * bodyA.height);
    //  half the width of bodyB
    hB.set(0.5 * bodyB.width, 0.5 * bodyB.height);
    let posA = bodyA.position;
    let posB = bodyB.position;
    RotA.set(bodyA.rotation);
    RotB.set(bodyB.rotation);
    RotAT.transpose(bodyA.rotation);
    RotBT.transpose(bodyB.rotation);
    dp.set(posB.x - posA.x, posB.y - posA.y);
    dA.set(RotAT.a * dp.x + RotAT.b * dp.y, RotAT.c * dp.x + RotAT.d * dp.y);
    dB.set(RotBT.a * dp.x + RotBT.b * dp.y, RotBT.c * dp.x + RotBT.d * dp.y);
    C.mulMM(RotAT, RotB);
    Mat22.absM(C, absC);
    Mat22.transposeM(absC, absCT);
    // Box A faces
    faceA1.set(Math.abs(dA.x) - hA.x, Math.abs(dA.y) - hA.y);
    //  store result in faceA2
    Mat22.mulMVV(absC, hB, faceA2);
    faceA.set(faceA1.x - faceA2.x, faceA1.y - faceA2.y);
    if (faceA.x > 0 || faceA.y > 0) {
        return 0;
    }
    // Box B faces
    //  store result in faceB2
    Mat22.mulMVV(absCT, hA, faceB2);
    faceB1.set(Math.abs(dB.x) - faceB2.x, Math.abs(dB.y) - faceB2.y);
    faceB.set(faceB1.x - hB.x, faceB1.y - hB.y);
    if (faceB.x > 0 || faceB.y > 0) {
        return 0;
    }
    //  Find best axis
    // Box A faces
    let axis = Axis.FACE_A_X;
    let separation = faceA.x;
    let normalX = 0;
    let normalY = 0;
    if (dA.x > 0) {
        normalX = RotA.a;
        normalY = RotA.c;
    }
    else {
        normalX = -RotA.a;
        normalY = -RotA.c;
    }
    const RELATIVE_TOL = 0.95;
    const ABSOLUTE_TOL = 0.01;
    if (faceA.y > RELATIVE_TOL * separation + ABSOLUTE_TOL * hA.y) {
        axis = Axis.FACE_A_Y;
        separation = faceA.y;
        if (dA.y > 0) {
            normalX = RotA.b;
            normalY = RotA.d;
        }
        else {
            normalX = -RotA.b;
            normalY = -RotA.d;
        }
    }
    // Box B faces
    if (faceB.x > RELATIVE_TOL * separation + ABSOLUTE_TOL * hB.x) {
        axis = Axis.FACE_B_X;
        separation = faceB.x;
        if (dB.x > 0) {
            normalX = RotB.a;
            normalY = RotB.c;
        }
        else {
            normalX = -RotB.a;
            normalY = -RotB.c;
        }
    }
    if (faceB.y > RELATIVE_TOL * separation + ABSOLUTE_TOL * hB.y) {
        axis = Axis.FACE_B_Y;
        separation = faceB.y;
        if (dB.y > 0) {
            normalX = RotB.b;
            normalY = RotB.d;
        }
        else {
            normalX = -RotB.b;
            normalY = -RotB.d;
        }
    }
    //  Setup clipping plane data based on the separating axis
    //  Compute the clipping lines and the line segment to be clipped.
    let frontNormalX = normalX;
    let frontNormalY = normalY;
    let clipPoints = [];
    let front = null;
    if (axis === Axis.FACE_A_X) {
        front = computeFaceAX(posA, posB, RotA, RotB, hA, hB, frontNormalX, frontNormalY, clipPoints);
    }
    else if (axis === Axis.FACE_A_Y) {
        front = computeFaceAY(posA, posB, RotA, RotB, hA, hB, frontNormalX, frontNormalY, clipPoints);
    }
    else if (axis === Axis.FACE_B_X) {
        frontNormalX = -normalX;
        frontNormalY = -normalY;
        front = computeFaceBX(posA, posB, RotA, RotB, hA, hB, frontNormalX, frontNormalY, clipPoints);
    }
    else if (axis === Axis.FACE_B_Y) {
        frontNormalX = -normalX;
        frontNormalY = -normalY;
        front = computeFaceBY(posA, posB, RotA, RotB, hA, hB, frontNormalX, frontNormalY, clipPoints);
    }
    if (front === null) {
        return 0;
    }
    // Now clipPoints contains the clipping points.
    // Due to roundoff, it is possible that clipping removes all points.
    let numContacts = 0;
    for (let i = 0; i < 2; i++) {
        let separation = Vec2.dotXY(frontNormalX, frontNormalY, clipPoints[i].x, clipPoints[i].y) - front;
        if (separation <= 0) {
            contacts[numContacts] = new Contact(separation, normalX, normalY, clipPoints[i].x - (separation * frontNormalX), clipPoints[i].y - (separation * frontNormalY), clipPoints[i].fp);
            if (axis === Axis.FACE_B_X || axis === Axis.FACE_B_Y) {
                contacts[numContacts].feature.flip();
            }
            numContacts++;
        }
    }
    return numContacts;
}

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
class Arbiter {
    constructor(world, body1, body2, id) {
        this.world = world;
        if (body1.id < body2.id) {
            this.body1 = body1;
            this.body2 = body2;
        }
        else {
            this.body1 = body2;
            this.body2 = body1;
        }
        this.id = id;
        this.contacts = [];
        this.numContacts = Collide(this.contacts, this.body1, this.body2);
        this.friction = Math.sqrt(this.body1.friction * this.body2.friction);
        this.fresh = true;
    }
    stillActive() {
        return this.body1.bounds.intersects(this.body2.bounds);
    }
    //  Refresh this Arbiter - are the bodies still intersecting? If so, get the new contacts
    refresh() {
        // if (this.stillActive())
        // {
        let newContacts = [];
        let numNewContacts = Collide(newContacts, this.body1, this.body2);
        this.update(newContacts, numNewContacts);
        // }
        // else
        // {
        //     this.numContacts = 0;
        // }
        return (this.numContacts === 0);
    }
    update(newContacts, numNewContacts) {
        let mergedContacts = [];
        let contacts = this.contacts;
        let numContacts = this.numContacts;
        let warmStarting = this.world.warmStarting;
        for (let i = 0; i < numNewContacts; i++) {
            let cNew = newContacts[i];
            let k = -1;
            for (let j = 0; j < numContacts; j++) {
                let cOld = contacts[j];
                if (cNew.feature.value === cOld.feature.value) {
                    k = j;
                    break;
                }
            }
            if (k > -1) {
                let cOld = contacts[k];
                if (warmStarting) {
                    cNew.Pn = cOld.Pn;
                    cNew.Pt = cOld.Pt;
                    cNew.Pnb = cOld.Pnb;
                }
                else {
                    cNew.Pn = 0;
                    cNew.Pt = 0;
                    cNew.Pnb = 0;
                }
                mergedContacts[i] = cNew;
            }
            else {
                mergedContacts[i] = newContacts[i];
            }
        }
        this.contacts = mergedContacts;
        this.numContacts = numNewContacts;
    }
    //  return `true` if we should keep this Arbiter, or false if it's dead
    preStep(inverseDelta) {
        const allowedPenetration = this.world.allowedPenetration;
        let contacts = this.contacts;
        let numContacts = this.numContacts;
        let biasFactor = this.world.positionCorrection;
        let body1 = this.body1;
        let body2 = this.body2;
        let accumulateImpulses = this.world.accumulateImpulses;
        for (let i = 0; i < numContacts; i++) {
            let c = contacts[i];
            let r1X = c.positionX - body1.position.x;
            let r1Y = c.positionY - body1.position.y;
            let r2X = c.positionX - body2.position.x;
            let r2Y = c.positionY - body2.position.y;
            //  Precompute normal mass, tangent mass and bias
            let rn1 = Vec2.dotXY(r1X, r1Y, c.normalX, c.normalY);
            let rn2 = Vec2.dotXY(r2X, r2Y, c.normalX, c.normalY);
            let normal = body1.invMass + body2.invMass;
            normal += body1.invI * (Vec2.dotXY(r1X, r1Y, r1X, r1Y) - rn1 * rn1) + body2.invI * (Vec2.dotXY(r2X, r2Y, r2X, r2Y) - rn2 * rn2);
            c.massNormal = 1 / normal;
            let tangentX = c.normalY;
            let tangentY = -1 * c.normalX;
            let rt1 = Vec2.dotXY(r1X, r1Y, tangentX, tangentY);
            let rt2 = Vec2.dotXY(r2X, r2Y, tangentX, tangentY);
            let kTangent = body1.invMass + body2.invMass;
            kTangent += body1.invI * (Vec2.dotXY(r1X, r1Y, r1X, r1Y) - rt1 * rt1) + body2.invI * (Vec2.dotXY(r2X, r2Y, r2X, r2Y) - rt2 * rt2);
            c.massTangent = 1 / kTangent;
            c.bias = -biasFactor * inverseDelta * Math.min(0, c.separation + allowedPenetration);
            if (accumulateImpulses) {
                //  Normal + Friction impulse
                let pX = (c.Pn * c.normalX) + (c.Pt * tangentX);
                let pY = (c.Pn * c.normalY) + (c.Pt * tangentY);
                body1.velocity.x -= (body1.invMass * pX);
                body1.velocity.y -= (body1.invMass * pY);
                if (!body1.fixedRotation) {
                    body1.angularVelocity -= body1.invI * (r1X * pY - r1Y * pX);
                }
                body2.velocity.x += (body2.invMass * pX);
                body2.velocity.y += (body2.invMass * pY);
                if (!body2.fixedRotation) {
                    body2.angularVelocity += body2.invI * (r2X * pY - r2Y * pX);
                }
            }
        }
        return (numContacts > 0);
    }
    applyImpulse() {
        let contacts = this.contacts;
        let numContacts = this.numContacts;
        let body1 = this.body1;
        let body2 = this.body2;
        let accumulateImpulses = this.world.accumulateImpulses;
        for (let i = 0; i < numContacts; i++) {
            let c = contacts[i];
            c.r1X = c.positionX - body1.position.x;
            c.r1Y = c.positionY - body1.position.y;
            c.r2X = c.positionX - body2.position.x;
            c.r2Y = c.positionY - body2.position.y;
            let subX = (body2.velocity.x + (-body2.angularVelocity * c.r2Y)) - body1.velocity.x;
            let subY = (body2.velocity.y + (body2.angularVelocity * c.r2X)) - body1.velocity.y;
            let dVx = subX - (-body1.angularVelocity * c.r1Y);
            let dVy = subY - (body1.angularVelocity * c.r1X);
            //  Compute normal impulse
            let vn = Vec2.dotXY(dVx, dVy, c.normalX, c.normalY);
            let dPn = c.massNormal * (-vn + c.bias);
            if (accumulateImpulses) {
                //  Clamp accumulated impulse
                let Pn0 = c.Pn;
                c.Pn = Math.max(Pn0 + dPn, 0);
                dPn = c.Pn - Pn0;
            }
            else {
                dPn = Math.max(dPn, 0);
            }
            //  Apply contact impulse
            let PnX = dPn * c.normalX;
            let PnY = dPn * c.normalY;
            body1.velocity.x -= (body1.invMass * PnX);
            body1.velocity.y -= (body1.invMass * PnY);
            if (!body1.fixedRotation) {
                body1.angularVelocity -= body1.invI * Vec2.crossXY(c.r1X, c.r1Y, PnX, PnY);
            }
            body2.velocity.x += (body2.invMass * PnX);
            body2.velocity.y += (body2.invMass * PnY);
            if (!body2.fixedRotation) {
                body2.angularVelocity += body2.invI * Vec2.crossXY(c.r2X, c.r2Y, PnX, PnY);
            }
            //  Relative velocity at contact
            let tangentX = c.normalY;
            let tangentY = -1 * c.normalX;
            let vt = Vec2.dotXY(dVx, dVy, tangentX, tangentY);
            let dPt = c.massTangent * (-vt);
            if (accumulateImpulses) {
                // Compute friction impulse
                let maxPt = this.friction * c.Pn;
                // Clamp friction
                let oldTangentImpulse = c.Pt;
                c.Pt = Clamp(oldTangentImpulse + dPt, -maxPt, maxPt);
                dPt = c.Pt - oldTangentImpulse;
            }
            else {
                let maxPt = this.friction * dPn;
                dPt = Clamp(dPt, -maxPt, maxPt);
            }
            // Apply contact impulse
            PnX = dPt * tangentX;
            PnY = dPt * tangentY;
            body1.velocity.x -= (body1.invMass * PnX);
            body1.velocity.y -= (body1.invMass * PnY);
            if (!body1.fixedRotation) {
                body1.angularVelocity -= body1.invI * Vec2.crossXY(c.r1X, c.r1Y, PnX, PnY);
            }
            body2.velocity.x += (body2.invMass * PnX);
            body2.velocity.y += (body2.invMass * PnY);
            if (!body2.fixedRotation) {
                body2.angularVelocity += body2.invI * Vec2.crossXY(c.r2X, c.r2X, PnX, PnY);
            }
        }
        this.fresh = false;
    }
}

class Quad {
    constructor(x = 0, y = 0, width = 512, height = 512, maxObjects = 10, maxLevels = 4, level = 0) {
        this.maxObjects = 10;
        this.maxLevels = 4;
        this.objects = [];
        this.nodes = [];
        this.total = 0;
        this.x = x + (width * 0.5);
        this.y = y + (height * 0.5);
        this.width = width;
        this.height = height;
        this.maxObjects = maxObjects;
        this.maxLevels = maxLevels;
        this.level = level;
    }
    totalNodes() {
        let total = 0;
        for (const node of this.nodes) {
            total++;
            total += node.totalNodes();
        }
        return total;
    }
    add(bounds) {
        const objects = this.objects;
        const nodes = this.nodes;
        this.total++;
        let i = 0;
        let index = 0;
        if (nodes[0]) {
            index = this.getIndex(bounds);
            if (index !== -1) {
                nodes[index].add(bounds);
                return;
            }
        }
        objects.push(bounds);
        if (objects.length > this.maxObjects && this.level < this.maxLevels) {
            if (!nodes[0]) {
                this.split();
            }
            while (i < objects.length) {
                index = this.getIndex(objects[i]);
                if (index !== -1) {
                    nodes[index].add(objects.splice(i, 1)[0]);
                }
                else {
                    i++;
                }
            }
        }
    }
    get(bounds, del = false) {
        let quad = this;
        const index = this.getIndex(bounds);
        let returnObjects = this.objects;
        if (this.nodes[0]) {
            if (index !== -1) {
                returnObjects = returnObjects.concat(this.nodes[index].get(bounds, del));
                quad = this.nodes[index];
            }
            else {
                for (const node of this.nodes) {
                    returnObjects = returnObjects.concat(node.get(bounds, del));
                    quad = node;
                }
            }
        }
        return (del) ? { quad: quad, objects: returnObjects } : returnObjects;
    }
    getPoints(bounds, del = false) {
        let points = [];
        let search = this.get(bounds, del);
        if (del) {
            search = search.objects;
        }
        for (const point of search) {
            const sameCoords = (point.x === bounds.x && point.y === bounds.y);
            if (sameCoords && point.isPoint()) {
                points.push(point);
            }
            if (del) {
                this.cleanup(search.quad, point);
            }
        }
        return points;
    }
    getIntersections(bounds, del = false) {
        const intersections = [];
        const results = this.get(bounds, del);
        const objects = (del) ? results.objects : results;
        for (const intersection of objects) {
            if (intersection.intersects(bounds)) {
                intersections.push(intersection);
                if (del) {
                    this.cleanup(results.quad, intersection);
                }
            }
        }
        return intersections;
    }
    clear() {
        this.objects = [];
        this.total = 0;
        for (const node of this.nodes) {
            node.clear();
        }
        this.nodes = [];
    }
    cleanup(quad, bounds) {
        quad.objects = quad.objects.filter((o) => o != bounds);
    }
    getIndex(bounds) {
        let index = -1;
        const vMid = this.x + (this.width / 2);
        const hMid = this.y + (this.height / 2);
        const topQ = (bounds.y < hMid && bounds.y + bounds.height < hMid);
        const botQ = (bounds.y > hMid);
        if (bounds.x < vMid && bounds.x + bounds.width < vMid) {
            if (topQ) {
                index = 1;
            }
            else if (botQ) {
                index = 2;
            }
        }
        else if (bounds.x > vMid) {
            if (topQ) {
                index = 0;
            }
            else if (botQ) {
                index = 3;
            }
        }
        return index;
    }
    split() {
        const nextLevel = this.level + 1;
        const subW = Math.round(this.width / 2);
        const subH = Math.round(this.height / 2);
        const x = Math.round(this.x);
        const y = Math.round(this.y);
        const nodes = this.nodes;
        const maxObjects = this.maxObjects;
        const maxLevels = this.maxLevels;
        nodes[0] = new Quad(x + subW, y, subW, subH, maxObjects, maxLevels, nextLevel);
        nodes[1] = new Quad(x, y, subW, subH, maxObjects, maxLevels, nextLevel);
        nodes[2] = new Quad(x, y + subH, subW, subH, maxObjects, maxLevels, nextLevel);
        nodes[3] = new Quad(x + subW, y + subH, subW, subH, maxObjects, maxLevels, nextLevel);
    }
}

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
class World {
    constructor(width, height, gravity = new Vec2(0, 9.807), iterations = 10) {
        this.bodyIdSeed = 0;
        this.bodies = [];
        this.joints = [];
        this.arbiters = [];
        this.gravity = new Vec2();
        this.accumulateImpulses = true;
        this.warmStarting = true;
        this.iterations = 10;
        this.positionCorrection = 0.2;
        this.allowedPenetration = 0.01; // slop
        this.gravity.x = gravity.x;
        this.gravity.y = gravity.y;
        this.width = width;
        this.height = height;
        this.iterations = iterations;
        this.quadTree = new Quad(0, 0, this.width, this.height);
    }
    addBody(body) {
        this.bodyIdSeed++;
        body.id = this.bodyIdSeed;
        this.bodies.push(body);
        return body;
    }
    addJoint(joint) {
        this.joints.push(joint);
        return joint;
    }
    clear() {
        this.bodies = [];
        this.joints = [];
        this.arbiters = [];
        this.quadTree.clear();
        this.bodyIdSeed = 0;
        return this;
    }
    /**
     * Determine overlapping bodies and update contact points.
     * WARNING: Horribly slow O(N^2)
     */
    OLDbroadPhase() {
        window['arbitersTotal'] = 0;
        window['arbitersMerged'] = 0;
        let bodies = this.bodies;
        let length = bodies.length;
        let arbiters = this.arbiters;
        for (let i = 0; i < length - 1; i++) {
            let bodyA = bodies[i];
            for (let j = i + 1; j < length; j++) {
                let bodyB = bodies[j];
                if (bodyA.invMass === 0 && bodyB.invMass === 0) {
                    continue;
                }
                let key = bodyA.id + ':' + bodyB.id;
                let arbiter = new Arbiter(this, bodyA, bodyB, key);
                // let arbiterKey = new ArbiterKey(arbiter.body1, arbiter.body2);
                window['arbitersTotal']++;
                let iter = -1;
                for (let a = 0; a < arbiters.length; a++) {
                    //  We have an arbiter for this body pair already, store the array index in `iter`
                    if (arbiters[a].id === key) {
                        iter = a;
                        break;
                    }
                }
                //  if in contact (passed AABB check and clip check)
                if (arbiter.numContacts > 0) {
                    window['arbitersMerged']++;
                    if (iter === -1) {
                        //  new arbiter, create a Pair and shove into the array
                        // arbiters.push(new ArbiterPair(arbiterKey, arbiter));
                        arbiters.push(arbiter);
                    }
                    else {
                        //  Already in the array, so update the Arbiter instance, passing in the new contacts
                        // arbiters[iter].second.update(arbiter.contacts, arbiter.numContacts);
                        arbiters[iter].update(arbiter.contacts, arbiter.numContacts);
                    }
                }
                else if (arbiter.numContacts === 0 && iter > -1) {
                    //  Nuke empty Arbiter Pair, as the two bodies no longer have any contact
                    arbiters.splice(iter, 1);
                }
            }
        }
    }
    OLDstep(delta) {
        let inverseDelta = (delta > 0) ? 1 / delta : 0;
        this.OLDbroadPhase();
        //  Integrate forces
        const bodies = this.bodies;
        const gravity = this.gravity;
        for (let i = 0; i < bodies.length; i++) {
            bodies[i].preStep(delta, gravity);
        }
        //  Pre-steps
        const arbiters = this.arbiters;
        const joints = this.joints;
        for (let i = 0; i < arbiters.length; i++) {
            arbiters[i].preStep(inverseDelta);
        }
        for (let i = 0; i < joints.length; i++) {
            joints[i].preStep(inverseDelta);
        }
        //  Perform iterations
        for (let i = 0; i < this.iterations; i++) {
            //  Apply impulse
            for (let arb = 0; arb < arbiters.length; arb++) {
                arbiters[arb].applyImpulse();
            }
            //  Apply joint impulse
            for (let j = 0; j < joints.length; j++) {
                joints[j].applyImpulse();
            }
        }
        //  Integrate velocities
        for (let i = 0; i < bodies.length; i++) {
            bodies[i].postStep(delta);
        }
    }
    broadPhase() {
        window['arbitersTotal'] = 0;
        window['arbitersMerged'] = 0;
        const quad = this.quadTree;
        quad.clear();
        const bodies = this.bodies;
        const length = bodies.length;
        const arbiters = this.arbiters;
        //  Seed the quadtree
        for (let i = 0; i < length; i++) {
            quad.add(bodies[i].bounds);
        }
        for (let i = 0; i < length; i++) {
            let bodyA = bodies[i];
            let results = quad.getIntersections(bodyA.bounds);
            for (let j = 0; j < results.length; j++) {
                let bodyB = results[j].body;
                if (bodyA.id === bodyB.id || (bodyA.invMass === 0 && bodyB.invMass === 0)) {
                    continue;
                }
                let key = (bodyA.id < bodyB.id) ? bodyA.id + ':' + bodyB.id : bodyB.id + ':' + bodyA.id;
                let foundPair = false;
                for (let a = 0; a < arbiters.length; a++) {
                    //  We have an arbiter for this body pair already
                    //  Make sure it wasn't created this frame too, if it wasn't, we can update it
                    if (arbiters[a].id === key) {
                        foundPair = true;
                        break;
                    }
                }
                if (foundPair) {
                    continue;
                }
                else {
                    //  They intersect!
                    //  Need a new Arbiter as we don't have one for this pair
                    let arbiter = new Arbiter(this, bodyA, bodyB, key);
                    window['arbitersTotal']++;
                    if (arbiter.numContacts > 0) {
                        //  Even though they intersect, we still check the contacts (as only the bounds intersect)
                        arbiters.push(arbiter);
                    }
                }
            }
        }
    }
    step(delta) {
        const arbiters = this.arbiters;
        const joints = this.joints;
        let inverseDelta = (delta > 0) ? 1 / delta : 0;
        //  refresh all of the current arbiters
        for (let i = 0; i < arbiters.length; i++) {
            arbiters[i].refresh();
        }
        this.broadPhase();
        //  Integrate forces
        const bodies = this.bodies;
        const gravity = this.gravity;
        for (let i = 0; i < bodies.length; i++) {
            bodies[i].preStep(delta, gravity);
        }
        //  Pre-steps
        const remainingArbiters = [];
        for (let i = 0; i < arbiters.length; i++) {
            if (arbiters[i].preStep(inverseDelta)) {
                remainingArbiters.push(arbiters[i]);
            }
        }
        //  Swizzle them
        this.arbiters = remainingArbiters;
        for (let i = 0; i < joints.length; i++) {
            joints[i].preStep(inverseDelta);
        }
        //  Perform iterations
        for (let i = 0; i < this.iterations; i++) {
            //  Apply impulse
            for (let arb = 0; arb < remainingArbiters.length; arb++) {
                remainingArbiters[arb].applyImpulse();
            }
            //  Apply joint impulse
            for (let j = 0; j < joints.length; j++) {
                joints[j].applyImpulse();
            }
        }
        //  Integrate velocities
        for (let i = 0; i < bodies.length; i++) {
            bodies[i].postStep(delta);
        }
    }
}

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Generate a random floating point number between the two given bounds, minimum inclusive, maximum exclusive.
 *
 * @function Random
 *
 * @param {number} min - The lower bound for the float, inclusive.
 * @param {number} max - The upper bound for the float exclusive.
 *
 * @return {number} A random float within the given range.
 */
function Random(min, max) {
    return Math.random() * (max - min) + min;
}

let delta = 1 / 60;
let iterations = 10;
let gravity = new Vec2(0, 10);
let demoIndex = 1;
let oldStep = false;
const k_pi = 3.14159265358979323846264;
let width = 1280;
let height = 720;
let zoom = 30;
let pan_x = 0;
let pan_y = 8;
let world = new World(width, height, gravity, iterations);
window['world'] = world;
function InitDemo(index) {
    world.clear();
    frame = 0;
    demoIndex = index;
    switch (index) {
        case 1: {
            Demo1();
            break;
        }
        case 2: {
            Demo2();
            break;
        }
        case 3: {
            break;
        }
        case 4: {
            Demo4();
            break;
        }
        case 5: {
            Demo5();
            break;
        }
        case 6: {
            Demo6();
            break;
        }
        case 7: {
            Demo7();
            break;
        }
        case 8: {
            Demo8();
            break;
        }
        case 9: {
            Demo9();
            break;
        }
    }
}
// Single box
function Demo1() {
    world.addBody(new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE));
    world.addBody(new Body(0, -4, 1, 1, 200));
}
// A simple pendulum
function Demo2() {
    /*
    const b1 = world.addBody(new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE));
    const b2 = world.addBody(new Body(9, -11, 1, 1, 100));

    let j = world.addJoint(new Joint());
    j.set(world, b1, b2, new Vec2(0, -11));
    */
    world.addBody(new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE));
    const b1 = world.addBody(new Body(-2.5, -15, 1, 1, 100));
    const b2 = world.addBody(new Body(2.5, -15, 1, 1, 100));
    world.addBody(new Body(-2.5, -10, 8, 0.5, Number.MAX_VALUE));
    let j = world.addJoint(new Joint());
    //  x0 = the joint is in the middle space between the 2 bodies
    //  x2 = the joint is near the right-hand body
    //  x-2 = the joint is near the left-hand body
    // j.set(world, b1, b2, new Vec2(-1, -15));
    j.set(world, b1, b2, new Vec2(b1.position.x, b1.position.y));
}
// A vertical stack
function Demo4() {
    world.addBody(new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE));
    for (let i = 0; i < 10; i++) {
        let b = new Body(Random(-0.1, 0.1), -(0.51 + 1.05 * i), 1, 1, 1);
        b.friction = 0.2;
        world.addBody(b);
    }
}
// A pyramid
function Demo5() {
    world.addBody(new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE));
    let x = new Vec2(-6, -0.75);
    let y = new Vec2();
    for (let i = 0; i < 12; i++) {
        //  y = x
        y.set(x.x, x.y);
        for (let j = i; j < 12; j++) {
            world.addBody(new Body(y.x, y.y, 1, 1, 10));
            y.x += 1.125;
        }
        x.x += 0.5625;
        x.y -= 2;
    }
}
// A teeter
function Demo6() {
    const b1 = world.addBody(new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE));
    const b2 = world.addBody(new Body(0, -1, 12, 0.25, 100));
    const b3 = world.addBody(new Body(-5, -2, 0.5, 0.5, 25));
    const b4 = world.addBody(new Body(-5.5, -2, 0.5, 0.5, 25));
    const b5 = world.addBody(new Body(5.5, -15, 1, 1, 100));
    let j = world.addJoint(new Joint());
    j.set(world, b1, b2, new Vec2(0, -1));
}
// A suspension bridge
function Demo7() {
    let b1 = world.addBody(new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE));
    const numPlanks = 15;
    let mass = 50.0;
    let planks = [];
    for (let i = 0; i < numPlanks; i++) {
        let p = world.addBody(new Body(-8.5 + 1.25 * i, -10, 1, 0.25, mass));
        planks.push(p);
    }
    // Tuning
    let frequencyHz = 2.0;
    let dampingRatio = 0.7;
    // frequency in radians
    let omega = 2.0 * k_pi * frequencyHz;
    // damping coefficient
    let d = 2.0 * mass * dampingRatio * omega;
    // spring stifness
    let k = mass * omega * omega;
    // magic formulas
    let softness = 1.0 / (d + delta * k);
    let biasFactor = delta * k / (d + delta * k);
    let j;
    for (let i = 0; i < numPlanks - 1; i++) {
        let p1 = planks[i];
        let p2 = planks[i + 1];
        j = world.addJoint(new Joint());
        j.set(world, p1, p2, new Vec2(p1.position.x + ((p2.position.x - p1.position.x) / 2), p1.position.y));
        j.softness = softness;
        j.biasFactor = biasFactor;
        // console.log(j.)
    }
    j = world.addJoint(new Joint());
    j.set(world, b1, planks[0], new Vec2(-9.125, -10));
    j.softness = softness;
    j.biasFactor = biasFactor;
    j = world.addJoint(new Joint());
    j.set(world, b1, planks[numPlanks - 1], new Vec2(-9.125 + 1.25 * numPlanks, -10));
    j.softness = softness;
    j.biasFactor = biasFactor;
    //  Some random bodies
    for (let i = 0; i < 20; i++) {
        world.addBody(new Body(Random(-8, 8), Random(-20, -30), 1, 1, 1));
    }
}
// Dominos
function Demo8() {
    const b1 = world.addBody(new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE));
    world.addBody(new Body(-1.5, -10, 10, 0.5, Number.MAX_VALUE));
    let b;
    for (let i = 0; i < 10; i++) {
        b = new Body(-6 + (1 * i), -11.125, 0.2, 2.0, 10);
        b.friction = 0.1;
        world.addBody(b);
    }
    b = world.addBody(new Body(1, -6, 14, 0.5, Number.MAX_VALUE));
    b.rotation = -0.3;
    const b2 = world.addBody(new Body(-7, -4, 0.5, 3.0, Number.MAX_VALUE));
    const b3 = world.addBody(new Body(-0.9, -1, 12, 0.25, 20));
    let j = world.addJoint(new Joint());
    j.set(world, b1, b3, new Vec2(-2, -1));
    const b4 = world.addBody(new Body(-10, -15, 0.5, 0.5, 10));
    j = world.addJoint(new Joint());
    j.set(world, b2, b4, new Vec2(-7, -15));
    const b5 = world.addBody(new Body(6, -2.5, 2, 2, 20));
    b5.friction = 0.1;
    j = world.addJoint(new Joint());
    j.set(world, b1, b5, new Vec2(6, -2.6));
    const b6 = world.addBody(new Body(6, -3.6, 2, 0.2, 10));
    j = world.addJoint(new Joint());
    j.set(world, b5, b6, new Vec2(7, -3.5));
}
// A multi-pendulum (chain)
function Demo9() {
    let b1 = world.addBody(new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE));
    let mass = 10;
    // Tuning
    let frequencyHz = 4.;
    let dampingRatio = 0.7;
    // frequency in radians
    let omega = 2.0 * k_pi * frequencyHz;
    // damping coefficient
    let d = 2.0 * mass * dampingRatio * omega;
    // spring stiffness
    let k = mass * omega * omega;
    // magic formulas
    let softness = 1.0 / (d + delta * k);
    let biasFactor = delta * k / (d + delta * k);
    const y = -16.0;
    for (let i = 0; i < 15; i++) {
        let b = world.addBody(new Body(0.5 + i, y, 0.75, 0.25, mass));
        let j = world.addJoint(new Joint());
        j.set(world, b1, b, new Vec2(i, y));
        j.softness = softness;
        j.biasFactor = biasFactor;
        b1 = b;
    }
}
let renderer = new CanvasRenderer(document.getElementById('demo'));
// renderer.showContacts = false;
renderer.showBounds = false;
let pause = false;
let frame = 0;
InitDemo(1);
let demoList = document.getElementById('demolist');
demoList.addEventListener('change', (e) => {
    let target = e.target;
    demoIndex = parseInt(target.value);
    InitDemo(demoIndex);
    pauseButton.innerText = 'play';
    pause = true;
});
let frameText = document.getElementById('frame');
let bodiesText = document.getElementById('bodies');
let jointsText = document.getElementById('joints');
let pauseButton = document.getElementById('pause');
let boundsToggle = document.getElementById('showBounds');
let contactsToggle = document.getElementById('showContacts');
let jointsToggle = document.getElementById('showJoints');
let bodiesToggle = document.getElementById('showBodies');
let zoomRange = document.getElementById('zoom');
let panHRange = document.getElementById('panH');
let panVRange = document.getElementById('panV');
let stepButton = document.getElementById('stepType');
boundsToggle.addEventListener('change', () => {
    renderer.showBounds = boundsToggle.checked;
});
contactsToggle.addEventListener('change', () => {
    renderer.showContacts = contactsToggle.checked;
});
jointsToggle.addEventListener('change', () => {
    renderer.showJoints = jointsToggle.checked;
});
bodiesToggle.addEventListener('change', () => {
    renderer.showBodies = bodiesToggle.checked;
});
zoomRange.addEventListener('input', () => {
    zoom = zoomRange.valueAsNumber;
});
panHRange.addEventListener('input', () => {
    pan_x = panHRange.valueAsNumber;
});
panVRange.addEventListener('input', () => {
    pan_y = panVRange.valueAsNumber;
});
pauseButton.addEventListener('click', () => {
    if (pause) {
        pauseButton.innerText = 'pause';
        pause = false;
    }
    else {
        pauseButton.innerText = 'play';
        pause = true;
    }
});
stepButton.addEventListener('click', () => {
    if (oldStep) {
        stepButton.innerText = 'NEW';
        oldStep = false;
    }
    else {
        stepButton.innerText = 'OLD';
        oldStep = true;
    }
});
function loop() {
    if (!pause) {
        if (oldStep) {
            world.OLDstep(delta);
        }
        else {
            world.step(delta);
        }
        frame++;
    }
    renderer.render(world, zoom, pan_x, pan_y);
    frameText.value = frame.toString();
    bodiesText.value = world.bodies.length.toString();
    jointsText.value = world.joints.length.toString();
    requestAnimationFrame(loop);
}
loop();
