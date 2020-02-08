import Body from '../src/Body';
import CanvasRenderer from '../src/CanvasRenderer';
import Joint from '../src/Joint';
import World from '../src/World';
import Vec2 from '../src/math/Vec2';
import Quad from '../src/Quad';

let delta = 1 / 30;
let world = new World(800 * 1, 600, new Vec2(0, 40));

//  helps reduce stack jiggle
// world.positionCorrection = 0.1;
// world.allowedPenetration = 0;
// world.warmStarting = false;
// world.accumulateImpulses = false;
// world.iterations = 20;

let floor = new Body(world.width, 64, Number.MAX_VALUE);

floor.position.set(world.width / 2, world.height + 32);
floor.friction = 0;

world.addBody(floor);

let leftWall = new Body(64, 1200, Number.MAX_VALUE);

leftWall.position.set(-32, 600);
leftWall.friction = 0;

world.addBody(leftWall);

let rightWall = new Body(64, 1200, Number.MAX_VALUE);

rightWall.position.set(world.width + 32, 600);
rightWall.friction = 0;

world.addBody(rightWall);

//  Mass box test

/*
let quad = new Quad(0, 0, 2048, 2048);

window['quad'] = function ()
{
    quad.clear();

    //  Seed the quadtree

    for (let i: number = 0; i < world.bodies.length; i++)
    {
        quad.add(world.bodies[i].bounds);
    }

    for (let i: number = 0; i < world.bodies.length; i++)
    {
        let bodyA: Body = world.bodies[i];

        let results = quad.getIntersections(bodyA.bounds);

        console.log(bodyA.id, '=', results.length);

        // for (let j: number = 0; j < results.length; j++)
        // {
        //     let bodyB: Body = results[j].body;

        //     if (bodyA.id === bodyB.id || (bodyA.invMass === 0 && bodyB.invMass === 0))
        //     {
        //         continue;
        //     }
        // }
    }
}
*/

for (let i = 0; i < 200; i++)
{
    let box = new Body(8 + Math.random() * 32, 8 + Math.random() * 32, 1);

    box.rotation = Math.random() * Math.PI;

    box.position.set(100 + (Math.random() * (world.width - 200)), -1600 + Math.random() * 1600);

    // box.position.set(400 - Math.random() * 100, 520 - (i * 40));

    // box.friction = 1;

    // box.fixedRotation = true;
    
    world.addBody(box);
}

//  Stack of boxes

/*
for (let i = 0; i < 16; i++)
{
    let box = new Body(new Vec2(32, 32), 1);

    box.position.set(400, 520 - (i * 32));
    box.friction = 0;
    box.fixedRotation = true;
    
    world.addBody(box);
}
*/

let renderer = new CanvasRenderer(document.getElementById('demo') as HTMLCanvasElement);

renderer.showContacts = false;
renderer.showBounds = false;

let pause = false;
let frame = 0;

let frameText = document.getElementById('frame') as HTMLFormElement;
let bodiesText = document.getElementById('bodies') as HTMLFormElement;
let arbitersText = document.getElementById('arbiters') as HTMLFormElement;

document.getElementById('pause').addEventListener('click', () => {

    pause = (pause) ? false : true;

});

window['arbitersTotal'] = 0;
window['arbitersMerged'] = 0;

window['world'] = world;

function loop ()
{
    if (!pause)
    {
        world.step(delta);
        // world.OLDstep(delta);

        renderer.render(world);

        frameText.value = frame.toString();
        // bodiesText.value = world.bodies.length.toString();
        // arbitersText.value = world.arbiters.length.toString();
        bodiesText.value = world.arbiters.length.toString();
        // bodiesText.value = window['arbitersMerged'].toString();
        arbitersText.value = window['arbitersTotal'].toString();

        frame++;
    }

    requestAnimationFrame(loop);
}

loop();
