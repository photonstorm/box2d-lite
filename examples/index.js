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
        window['vec2Total']++;
    }
    set(x = 0, y = 0) {
        this.x = x;
        this.y = y;
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
    static sub(vA, vB) {
        return new Vec2(vA.x - vB.x, vA.y - vB.y);
    }
    static mulVV(vA, vB) {
        return new Vec2(vA.x * vB.x, vA.y * vB.y);
    }
    static mulSV(s, v) {
        return new Vec2(s * v.x, s * v.y);
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
    static crossVS(v, s) {
        return new Vec2(s * v.y, -s * v.x);
    }
    static crossSV(s, v) {
        return new Vec2(-s * v.y, s * v.x);
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
    constructor(width, mass) {
        this.position = new Vec2();
        this.rotation = 0;
        this.velocity = new Vec2();
        this.angularVelocity = 0;
        this.force = new Vec2();
        this.torque = 0;
        this.width = new Vec2();
        this.friction = 0.2;
        this.mass = Number.MAX_VALUE;
        this.invMass = 0;
        this.I = Number.MAX_VALUE;
        this.invI = 0;
        this.id = 0;
        this.set(width, mass);
    }
    set(width, mass) {
        this.width = width;
        this.mass = mass;
        if (mass < Number.MAX_VALUE) {
            this.invMass = 1 / mass;
            this.I = mass * (width.x * width.x + width.y * width.y) / 12;
            this.invI = 1 / this.I;
        }
        else {
            this.invMass = 0;
            this.I = Number.MAX_VALUE;
            this.invI = 0;
        }
        return this;
    }
    addForce(force) {
        this.force.add(force);
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
class Mat22 {
    constructor(a = 0, c = 0, b = 0, d = 0) {
        //  col1
        this.a = a;
        this.c = c;
        //  col2
        this.b = b;
        this.d = d;
        window['mat22Total']++;
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
    setFromVec2(vA, vB) {
        this.a = vA.x;
        this.c = vA.y;
        this.b = vB.x;
        this.d = vB.y;
        return this;
    }
    static add(mA, mB) {
        return new Mat22(mA.a + mB.a, mA.c + mB.c, mA.b + mB.b, mA.d + mB.d);
    }
    static mulMV(m, v) {
        return new Vec2(m.a * v.x + m.b * v.y, m.c * v.x + m.d * v.y);
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
    static transpose(m) {
        return new Mat22(m.a, m.b, m.c, m.d);
    }
    static invert(m) {
        const a = m.a;
        const c = m.c;
        const b = m.b;
        const d = m.d;
        let det = 1 / (a * d - b * c);
        return new Mat22(det * d, det * -b, det * -c, det * a);
    }
}

class CanvasRenderer {
    constructor(canvas) {
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
    render(world) {
        const context = this.context;
        const bodies = world.bodies;
        const joints = world.joints;
        const arbiters = world.arbiters;
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < bodies.length; i++) {
            this.renderBody(bodies[i], context);
        }
        for (let i = 0; i < arbiters.length; i++) {
            let arbiter = arbiters[i].second;
            for (let c = 0; c < arbiter.contacts.length; c++) {
                this.renderContact(arbiter.contacts[c], context);
            }
        }
        for (let i = 0; i < joints.length; i++) {
            this.renderJoint(joints[i], context);
        }
    }
    renderBody(body, ctx) {
        this._M0.set(body.rotation);
        let position = body.position;
        // let h: Vec2 = Vec2.mulSV(0.5, body.width);
        let hX = 0.5 * body.width.x;
        let hY = 0.5 * body.width.y;
        // linear and rotational position of vertices
        // this._v5.set(-hX, -hY);
        // this._v6.set(hX, -hY);
        // this._v7.set(hX, hY);
        // this._v8.set(-hX, hY);
        const v1 = this._v1;
        const v2 = this._v2;
        const v3 = this._v3;
        const v4 = this._v4;
        // let v1: Vec2 = Vec2.add(position, Mat22.mulMV(this._M0, this._v5));
        v1.set(position.x + (this._M0.a * -hX + this._M0.b * -hY), position.y + (this._M0.c * -hX + this._M0.d * -hY));
        // let v2: Vec2 = Vec2.add(position, Mat22.mulMV(this._M0, this._v6));
        v2.set(position.x + (this._M0.a * hX + this._M0.b * -hY), position.y + (this._M0.c * hX + this._M0.d * -hY));
        // let v3: Vec2 = Vec2.add(position, Mat22.mulMV(this._M0, this._v7));
        v3.set(position.x + (this._M0.a * hX + this._M0.b * hY), position.y + (this._M0.c * hX + this._M0.d * hY));
        // let v4: Vec2 = Vec2.add(position, Mat22.mulMV(this._M0, this._v8));
        v4.set(position.x + (this._M0.a * -hX + this._M0.b * hY), position.y + (this._M0.c * -hX + this._M0.d * hY));
        // let v1: Vec2 = Vec2.add(x, Mat22.mulMV(this._M0, new Vec2(-h.x, -h.y)));
        // let v2: Vec2 = Vec2.add(x, Mat22.mulMV(this._M0, new Vec2( h.x, -h.y)));
        // let v3: Vec2 = Vec2.add(x, Mat22.mulMV(this._M0, new Vec2( h.x,  h.y)));
        // let v4: Vec2 = Vec2.add(x, Mat22.mulMV(this._M0, new Vec2(-h.x,  h.y)));
        const orientation = this._orientation;
        // let orientation: Vec2 = Vec2.add(position, Mat22.mulMV(this._M0, new Vec2(hX, 0)));
        orientation.set(position.x + (this._M0.a * hX), position.y + (this._M0.c * hX));
        // draw centroid of rectangle
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(body.position.x, body.position.y, 2, 0, 2 * Math.PI);
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
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(contact.position.x, contact.position.y, 2, 0, 2 * Math.PI);
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
        // let x2 = b2.position;
        // let p1 = Vec2.add(x1, Mat22.mulMV(this._M0, joint.localAnchor1));
        // let p2 = Vec2.add(x2, Mat22.mulMV(this._M1, joint.localAnchor2));
        p1.set(position1.x + (this._M0.a * joint.localAnchor1.x + this._M0.b * joint.localAnchor1.y), position1.y + (this._M0.c * joint.localAnchor1.x + this._M0.d * joint.localAnchor1.y));
        p2.set(position2.x + (this._M1.a * joint.localAnchor2.x + this._M1.b * joint.localAnchor2.y), position2.y + (this._M1.c * joint.localAnchor2.x + this._M1.d * joint.localAnchor2.y));
        ctx.beginPath();
        ctx.moveTo(position1.x, position1.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(position2.x, position2.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
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
class Joint {
    constructor() {
        this.M = new Mat22();
        this.localAnchor1 = new Vec2();
        this.localAnchor2 = new Vec2();
        this.r1 = new Vec2();
        this.r2 = new Vec2();
        this.bias = new Vec2();
        this.P = new Vec2(); // accumulated impulse
        this.biasFactor = 0.2;
        this.softness = 0;
    }
    set(world, body1, body2, anchor) {
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
    preStep(inverseDelta) {
        const body1 = this.body1;
        const body2 = this.body2;
        //  Pre-compute anchors, mass matrix and bias
        let Rot1 = new Mat22().set(body1.rotation);
        let Rot2 = new Mat22().set(body2.rotation);
        let r1 = Mat22.mulMV(Rot1, this.localAnchor1);
        let r2 = Mat22.mulMV(Rot2, this.localAnchor2);
        //  Inverse mass matrix
        let K1 = new Mat22(body1.invMass + body2.invMass, 0, 0, body1.invMass + body2.invMass);
        //  body1 rotational mass matrix i.e. moment of inertia
        let K2 = new Mat22(body1.invI * r1.y * r1.y, -body1.invI * r1.x * r1.y, -body1.invI * r1.x * r1.y, body1.invI * r1.x * r1.x);
        //  body2 rotational mass matrix i.e. moment of inertia
        let K3 = new Mat22(body2.invI * r2.y * r2.y, -body2.invI * r2.x * r2.y, -body2.invI * r2.x * r2.y, body2.invI * r2.x * r2.x);
        let K = Mat22.add(Mat22.add(K1, K2), K3);
        K.a += this.softness;
        K.d += this.softness;
        this.M = Mat22.invert(K);
        let p1 = Vec2.add(body1.position, r1);
        let p2 = Vec2.add(body2.position, r2);
        let dp = Vec2.sub(p2, p1);
        if (this.world.positionCorrection) {
            this.bias = Vec2.mulSV(-this.biasFactor, Vec2.mulSV(inverseDelta, dp));
        }
        else {
            this.bias.set(0, 0);
        }
        if (this.world.warmStarting) {
            // Apply accumulated impulse.
            body1.velocity.sub(Vec2.mulSV(body1.invMass, this.P));
            body1.angularVelocity -= body1.invI * Vec2.crossVV(r1, this.P);
            body2.velocity.add(Vec2.mulSV(body2.invMass, this.P));
            body2.angularVelocity += body2.invI * Vec2.crossVV(r2, this.P);
        }
        else {
            this.P.set(0, 0);
        }
        this.r1 = r1;
        this.r2 = r2;
    }
    applyImpulse() {
        const body1 = this.body1;
        const body2 = this.body2;
        const r1 = this.r1;
        const r2 = this.r2;
        let dv = Vec2.sub(Vec2.sub(Vec2.add(body2.velocity, Vec2.crossSV(body2.angularVelocity, r2)), body1.velocity), Vec2.crossSV(body1.angularVelocity, r1));
        let impulse = new Vec2();
        impulse = Mat22.mulMV(this.M, Vec2.sub(Vec2.sub(this.bias, dv), Vec2.mulSV(this.softness, this.P)));
        body1.velocity.sub(Vec2.mulSV(body1.invMass, impulse));
        body1.angularVelocity -= body1.invI * Vec2.crossVV(r1, impulse);
        body2.velocity.add(Vec2.mulSV(body2.invMass, impulse));
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
    constructor() {
        this.v = new Vec2();
        this.fp = new FeaturePair();
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
    // let RotT: Mat22 = Mat22.transpose(Rot);
    let invA = Rot.a;
    let invB = Rot.c;
    let invC = Rot.b;
    let invD = Rot.d;
    // let n: Vec2 = new Vec2(
    //     -(RotT.a * normalX + RotT.b * normalY),
    //     -(RotT.c * normalX + RotT.d * normalY)
    // );
    // let n: Vec2 = new Vec2(
    //     -(invA * normalX + invB * normalY),
    //     -(invC * normalX + invD * normalY)
    // );
    const nX = -(invA * normalX + invB * normalY);
    const nY = -(invC * normalX + invD * normalY);
    const absX = Math.abs(nX);
    const absY = Math.abs(nY);
    // let nAbs: Vec2 = Vec2.abs(n);
    const clipVertex0 = new ClipVertex();
    const clipVertex1 = new ClipVertex();
    if (absX > absY) {
        if (Math.sign(nX) > 0) {
            clipVertex0.v.set(h.x, -h.y);
            clipVertex0.fp.e.inEdge2 = EdgeNumbers.EDGE3;
            clipVertex0.fp.e.outEdge2 = EdgeNumbers.EDGE4;
            clipVertex1.v.set(h.x, h.y);
            clipVertex1.fp.e.inEdge2 = EdgeNumbers.EDGE4;
            clipVertex1.fp.e.outEdge2 = EdgeNumbers.EDGE1;
        }
        else {
            clipVertex0.v.set(-h.x, h.y);
            clipVertex0.fp.e.inEdge2 = EdgeNumbers.EDGE1;
            clipVertex0.fp.e.outEdge2 = EdgeNumbers.EDGE2;
            clipVertex1.v.set(-h.x, -h.y);
            clipVertex1.fp.e.inEdge2 = EdgeNumbers.EDGE2;
            clipVertex1.fp.e.outEdge2 = EdgeNumbers.EDGE3;
        }
    }
    else {
        if (Math.sign(nY) > 0) {
            clipVertex0.v.set(h.x, h.y);
            clipVertex0.fp.e.inEdge2 = EdgeNumbers.EDGE4;
            clipVertex0.fp.e.outEdge2 = EdgeNumbers.EDGE1;
            clipVertex1.v.set(-h.x, h.y);
            clipVertex1.fp.e.inEdge2 = EdgeNumbers.EDGE1;
            clipVertex1.fp.e.outEdge2 = EdgeNumbers.EDGE2;
        }
        else {
            clipVertex0.v.set(-h.x, -h.y);
            clipVertex0.fp.e.inEdge2 = EdgeNumbers.EDGE2;
            clipVertex0.fp.e.outEdge2 = EdgeNumbers.EDGE3;
            clipVertex1.v.set(h.x, -h.y);
            clipVertex1.fp.e.inEdge2 = EdgeNumbers.EDGE3;
            clipVertex1.fp.e.outEdge2 = EdgeNumbers.EDGE4;
        }
    }
    // clipVertex0.v = Vec2.add(pos, Mat22.mulMV(Rot, clipVertex0.v));
    // clipVertex1.v = Vec2.add(pos, Mat22.mulMV(Rot, clipVertex1.v));
    //  inline:
    const v0 = clipVertex0.v;
    const v1 = clipVertex1.v;
    let mx = pos.x + (Rot.a * v0.x + Rot.b * v0.y);
    let my = pos.y + (Rot.c * v0.x + Rot.d * v0.y);
    v0.set(mx, my);
    mx = pos.x + (Rot.a * v1.x + Rot.b * v1.y);
    my = pos.y + (Rot.c * v1.x + Rot.d * v1.y);
    v1.set(mx, my);
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
    constructor() {
        this.position = new Vec2();
        this.normal = new Vec2();
        this.r1 = new Vec2();
        this.r2 = new Vec2();
        this.separation = 0;
        this.Pn = 0;
        this.Pt = 0;
        this.Pnb = 0;
        this.massNormal = 0;
        this.massTangent = 0;
        this.bias = 0;
        this.feature = new FeaturePair();
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
    let distance0 = Vec2.dotXYV(normalX, normalY, vIn[0].v) - offset;
    let distance1 = Vec2.dotXYV(normalX, normalY, vIn[1].v) - offset;
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
        let clip = new ClipVertex();
        //  This single line creates 3 vec2s into a newly created vec2!
        // clip.v = Vec2.add(vIn[0].v, Vec2.mulSV(interp, Vec2.sub(vIn[1].v, vIn[0].v)));
        //  This saves 189 vec2 creations per frame:
        clip.v.set(vIn[0].v.x + (interp * (vIn[1].v.x - vIn[0].v.x)), vIn[0].v.y + (interp * (vIn[1].v.y - vIn[0].v.y)));
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
function Collide(contacts, bodyA, bodyB) {
    // Setup
    let hA = Vec2.mulSV(0.5, bodyA.width); // half the width of bodyA
    let hB = Vec2.mulSV(0.5, bodyB.width); // half the width of bodyB
    let posA = bodyA.position;
    let posB = bodyB.position;
    let RotA = new Mat22().set(bodyA.rotation);
    let RotB = new Mat22().set(bodyB.rotation);
    let RotAT = Mat22.transpose(RotA);
    let RotBT = Mat22.transpose(RotB);
    let dp = Vec2.sub(posB, posA);
    let dA = Mat22.mulMV(RotAT, dp);
    let dB = Mat22.mulMV(RotBT, dp);
    let C = Mat22.mulMM(RotAT, RotB);
    let absC = Mat22.abs(C);
    let absCT = Mat22.transpose(absC);
    // Box A faces
    let faceA = Vec2.sub(Vec2.sub(Vec2.abs(dA), hA), Mat22.mulMV(absC, hB));
    if (faceA.x > 0 || faceA.y > 0) {
        return 0;
    }
    // Box B faces
    let faceB = Vec2.sub(Vec2.sub(Vec2.abs(dB), Mat22.mulMV(absCT, hA)), hB);
    if (faceB.x > 0 || faceB.y > 0) {
        return 0;
    }
    //  Find best axis
    // Box A faces
    let axis = Axis.FACE_A_X;
    let separation = faceA.x;
    // let normal: Vec2 = (dA.x > 0) ? RotA.col1 : Vec2.neg(RotA.col1);
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
        let separation = Vec2.dotXYV(frontNormalX, frontNormalY, clipPoints[i].v) - front;
        if (separation <= 0) {
            contacts[numContacts] = new Contact();
            contacts[numContacts].separation = separation;
            contacts[numContacts].normal.set(normalX, normalY);
            contacts[numContacts].position = new Vec2(clipPoints[i].v.x - (separation * frontNormalX), clipPoints[i].v.y - (separation * frontNormalY));
            contacts[numContacts].feature = clipPoints[i].fp;
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
    constructor(world, body1, body2) {
        this.world = world;
        if (body1.id < body2.id) {
            this.body1 = body1;
            this.body2 = body2;
        }
        else {
            this.body1 = body2;
            this.body2 = body1;
        }
        this.contacts = [];
        this.numContacts = Collide(this.contacts, this.body1, this.body2);
        this.friction = Math.sqrt(this.body1.friction * this.body2.friction);
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
    preStep(inverseDelta) {
        //  slop
        const allowedPenetration = 0.01;
        let contacts = this.contacts;
        let numContacts = this.numContacts;
        let biasFactor = (this.world.positionCorrection) ? 0.2 : 0;
        let body1 = this.body1;
        let body2 = this.body2;
        let accumulateImpulses = this.world.accumulateImpulses;
        for (let i = 0; i < numContacts; i++) {
            let c = contacts[i];
            let r1 = Vec2.sub(c.position, body1.position);
            let r2 = Vec2.sub(c.position, body2.position);
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
            if (accumulateImpulses) {
                //  Normal + Friction impulse
                let P = Vec2.add(Vec2.mulSV(c.Pn, c.normal), Vec2.mulSV(c.Pt, tangent));
                body1.velocity.sub(Vec2.mulSV(body1.invMass, P));
                body1.angularVelocity -= body1.invI * Vec2.crossVV(r1, P);
                body2.velocity.add(Vec2.mulSV(body2.invMass, P));
                body2.angularVelocity += body2.invI * Vec2.crossVV(r2, P);
            }
        }
    }
    applyImpulse() {
        let contacts = this.contacts;
        let numContacts = this.numContacts;
        let body1 = this.body1;
        let body2 = this.body2;
        let accumulateImpulses = this.world.accumulateImpulses;
        for (let i = 0; i < numContacts; i++) {
            let c = contacts[i];
            c.r1 = Vec2.sub(c.position, body1.position);
            c.r2 = Vec2.sub(c.position, body2.position);
            //  Relative velocity at contact
            let dv = Vec2.sub(Vec2.sub(Vec2.add(body2.velocity, Vec2.crossSV(body2.angularVelocity, c.r2)), body1.velocity), Vec2.crossSV(body1.angularVelocity, c.r1));
            //  Compute normal impulse
            let vn = Vec2.dot(dv, c.normal);
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
            let Pn = Vec2.mulSV(dPn, c.normal);
            body1.velocity.sub(Vec2.mulSV(body1.invMass, Pn));
            body1.angularVelocity -= body1.invI * Vec2.crossVV(c.r1, Pn);
            body2.velocity.add(Vec2.mulSV(body2.invMass, Pn));
            body2.angularVelocity += body2.invI * Vec2.crossVV(c.r2, Pn);
            //  Relative velocity at contact
            dv = Vec2.sub(Vec2.sub(Vec2.add(body2.velocity, Vec2.crossSV(body2.angularVelocity, c.r2)), body1.velocity), Vec2.crossSV(body1.angularVelocity, c.r1));
            let tangent = Vec2.crossVS(c.normal, 1);
            let vt = Vec2.dot(dv, tangent);
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
            let Pt = Vec2.mulSV(dPt, tangent);
            body1.velocity.sub(Vec2.mulSV(body1.invMass, Pt));
            body1.angularVelocity -= body1.invI * Vec2.crossVV(c.r1, Pt);
            body2.velocity.add(Vec2.mulSV(body2.invMass, Pt));
            body2.angularVelocity += body2.invI * Vec2.crossVV(c.r2, Pt);
        }
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
class ArbiterKey {
    constructor(bodyA, bodyB) {
        this.bodyA = bodyA;
        this.bodyB = bodyB;
        this.value = bodyA.id + ':' + bodyB.id;
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
class ArbiterPair {
    constructor(key, arbiter) {
        this.first = key;
        this.second = arbiter;
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
    constructor(gravity = new Vec2(0, 9.807), iterations = 10) {
        this.bodyIdSeed = 0;
        this.bodies = [];
        this.joints = [];
        this.arbiters = [];
        this.gravity = new Vec2();
        this.iterations = 10;
        this.accumulateImpulses = true;
        this.warmStarting = true;
        this.positionCorrection = true;
        this.gravity.x = gravity.x;
        this.gravity.y = gravity.y;
        this.iterations = iterations;
    }
    addBody(body) {
        this.bodyIdSeed++;
        body.id = this.bodyIdSeed;
        this.bodies.push(body);
        return this;
    }
    addJoint(joint) {
        this.joints.push(joint);
        return this;
    }
    clear() {
        this.bodies = [];
        this.joints = [];
        this.arbiters = [];
        return this;
    }
    /**
     * Determine overlapping bodies and update contact points
     */
    broadPhase() {
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
                let arbiter = new Arbiter(this, bodyA, bodyB);
                let arbiterKey = new ArbiterKey(bodyA, bodyB);
                let iter = -1;
                for (let a = 0; a < arbiters.length; a++) {
                    if (arbiters[a].first.value === arbiterKey.value) {
                        iter = a;
                        break;
                    }
                }
                if (arbiter.numContacts > 0) {
                    if (iter === -1) {
                        arbiters.push(new ArbiterPair(arbiterKey, arbiter));
                    }
                    else {
                        arbiters[iter].second.update(arbiter.contacts, arbiter.numContacts);
                    }
                }
                else if (arbiter.numContacts === 0 && iter > -1) {
                    //  Nuke empty arbiter with no contacts
                    arbiters.splice(iter, 1);
                }
            }
        }
    }
    step(delta) {
        let inverseDelta = (delta > 0) ? 1 / delta : 0;
        this.broadPhase();
        //  Integrate forces
        const bodies = this.bodies;
        const gravity = this.gravity;
        for (let i = 0; i < bodies.length; i++) {
            let body = bodies[i];
            if (body.invMass === 0) {
                continue;
            }
            body.velocity.add(Vec2.mulSV(delta, (Vec2.add(gravity, Vec2.mulSV(body.invMass, body.force)))));
            body.angularVelocity += delta * body.invI * body.torque;
        }
        //  Pre-steps
        const arbiters = this.arbiters;
        const joints = this.joints;
        for (let i = 0; i < arbiters.length; i++) {
            arbiters[i].second.preStep(inverseDelta);
        }
        for (let i = 0; i < joints.length; i++) {
            joints[i].preStep(inverseDelta);
        }
        //  Perform iterations
        for (let i = 0; i < this.iterations; i++) {
            //  Apply impulse
            for (let arb = 0; arb < arbiters.length; arb++) {
                arbiters[arb].second.applyImpulse();
            }
            //  Apply joint impulse
            for (let j = 0; j < joints.length; j++) {
                joints[j].applyImpulse();
            }
        }
        //  Integrate velocities
        for (let i = 0; i < bodies.length; i++) {
            let body = bodies[i];
            body.position.add(Vec2.mulSV(delta, body.velocity));
            body.rotation += delta * body.angularVelocity;
            body.force.set(0, 0);
            body.torque = 0;
        }
    }
}

window['vec2Total'] = 0;
window['mat22Total'] = 0;
let delta = 1 / 30;
let world = new World(new Vec2(0, 40), 10);
let floor = new Body(new Vec2(2000, 80), Number.MAX_VALUE);
floor.position.set(500, 500);
world.addBody(floor);
let box;
let boxPos = new Vec2(300, -150);
let boxesPerRow = 10;
let boxesPerCol = 10;
let boxOffset = 16;
for (let i = 0; i < boxesPerRow; i++) {
    for (let j = 0; j < boxesPerCol; j++) {
        box = new Body(new Vec2(12, 12), 5);
        box.position.set(boxPos.x + i * boxOffset, boxPos.y + j * boxOffset);
        box.velocity.y = -50 + j;
        world.addBody(box);
    }
}
let support = new Body(new Vec2(25, 25), Number.MAX_VALUE);
support.position.set(350 + 180, 50);
world.addBody(support);
let pendulum = new Body(new Vec2(50, 50), 900);
pendulum.position.set(505 + 180, 40);
world.addBody(pendulum);
let joint = new Joint();
joint.set(world, support, pendulum, support.position);
world.addJoint(joint);
let renderer = new CanvasRenderer(document.getElementById('demo'));
let pause = true;
let frame = 0;
let frameText = document.getElementById('frame');
let vec2Text = document.getElementById('vec2');
let mat22Text = document.getElementById('mat22');
let frame200Text = document.getElementById('frame200');
let frame600Text = document.getElementById('frame600');
document.getElementById('pause').addEventListener('click', () => {
    pause = (pause) ? false : true;
});
function loop() {
    window['vec2Total'] = 0;
    window['mat22Total'] = 0;
    if (!pause) {
        world.step(delta);
        renderer.render(world);
        frameText.value = frame.toString();
        vec2Text.value = window['vec2Total'].toString();
        mat22Text.value = window['mat22Total'].toString();
        if (frame === 200) {
            frame200Text.value = vec2Text.value + ' / ' + mat22Text.value;
        }
        else if (frame === 600) {
            frame600Text.value = vec2Text.value + ' / ' + mat22Text.value;
        }
        frame++;
    }
    requestAnimationFrame(loop);
}
loop();
