function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class Vec2 {
  constructor() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _defineProperty(this, "x", 0);

    _defineProperty(this, "y", 0);

    this.x = x;
    this.y = y;
  }

  set() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    this.x = x;
    this.y = y;
    return this;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  mul(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
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

class Body {
  constructor(width, mass) {
    _defineProperty(this, "position", new Vec2());

    _defineProperty(this, "rotation", 0);

    _defineProperty(this, "velocity", new Vec2());

    _defineProperty(this, "angularVelocity", 0);

    _defineProperty(this, "force", new Vec2());

    _defineProperty(this, "torque", 0);

    _defineProperty(this, "width", new Vec2());

    _defineProperty(this, "friction", 0.2);

    _defineProperty(this, "mass", Number.MAX_VALUE);

    _defineProperty(this, "invMass", 0);

    _defineProperty(this, "I", Number.MAX_VALUE);

    _defineProperty(this, "invI", 0);

    _defineProperty(this, "id", 0);

    this.set(width, mass);
  }

  set(width, mass) {
    this.width.x = width.x;
    this.width.y = width.y;
    this.mass = mass;

    if (mass < Number.MAX_VALUE) {
      this.invMass = 1 / mass;
      this.I = mass * (width.x * width.x + width.y * width.y) / 12;
      this.invI = 1 / this.I;
    } else {
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

function Clamp(a, low, high) {
  return Math.max(low, Math.min(a, high));
}

var Axis;

(function (Axis) {
  Axis[Axis["FACE_A_X"] = 0] = "FACE_A_X";
  Axis[Axis["FACE_A_Y"] = 1] = "FACE_A_Y";
  Axis[Axis["FACE_B_X"] = 2] = "FACE_B_X";
  Axis[Axis["FACE_B_Y"] = 3] = "FACE_B_Y";
})(Axis || (Axis = {}));

var EdgeNumbers;

(function (EdgeNumbers) {
  EdgeNumbers[EdgeNumbers["NO_EDGE"] = 0] = "NO_EDGE";
  EdgeNumbers[EdgeNumbers["EDGE1"] = 1] = "EDGE1";
  EdgeNumbers[EdgeNumbers["EDGE2"] = 2] = "EDGE2";
  EdgeNumbers[EdgeNumbers["EDGE3"] = 3] = "EDGE3";
  EdgeNumbers[EdgeNumbers["EDGE4"] = 4] = "EDGE4";
})(EdgeNumbers || (EdgeNumbers = {}));

class Edges {
  constructor() {
    _defineProperty(this, "inEdge1", EdgeNumbers.NO_EDGE);

    _defineProperty(this, "outEdge1", EdgeNumbers.NO_EDGE);

    _defineProperty(this, "inEdge2", EdgeNumbers.NO_EDGE);

    _defineProperty(this, "outEdge2", EdgeNumbers.NO_EDGE);
  }

}

class FeaturePair {
  constructor() {
    _defineProperty(this, "e", new Edges());

    _defineProperty(this, "value", 0);
  }

  flip() {
    var edges = this.e;
    var tempIn = edges.inEdge1;
    var tempOut = edges.outEdge1;
    edges.inEdge1 = edges.inEdge2;
    edges.inEdge2 = tempIn;
    edges.outEdge1 = edges.outEdge2;
    edges.outEdge2 = tempOut;
  }

}

class ClipVertex {
  constructor() {
    _defineProperty(this, "v", new Vec2());

    _defineProperty(this, "fp", new FeaturePair());
  }

}

class Mat22 {
  constructor(aOvA, vB) {
    _defineProperty(this, "col1", new Vec2());

    _defineProperty(this, "col2", new Vec2());

    if (typeof aOvA === 'number' && vB === undefined) {
      var c = Math.cos(aOvA);
      var s = Math.sin(aOvA);
      this.col1.set(c, s);
      this.col2.set(-s, c);
    } else if (typeof aOvA === 'object' && typeof vB === 'object') {
      this.col1 = aOvA;
      this.col2 = vB;
    }
  }

  static add(mA, mB) {
    return new Mat22(Vec2.add(mA.col1, mB.col1), Vec2.add(mA.col2, mB.col2));
  }

  static mulMV(m, v) {
    return new Vec2(m.col1.x * v.x + m.col2.x * v.y, m.col1.y * v.x + m.col2.y * v.y);
  }

  static mulMM(mA, mB) {
    return new Mat22(Mat22.mulMV(mA, mB.col1), Mat22.mulMV(mA, mB.col2));
  }

  static abs(m) {
    return new Mat22(Vec2.abs(m.col1), Vec2.abs(m.col2));
  }

  static transpose(m) {
    return new Mat22(new Vec2(m.col1.x, m.col2.x), new Vec2(m.col1.y, m.col2.y));
  }

  static invert(m) {
    var a = m.col1.x;
    var b = m.col2.x;
    var c = m.col1.y;
    var d = m.col2.y;
    var adjugate = new Mat22();
    var det = a * d - b * c;
    det = 1 / det;
    adjugate.col1.x = det * d;
    adjugate.col2.x = det * -b;
    adjugate.col1.y = det * -c;
    adjugate.col2.y = det * a;
    return adjugate;
  }

}

function ComputeIncidentEdge(c, h, pos, Rot, normal) {
  var RotT = Mat22.transpose(Rot);
  var n = Vec2.neg(Mat22.mulMV(RotT, normal));
  var nAbs = Vec2.abs(n);
  var clipVertex0 = new ClipVertex();
  var clipVertex1 = new ClipVertex();

  if (nAbs.x > nAbs.y) {
    if (Math.sign(n.x) > 0) {
      clipVertex0.v.set(h.x, -h.y);
      clipVertex0.fp.e.inEdge2 = EdgeNumbers.EDGE3;
      clipVertex0.fp.e.outEdge2 = EdgeNumbers.EDGE4;
      clipVertex1.v.set(h.x, h.y);
      clipVertex1.fp.e.inEdge2 = EdgeNumbers.EDGE4;
      clipVertex1.fp.e.outEdge2 = EdgeNumbers.EDGE1;
    } else {
      clipVertex0.v.set(-h.x, h.y);
      clipVertex0.fp.e.inEdge2 = EdgeNumbers.EDGE1;
      clipVertex0.fp.e.outEdge2 = EdgeNumbers.EDGE2;
      clipVertex1.v.set(-h.x, -h.y);
      clipVertex1.fp.e.inEdge2 = EdgeNumbers.EDGE2;
      clipVertex1.fp.e.outEdge2 = EdgeNumbers.EDGE3;
    }
  } else {
    if (Math.sign(n.y) > 0) {
      clipVertex0.v.set(h.x, h.y);
      clipVertex0.fp.e.inEdge2 = EdgeNumbers.EDGE4;
      clipVertex0.fp.e.outEdge2 = EdgeNumbers.EDGE1;
      clipVertex1.v.set(-h.x, h.y);
      clipVertex1.fp.e.inEdge2 = EdgeNumbers.EDGE1;
      clipVertex1.fp.e.outEdge2 = EdgeNumbers.EDGE2;
    } else {
      clipVertex0.v.set(-h.x, -h.y);
      clipVertex0.fp.e.inEdge2 = EdgeNumbers.EDGE2;
      clipVertex0.fp.e.outEdge2 = EdgeNumbers.EDGE3;
      clipVertex1.v.set(h.x, -h.y);
      clipVertex1.fp.e.inEdge2 = EdgeNumbers.EDGE3;
      clipVertex1.fp.e.outEdge2 = EdgeNumbers.EDGE4;
    }
  }

  clipVertex0.v = Vec2.add(pos, Mat22.mulMV(Rot, clipVertex0.v));
  clipVertex1.v = Vec2.add(pos, Mat22.mulMV(Rot, clipVertex1.v));
  c[0] = clipVertex0;
  c[1] = clipVertex1;
}

class Contact {
  constructor() {
    _defineProperty(this, "position", new Vec2());

    _defineProperty(this, "normal", new Vec2());

    _defineProperty(this, "r1", new Vec2());

    _defineProperty(this, "r2", new Vec2());

    _defineProperty(this, "separation", 0);

    _defineProperty(this, "Pn", 0);

    _defineProperty(this, "Pt", 0);

    _defineProperty(this, "Pnb", 0);

    _defineProperty(this, "massNormal", 0);

    _defineProperty(this, "massTangent", 0);

    _defineProperty(this, "bias", 0);

    _defineProperty(this, "feature", new FeaturePair());
  }

}

function ClipSegmentToLine(vOut, vIn, normal, offset, clipEdge) {
  var numOut = 0;
  var distance0 = Vec2.dot(normal, vIn[0].v) - offset;
  var distance1 = Vec2.dot(normal, vIn[1].v) - offset;

  if (distance0 <= 0) {
    vOut[numOut] = vIn[0];
    numOut++;
  }

  if (distance1 <= 0) {
    vOut[numOut] = vIn[1];
    numOut++;
  }

  if (distance0 * distance1 < 0) {
    var interp = distance0 / (distance0 - distance1);
    vOut[numOut] = new ClipVertex();
    vOut[numOut].v = Vec2.add(vIn[0].v, Vec2.mulSV(interp, Vec2.sub(vIn[1].v, vIn[0].v)));

    if (distance0 > 0) {
      vOut[numOut].fp = vIn[0].fp;
      vOut[numOut].fp.e.inEdge1 = clipEdge;
      vOut[numOut].fp.e.inEdge2 = EdgeNumbers.NO_EDGE;
    } else {
      vOut[numOut].fp = vIn[1].fp;
      vOut[numOut].fp.e.outEdge1 = clipEdge;
      vOut[numOut].fp.e.outEdge2 = EdgeNumbers.NO_EDGE;
    }

    numOut++;
  }

  return numOut;
}

function Collide(contacts, bodyA, bodyB) {
  var hA = Vec2.mulSV(0.5, bodyA.width);
  var hB = Vec2.mulSV(0.5, bodyB.width);
  var posA = bodyA.position;
  var posB = bodyB.position;
  var RotA = new Mat22(bodyA.rotation);
  var RotB = new Mat22(bodyB.rotation);
  var RotAT = Mat22.transpose(RotA);
  var RotBT = Mat22.transpose(RotB);
  var dp = Vec2.sub(posB, posA);
  var dA = Mat22.mulMV(RotAT, dp);
  var dB = Mat22.mulMV(RotBT, dp);
  var C = Mat22.mulMM(RotAT, RotB);
  var absC = Mat22.abs(C);
  var absCT = Mat22.transpose(absC);
  var faceA = Vec2.sub(Vec2.sub(Vec2.abs(dA), hA), Mat22.mulMV(absC, hB));

  if (faceA.x > 0 || faceA.y > 0) {
    return 0;
  }

  var faceB = Vec2.sub(Vec2.sub(Vec2.abs(dB), Mat22.mulMV(absCT, hA)), hB);

  if (faceB.x > 0 || faceB.y > 0) {
    return 0;
  }

  var axis;
  var separation;
  var normal;
  axis = Axis.FACE_A_X;
  separation = faceA.x;
  normal = dA.x > 0 ? RotA.col1 : Vec2.neg(RotA.col1);
  var RELATIVE_TOL = 0.95;
  var ABSOLUTE_TOL = 0.01;

  if (faceA.y > RELATIVE_TOL * separation + ABSOLUTE_TOL * hA.y) {
    axis = Axis.FACE_A_Y;
    separation = faceA.y;
    normal = dA.y > 0 ? RotA.col2 : Vec2.neg(RotA.col2);
  }

  if (faceB.x > RELATIVE_TOL * separation + ABSOLUTE_TOL * hB.x) {
    axis = Axis.FACE_B_X;
    separation = faceB.x;
    normal = dB.x > 0 ? RotB.col1 : Vec2.neg(RotB.col1);
  }

  if (faceB.y > RELATIVE_TOL * separation + ABSOLUTE_TOL * hB.y) {
    axis = Axis.FACE_B_Y;
    separation = faceB.y;
    normal = dB.y > 0 ? RotB.col2 : Vec2.neg(RotB.col2);
  }

  var frontNormal;
  var sideNormal;
  var incidentEdge = [];
  var front;
  var negSide;
  var posSide;
  var negEdge;
  var posEdge;
  var side;

  switch (axis) {
    case Axis.FACE_A_X:
      frontNormal = normal;
      front = Vec2.dot(posA, frontNormal) + hA.x;
      sideNormal = RotA.col2;
      side = Vec2.dot(posA, sideNormal);
      negSide = -side + hA.y;
      posSide = side + hA.y;
      negEdge = EdgeNumbers.EDGE3;
      posEdge = EdgeNumbers.EDGE1;
      ComputeIncidentEdge(incidentEdge, hB, posB, RotB, frontNormal);
      break;

    case Axis.FACE_A_Y:
      frontNormal = normal;
      front = Vec2.dot(posA, frontNormal) + hA.y;
      sideNormal = RotA.col1;
      side = Vec2.dot(posA, sideNormal);
      negSide = -side + hA.x;
      posSide = side + hA.x;
      negEdge = EdgeNumbers.EDGE2;
      posEdge = EdgeNumbers.EDGE4;
      ComputeIncidentEdge(incidentEdge, hB, posB, RotB, frontNormal);
      break;

    case Axis.FACE_B_X:
      frontNormal = Vec2.neg(normal);
      front = Vec2.dot(posB, frontNormal) + hB.x;
      sideNormal = RotB.col2;
      side = Vec2.dot(posB, sideNormal);
      negSide = -side + hB.y;
      posSide = side + hB.y;
      negEdge = EdgeNumbers.EDGE3;
      posEdge = EdgeNumbers.EDGE1;
      ComputeIncidentEdge(incidentEdge, hA, posA, RotA, frontNormal);
      break;

    case Axis.FACE_B_Y:
      frontNormal = Vec2.neg(normal);
      front = Vec2.dot(posB, frontNormal) + hB.y;
      sideNormal = RotB.col1;
      side = Vec2.dot(posB, sideNormal);
      negSide = -side + hB.x;
      posSide = side + hB.x;
      negEdge = EdgeNumbers.EDGE2;
      posEdge = EdgeNumbers.EDGE4;
      ComputeIncidentEdge(incidentEdge, hA, posA, RotA, frontNormal);
      break;
  }

  var clipPoints1 = [];
  var clipPoints2 = [];
  var np = ClipSegmentToLine(clipPoints1, incidentEdge, Vec2.neg(sideNormal), negSide, negEdge);

  if (np < 2) {
    return 0;
  }

  np = ClipSegmentToLine(clipPoints2, clipPoints1, sideNormal, posSide, posEdge);

  if (np < 2) {
    return 0;
  }

  var numContacts = 0;

  for (var i = 0; i < 2; i++) {
    var _separation = Vec2.dot(frontNormal, clipPoints2[i].v) - front;

    if (_separation <= 0) {
      contacts[numContacts] = new Contact();
      contacts[numContacts].separation = _separation;
      contacts[numContacts].normal = normal;
      contacts[numContacts].position = Vec2.sub(clipPoints2[i].v, Vec2.mulSV(_separation, frontNormal));
      contacts[numContacts].feature = clipPoints2[i].fp;

      if (axis === Axis.FACE_B_X || axis === Axis.FACE_B_Y) {
        contacts[numContacts].feature.flip();
      }

      numContacts++;
    }
  }

  return numContacts;
}

class Arbiter {
  constructor(world, body1, body2) {
    _defineProperty(this, "world", void 0);

    _defineProperty(this, "body1", void 0);

    _defineProperty(this, "body2", void 0);

    _defineProperty(this, "contacts", void 0);

    _defineProperty(this, "numContacts", void 0);

    _defineProperty(this, "friction", void 0);

    this.world = world;

    if (body1.id < body2.id) {
      this.body1 = body1;
      this.body2 = body2;
    } else {
      this.body1 = body2;
      this.body2 = body1;
    }

    this.contacts = [];
    this.numContacts = Collide(this.contacts, this.body1, this.body2);
    this.friction = Math.sqrt(this.body1.friction * this.body2.friction);
  }

  update(newContacts, numNewContacts) {
    var mergedContacts = [];
    var contacts = this.contacts;
    var numContacts = this.numContacts;
    var warmStarting = this.world.warmStarting;

    for (var i = 0; i < numNewContacts; i++) {
      var cNew = newContacts[i];
      var k = -1;

      for (var j = 0; j < numContacts; j++) {
        var cOld = contacts[j];

        if (cNew.feature.value === cOld.feature.value) {
          k = j;
          break;
        }
      }

      if (k > -1) {
        var _cOld = contacts[k];

        if (warmStarting) {
          cNew.Pn = _cOld.Pn;
          cNew.Pt = _cOld.Pt;
          cNew.Pnb = _cOld.Pnb;
        } else {
          cNew.Pn = 0;
          cNew.Pt = 0;
          cNew.Pnb = 0;
        }

        mergedContacts[i] = cNew;
      } else {
        mergedContacts[i] = newContacts[i];
      }
    }

    this.contacts = mergedContacts;
    this.numContacts = numNewContacts;
  }

  preStep(inverseDelta) {
    var allowedPenetration = 0.01;
    var contacts = this.contacts;
    var numContacts = this.numContacts;
    var biasFactor = this.world.positionCorrection ? 0.2 : 0;
    var body1 = this.body1;
    var body2 = this.body2;
    var accumulateImpulses = this.world.accumulateImpulses;

    for (var i = 0; i < numContacts; i++) {
      var c = contacts[i];
      var r1 = Vec2.sub(c.position, body1.position);
      var r2 = Vec2.sub(c.position, body2.position);
      var rn1 = Vec2.dot(r1, c.normal);
      var rn2 = Vec2.dot(r2, c.normal);
      var normal = body1.invMass + body2.invMass;
      normal += body1.invI * (Vec2.dot(r1, r2) - rn1 * rn1) + body2.invI * (Vec2.dot(r2, r2) - rn2 * rn2);
      c.massNormal = 1 / normal;
      var tangent = Vec2.crossVS(c.normal, 1);
      var rt1 = Vec2.dot(r1, tangent);
      var rt2 = Vec2.dot(r2, tangent);
      var kTangent = body1.invMass + body2.invMass;
      kTangent += body1.invI * (Vec2.dot(r1, r1) - rt1 * rt1) + body2.invI * (Vec2.dot(r2, r2) - rt2 * rt2);
      c.massTangent = 1 / kTangent;
      c.bias = -biasFactor * inverseDelta * Math.min(0, c.separation + allowedPenetration);

      if (accumulateImpulses) {
        var P = Vec2.add(Vec2.mulSV(c.Pn, c.normal), Vec2.mulSV(c.Pt, tangent));
        body1.velocity.sub(Vec2.mulSV(body1.invMass, P));
        body1.angularVelocity -= body1.invI * Vec2.crossVV(r1, P);
        body2.velocity.sub(Vec2.mulSV(body2.invMass, P));
        body2.angularVelocity -= body2.invI * Vec2.crossVV(r2, P);
      }
    }
  }

  applyImpulse() {
    var contacts = this.contacts;
    var numContacts = this.numContacts;
    var body1 = this.body1;
    var body2 = this.body2;
    var accumulateImpulses = this.world.accumulateImpulses;

    for (var i = 0; i < numContacts; i++) {
      var c = contacts[i];
      c.r1 = Vec2.sub(c.position, body1.position);
      c.r2 = Vec2.sub(c.position, body2.position);
      var dv = Vec2.sub(Vec2.sub(Vec2.add(body2.velocity, Vec2.crossSV(body2.angularVelocity, c.r2)), body1.velocity), Vec2.crossSV(body1.angularVelocity, c.r1));
      var vn = Vec2.dot(dv, c.normal);
      var dPn = c.massTangent * (-vn + c.bias);

      if (accumulateImpulses) {
        var Pn0 = c.Pn;
        c.Pn = Math.max(Pn0 + dPn, 0);
        dPn = c.Pn - Pn0;
      } else {
        dPn = Math.max(dPn, 0);
      }

      var Pn = Vec2.mulSV(dPn, c.normal);
      body1.velocity.sub(Vec2.mulSV(body1.invMass, Pn));
      body1.angularVelocity -= body1.invI * Vec2.crossVV(c.r1, Pn);
      body2.velocity.add(Vec2.mulSV(body2.invMass, Pn));
      body2.angularVelocity += body2.invI * Vec2.crossVV(c.r2, Pn);
      dv = Vec2.sub(Vec2.sub(Vec2.add(body2.velocity, Vec2.crossSV(body2.angularVelocity, c.r2)), body1.velocity), Vec2.crossSV(body1.angularVelocity, c.r1));
      var tangent = Vec2.crossVS(c.normal, 1);
      var vt = Vec2.dot(dv, tangent);
      var dPt = c.massTangent * -vt;

      if (accumulateImpulses) {
        var maxPt = this.friction * c.Pn;
        var oldTangentImpulse = c.Pt;
        c.Pt = Clamp(oldTangentImpulse + dPt, -maxPt, maxPt);
        dPt = c.Pt - oldTangentImpulse;
      } else {
        var _maxPt = this.friction * dPn;

        dPt = Clamp(dPt, -_maxPt, _maxPt);
      }

      var Pt = Vec2.mulSV(dPt, tangent);
      body1.velocity.sub(Vec2.mulSV(body1.invMass, Pt));
      body1.angularVelocity -= body1.invI * Vec2.crossVV(c.r1, Pt);
      body2.velocity.add(Vec2.mulSV(body2.invMass, Pt));
      body2.angularVelocity += body2.invI * Vec2.crossVV(c.r2, Pt);
    }
  }

}

class ArbiterKey {
  constructor(bodyA, bodyB) {
    _defineProperty(this, "bodyA", void 0);

    _defineProperty(this, "bodyB", void 0);

    _defineProperty(this, "value", void 0);

    this.bodyA = bodyA;
    this.bodyB = bodyB;
    this.value = bodyA.id + ':' + bodyB.id;
  }

}

class ArbiterPair {
  constructor(key, arbiter) {
    _defineProperty(this, "first", void 0);

    _defineProperty(this, "second", void 0);

    this.first = key;
    this.second = arbiter;
  }

}

class World {
  constructor() {
    var gravity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vec2(0, 9.807);
    var iterations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

    _defineProperty(this, "bodyIdSeed", 0);

    _defineProperty(this, "bodies", []);

    _defineProperty(this, "joints", []);

    _defineProperty(this, "arbiters", []);

    _defineProperty(this, "gravity", new Vec2());

    _defineProperty(this, "iterations", 10);

    _defineProperty(this, "accumulateImpulses", true);

    _defineProperty(this, "warmStarting", true);

    _defineProperty(this, "positionCorrection", true);

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

  addJoint() {
    return this;
  }

  clear() {
    this.bodies = [];
    this.joints = [];
    this.arbiters = [];
    return this;
  }

  broadPhase() {
    var bodies = this.bodies;
    var length = bodies.length;
    var arbiters = this.arbiters;

    for (var i = 0; i < length; i++) {
      var bodyA = bodies[i];

      for (var j = i + 1; j < length; j++) {
        var bodyB = bodies[j];

        if (bodyA.invMass === 0 && bodyB.invI === 0) {
          continue;
        }

        var arbiter = new Arbiter(this, bodyA, bodyB);
        var arbiterKey = new ArbiterKey(bodyA, bodyB);
        var iter = -1;

        for (var a = 0; a < arbiters.length; a++) {
          if (arbiters[a].first.value === arbiterKey.value) {
            iter = a;
            break;
          }
        }

        if (arbiter.numContacts > 0) {
          if (iter === -1) {
            arbiters.push(new ArbiterPair(arbiterKey, arbiter));
          } else {
            arbiters[iter].second.update(arbiter.contacts, arbiter.numContacts);
          }
        } else if (arbiter.numContacts === 0 && iter > -1) {
          arbiters.splice(iter, 1);
        }
      }
    }
  }

  step(delta) {
    var inverseDelta = delta > 0 ? 1 / delta : 0;
    this.broadPhase();
    var bodies = this.bodies;
    var gravity = this.gravity;

    for (var i = 0; i < bodies.length; i++) {
      var body = bodies[i];

      if (body.invMass === 0) {
        continue;
      }

      body.velocity.add(Vec2.mulSV(delta, Vec2.add(gravity, Vec2.mulSV(body.invMass, body.force))));
      body.angularVelocity += delta * body.invI * body.torque;
    }

    var arbiters = this.arbiters;
    var joints = this.joints;

    for (var _i = 0; _i < arbiters.length; _i++) {
      arbiters[_i].second.preStep(inverseDelta);
    }

    for (var _i2 = 0; _i2 < joints.length; _i2++) {
      joints[_i2].preStep(inverseDelta);
    }

    for (var _i3 = 0; _i3 < this.iterations; _i3++) {
      for (var arb = 0; arb < arbiters.length; arb++) {
        arbiters[arb].second.applyImpulse();
      }

      for (var j = 0; j < joints.length; j++) {
        joints[j].applyImpulse();
      }
    }

    for (var _i4 = 0; _i4 < bodies.length; _i4++) {
      var _body = bodies[_i4];

      _body.position.add(Vec2.mulSV(delta, _body.velocity));

      _body.rotation += delta * _body.angularVelocity;

      _body.force.set(0, 0);

      _body.torque = 0;
    }
  }

}

export { Body, Vec2, World };
