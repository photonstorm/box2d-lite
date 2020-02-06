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

    constructor (canvas: HTMLCanvasElement)
    {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
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
        let R: Mat22 = new Mat22().set(body.rotation);
        let x: Vec2 = body.position;
        let h: Vec2 = Vec2.mulSV(0.5, body.width);
        
        // linear and rotational position of vertices
        let v1: Vec2 = Vec2.add(x, Mat22.mulMV(R, new Vec2(-h.x, -h.y)));
        let v2: Vec2 = Vec2.add(x, Mat22.mulMV(R, new Vec2( h.x, -h.y)));
        let v3: Vec2 = Vec2.add(x, Mat22.mulMV(R, new Vec2( h.x,  h.y)));
        let v4: Vec2 = Vec2.add(x, Mat22.mulMV(R, new Vec2(-h.x,  h.y)));

        // orientation line
        let o: Vec2 = Vec2.add(x, Mat22.mulMV(R, new Vec2(h.x,  0)));
        
        // draw centroid of rectangle
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(body.position.x, body.position.y, 2, 0, 2 * Math.PI);
        ctx.stroke();

        // draw shape
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.lineTo(v3.x, v3.y);
        ctx.lineTo(v4.x, v4.y);
        ctx.lineTo(v1.x, v1.y);
        ctx.stroke();

        // draw orientation line
        ctx.beginPath();
        ctx.moveTo(x.x, x.y);
        ctx.lineTo(o.x, o.y);
        ctx.stroke();
    }

    renderContact (contact: Contact, ctx: CanvasRenderingContext2D)
    {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.arc(contact.position.x, contact.position.y, 2, 0, 2 * Math.PI);
        ctx.stroke();
    }

    renderJoint (joint: Joint, ctx: CanvasRenderingContext2D)
    {
        let b1 = joint.body1;
        let b2 = joint.body2;
      
        let R1 = new Mat22().set(b1.rotation);
        let R2 = new Mat22().set(b2.rotation);
        
        let x1 = b1.position;
        let p1 = Vec2.add(x1, Mat22.mulMV(R1, joint.localAnchor1));
      
        let x2 = b2.position;
        let p2 = Vec2.add(x2, Mat22.mulMV(R2, joint.localAnchor2));
        
        ctx.beginPath();
        ctx.moveTo(x1.x, x1.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(x2.x, x2.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }
}