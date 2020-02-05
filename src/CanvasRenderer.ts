import Body from './Body';
import World from './World';
import Mat22 from './math/Mat22';
import Vec2 from './math/Vec2';

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

        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
        for (let i = 0; i < world.bodies.length; i++)
        {
            this.renderBody(world.bodies[i], context);
        }
        
        // let arbitersLen = this.arbiters.length ? this.arbiters.length : 0;
        // for (let i = 0; i < arbitersLen; ++i) {
        //   let arbiter = this.arbiters[i].second;
        //   let contactsLen = arbiter.contacts.length ? arbiter.contacts.length : 0;
        //   for (let j = 0; j < contactsLen; ++j) {
        //     let contact = arbiter.contacts[j];
        //     contact.render(ctx);
        //   }
        // }
        
        // let jointsLen = this.joints.length ? this.joints.length : 0;
        // for (let i = 0; i < jointsLen; ++i) {
        //   this.joints[i].render(ctx);
        // }
      
    }

    renderBody (body: Body, ctx: CanvasRenderingContext2D)
    {
        let R: Mat22 = new Mat22(body.rotation);
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
}