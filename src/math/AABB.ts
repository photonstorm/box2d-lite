import Body from '../Body';

export default class AABB
{
    body: Body;

    // center
    x: number = 0;
    y: number = 0;

    // top-left
    x1: number = 0;
    y1: number = 0;

    //  bottom-right
    x2: number = 0;
    y2: number = 0;

    //  width / height
    width: number = 0;
    height: number = 0;

    prevAngle: number;

    constructor (body: Body)
    {
        this.body = body;

        this.prevAngle = Number.MIN_VALUE;

        this.update();
    }

    update ()
    {
        const body = this.body;

        this.x = body.position.x;
        this.y = body.position.y;

        if (body.rotation === this.prevAngle)
        {
            this.x1 = this.x - (this.width * 0.5);
            this.x2 = this.x + (this.width * 0.5);
            this.y1 = this.y - (this.height * 0.5);
            this.y2 = this.y + (this.height * 0.5);
        }
        else
        {
            //  The top-right and bottom-right corners (unrotated)
            const c1x: number = body.width * 0.5;
            const c2x: number = body.width * 0.5;
            const c1y: number = -body.height * 0.5;
            const c2y: number = body.height * 0.5;

            const sin: number = Math.sin(body.rotation);
            const cos: number = Math.cos(body.rotation);

            //  Transformed corners
            const x1x: number = c1x * cos - c1y * sin;
            const x1y: number = c1x * sin + c1y * cos;
            const x2x: number = c2x * cos - c2y * sin;
            const x2y: number = c2x * sin + c2y * cos;

            //  Extents
            const ex: number = Math.max(Math.abs(x1x), Math.abs(x2x));
            const ey: number = Math.max(Math.abs(x1y), Math.abs(x2y));

            this.x1 = this.x - ex;
            this.x2 = this.x + ex;
            this.y1 = this.y - ey;
            this.y2 = this.y + ey;

            this.width = this.x2 - this.x1;
            this.height = this.y2 - this.y1;

            this.prevAngle = body.rotation;
        }
    }

    isPoint (): boolean
    {
        return (this.width === 0 && this.height === 0);
    }
    
    intersects (bounds: AABB): boolean
    {
        return !(
            bounds.x1 > this.x2 ||
            bounds.x2 < this.x1 ||
            bounds.y1 > this.y2 ||
            bounds.y2 < this.y1
        );
    }

    destroy ()
    {
        this.body = null;
    }
}