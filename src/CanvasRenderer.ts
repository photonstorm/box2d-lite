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

    showBodies: boolean = true;
    showBounds: boolean = true;
    showContacts: boolean = true;
    showJoints: boolean = true;

    zoom: number = 1;

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

    init (zoom: number)
    {
        const context = this.context;

        context.setTransform();
        context.translate(this.canvas.width / 2, this.canvas.height / 2);
        context.scale(zoom, zoom);

        this.zoom = zoom;
    }

    render (world: World, zoom: number = 1, panX: number = 0, panY: number = 0)
    {
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
  
        if (this.showBodies)
        {
            for (let i = 0; i < bodies.length; i++)
            {
                this.renderBody(bodies[i], context);
            }
        }
        
        if (this.showBounds)
        {
            for (let i = 0; i < bodies.length; i++)
            {
                this.renderBodyBounds(bodies[i], context);
            }
        }

        if (this.showContacts)
        {
            for (let i = 0; i < arbiters.length; i++)
            {
                // let arbiter = arbiters[i].second;
                let arbiter = arbiters[i];
    
                for (let c = 0; c < arbiter.contacts.length; c++)
                {
                    this.renderContact(arbiter.contacts[c], context);
                }
            }
        }

        if (this.showJoints)
        {
            for (let i = 0; i < joints.length; i++)
            {
                this.renderJoint(joints[i], context);
            }
        }
    }

    renderBodyBounds (body: Body, ctx: CanvasRenderingContext2D)
    {
        ctx.strokeStyle = 'grey';
        ctx.lineWidth = 0.5 / this.zoom;
        ctx.strokeRect(body.bounds.x1, body.bounds.y1, body.bounds.width, body.bounds.height);
    }

    renderBody (body: Body, ctx: CanvasRenderingContext2D)
    {
        this._M0.set(body.rotation);

        let position: Vec2 = body.position;

        let hX = 0.5 * body.width;
        let hY = 0.5 * body.height;

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

    renderContact (contact: Contact, ctx: CanvasRenderingContext2D)
    {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 0.5 / this.zoom;

        ctx.beginPath();
        ctx.arc(contact.positionX, contact.positionY, 2 / this.zoom, 0, 2 * Math.PI);
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
