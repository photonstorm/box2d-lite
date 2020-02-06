import Body from './Body';
import World from './World';
import Mat22 from './math/Mat22';
import Vec2 from './math/Vec2';
import Joint from './Joint';
import Contact from './Contact';

export default class CanvasRenderer
{
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    private _M0: Mat22;
    private _M1: Mat22;

    private _v1: Vec2;
    private _v2: Vec2;
    private _v3: Vec2;
    private _v4: Vec2;
    private _orientation: Vec2;

    constructor (canvas: HTMLCanvasElement)
    {
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

    render (world: World)
    {
        const context = this.context;
        const bodies = world.bodies;
        const joints = world.joints;
        const arbiters = world.arbiters;

        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
        for (let i = 0; i < bodies.length; i++)
        {
            this.renderBody(bodies[i], context);
        }
        
        for (let i = 0; i < arbiters.length; i++)
        {
            let arbiter = arbiters[i].second;

            for (let c = 0; c < arbiter.contacts.length; c++)
            {
                this.renderContact(arbiter.contacts[c], context);
            }
        }

        for (let i = 0; i < joints.length; i++)
        {
            this.renderJoint(joints[i], context);
        }
    }

    renderBody (body: Body, ctx: CanvasRenderingContext2D)
    {
        this._M0.set(body.rotation);

        let position: Vec2 = body.position;

        let hX = 0.5 * body.width.x;
        let hY = 0.5 * body.width.y;

        const v1 = this._v1;
        const v2 = this._v2;
        const v3 = this._v3;
        const v4 = this._v4;

        v1.set(
            position.x + (this._M0.a * -hX + this._M0.b * -hY),
            position.y + (this._M0.c * -hX + this._M0.d * -hY)
        );

        v2.set(
            position.x + (this._M0.a * hX + this._M0.b * -hY),
            position.y + (this._M0.c * hX + this._M0.d * -hY)
        );

        v3.set(
            position.x + (this._M0.a * hX + this._M0.b * hY),
            position.y + (this._M0.c * hX + this._M0.d * hY)
        );

        v4.set(
            position.x + (this._M0.a * -hX + this._M0.b * hY),
            position.y + (this._M0.c * -hX + this._M0.d * hY)
        );

        const orientation = this._orientation;

        orientation.set(
            position.x + (this._M0.a * hX),
            position.y + (this._M0.c * hX)
        );
        
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

    renderContact (contact: Contact, ctx: CanvasRenderingContext2D)
    {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.arc(contact.positionX, contact.positionY, 2, 0, 2 * Math.PI);
        ctx.stroke();
    }

    renderJoint (joint: Joint, ctx: CanvasRenderingContext2D)
    {
        let b1 = joint.body1;
        let b2 = joint.body2;
      
        this._M0.set(b1.rotation);
        this._M1.set(b2.rotation);
        
        let position1 = b1.position;
        let position2 = b2.position;

        const p1 = this._v1;
        const p2 = this._v2;

        p1.set(
            position1.x + (this._M0.a * joint.localAnchor1.x + this._M0.b * joint.localAnchor1.y),
            position1.y + (this._M0.c * joint.localAnchor1.x + this._M0.d * joint.localAnchor1.y)
        );

        p2.set(
            position2.x + (this._M1.a * joint.localAnchor2.x + this._M1.b * joint.localAnchor2.y),
            position2.y + (this._M1.c * joint.localAnchor2.x + this._M1.d * joint.localAnchor2.y)
        );
        
        ctx.beginPath();
        ctx.moveTo(position1.x, position1.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(position2.x, position2.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }
}
