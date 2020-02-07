import AABB from './math/AABB';

export default class Quad
{
    maxObjects: number = 10;
    maxLevels: number = 4;
    level: number;

    objects: Array<AABB> = [];
    nodes: Array<Quad> = [];

    total: number = 0;

    //  center
    x: number;
    y: number;

    width: number;
    height: number;

    constructor (x: number = 0, y: number = 0, width: number = 512, height: number = 512, maxObjects: number = 10, maxLevels: number = 4, level: number = 0)
    {
        this.x = x + (width * 0.5);
        this.y = y + (height * 0.5);
        this.width = width;
        this.height = height;

        this.maxObjects = maxObjects;
        this.maxLevels = maxLevels;
        this.level = level;
    }

    totalNodes (): number
    {
        let total: number = 0;

        for (const node of this.nodes)
        {
            total++;
            total += node.totalNodes();
        }

        return total;
    }

    add (bounds: AABB)
    {
        const objects = this.objects;
        const nodes = this.nodes;

        this.total++;

        let i: number = 0;
        let index: number = 0;

        if (nodes[0])
        {
            index = this.getIndex(bounds);

            if (index !== -1)
            {
                nodes[index].add(bounds);
                return;
            }
        }

        objects.push(bounds);

        if (objects.length > this.maxObjects && this.level < this.maxLevels)
        {
            if (!nodes[0])
            {
                this.split();
            }

            while (i < objects.length)
            {
                index = this.getIndex(objects[i]);

                if (index !== -1)
                {
                    nodes[index].add(objects.splice(i, 1)[0]);
                }
                else
                {
                    i++;
                }
            }
        }
    }

    get (bounds: AABB | Quad, del: boolean = false): (Array<AABB> | any)
    {
        let quad: Quad = this;

        const index: number = this.getIndex(bounds);

        let returnObjects: Array<AABB> = this.objects;

        if (this.nodes[0])
        {
            if (index !== -1)
            {
                returnObjects = returnObjects.concat(this.nodes[index].get(bounds, del));

                quad = this.nodes[index];
            }
            else
            {
                for (const node of this.nodes)
                {
                    returnObjects = returnObjects.concat(node.get(bounds, del));

                    quad = node;
                }
            }
        }

        return (del) ? { quad: quad, objects: returnObjects } : returnObjects;
    }

    getPoints (bounds: AABB, del: boolean = false): Array<AABB>
    {
        let points: Array<AABB> = [];
        let search: (Array<AABB> | any) = this.get(bounds, del);

        if (del)
        {
            search = search.objects;
        }

        for (const point of search)
        {
            const sameCoords: boolean = (point.x === bounds.x && point.y === bounds.y);

            if (sameCoords && point.isPoint())
            {
                points.push(point);
            }

            if (del)
            {
                this.cleanup(search.quad, point);
            }
        }

        return points;
    }

    getIntersections (bounds: AABB, del: boolean = false): Array<AABB>
    {
        const intersections: Array<AABB> = [];

        const results: (Array<AABB> | any) = this.get(bounds, del);

        const objects = (del) ? results.objects : results;

        for (const intersection of objects)
        {
            if (intersection.intersects(bounds))
            {
                intersections.push(intersection);

                if (del)
                {
                    this.cleanup(results.quad, intersection);
                }
            }
        }

        return intersections;
    }

    clear ()
    {
        this.objects = [];
        this.total = 0;

        for (const node of this.nodes)
        {
            node.clear();
        }

        this.nodes = [];
    }

    private cleanup (quad: Quad, bounds: AABB)
    {
        quad.objects = quad.objects.filter((o) => o != bounds);
    }

    private getIndex (bounds: any): number
    {
        let index: number = -1;

        const vMid: number = this.x + (this.width / 2);
        const hMid: number = this.y + (this.height / 2);

        const topQ: boolean = (bounds.y < hMid && bounds.y + bounds.height < hMid);
        const botQ: boolean = (bounds.y > hMid);

        if (bounds.x < vMid && bounds.x + bounds.width < vMid)
        {
            if (topQ)
            {
                index = 1;
            }
            else if (botQ)
            {
                index = 2;
            }
        }
        else if (bounds.x > vMid)
        {
            if (topQ)
            {
                index = 0;
            }
            else if (botQ)
            {
                index = 3;
            }
        }

        return index;
    }

    private split ()
    {
        const nextLevel: number = this.level + 1;

        const subW: number = Math.round(this.width / 2);
        const subH: number = Math.round(this.height / 2);

        const x: number = Math.round(this.x);
        const y: number = Math.round(this.y);

        const nodes = this.nodes;
        const maxObjects = this.maxObjects;
        const maxLevels = this.maxLevels;

        nodes[0] = new Quad(x + subW, y, subW, subH, maxObjects, maxLevels, nextLevel);
        nodes[1] = new Quad(x, y, subW, subH, maxObjects, maxLevels, nextLevel);
        nodes[2] = new Quad(x, y + subH, subW, subH, maxObjects, maxLevels, nextLevel);
        nodes[3] = new Quad(x + subW, y + subH, subW, subH, maxObjects, maxLevels, nextLevel);
    }
}
