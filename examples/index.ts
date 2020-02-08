import Body from '../src/Body';
import CanvasRenderer from '../src/CanvasRenderer';
import Joint from '../src/Joint';
import World from '../src/World';
import Vec2 from '../src/math/Vec2';
import Random from '../src/math/Random';
import RandomInt from '../src/math/RandomInt';

let delta = 1 / 60;
let iterations = 10;
let gravity = new Vec2(0, 10);

let demoIndex = 0;

let width = 1280;
let height = 720;
let zoom = 30;
let pan_x = 0;
let pan_y = 8;
let bomb: Body;

const demoStrings = [
	"Demo 1: A Single Box",
	"Demo 2: Simple Pendulum",
	"Demo 3: Varying Friction Coefficients",
	"Demo 4: Randomized Stacking",
	"Demo 5: Pyramid Stacking",
	"Demo 6: A Teeter",
	"Demo 7: A Suspension Bridge",
	"Demo 8: Dominos",
    "Demo 9: Multi-pendulum"
];

let world = new World(width, height, gravity, iterations);

function LaunchBomb ()
{
    const x = Random(-15, 15);
    const y = 15;

    if (!bomb)
    {
        bomb = new Body(x, y, 1, 1, 50);
        bomb.friction = 0.2;
        world.addBody(bomb);
    }

    bomb.position.set(x, 15);
    bomb.rotation = Random(-1.5, 1.5);
    bomb.velocity.set(-1.5 * x, -1.5 * y);
    bomb.angularVelocity = Random(-20, 20);
}

function InitDemo (index: number)
{
    world.clear();
    bomb = null;

    demoIndex = index;

    switch (index)
    {
        case 1: {
            Demo1();
            break;
        }

        case 2: {
            Demo2();
            break;
        }

        case 3: {
            Demo3();
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

//  Box2D Demos assume:
//  0x0 = center of the world
//  1 size unit = 1 px

// Single box
function Demo1 ()
{
    world.addBody(new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE));

    world.addBody(new Body(0, -4, 1, 1, 200));
}

// A simple pendulum
function Demo2 ()
{
}

// Varying friction coefficients
function Demo3 ()
{
}

// A vertical stack
function Demo4 ()
{
    const floor = new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE);

    floor.friction = 0.2;

    world.addBody(floor);

    for (let i: number = 0; i < 10; i++)
    {
        let b = new Body(Random(-0.1, 0.1), -(0.51 + 1.05 * i), 1, 1, 1);
        b.friction = 0.2;
        world.addBody(b);
    }
}

// A pyramid
function Demo5 ()
{
}

// A teeter
function Demo6 ()
{
}

// A suspension bridge
function Demo7 ()
{
}

// Dominos
function Demo8 ()
{
}

// A multi-pendulum
function Demo9 ()
{
}

InitDemo(4);

let renderer = new CanvasRenderer(document.getElementById('demo') as HTMLCanvasElement);

// renderer.showContacts = false;
renderer.showBounds = false;

let pause = false;
let frame = 0;

let frameText = document.getElementById('frame') as HTMLFormElement;
let bodiesText = document.getElementById('bodies') as HTMLFormElement;
let jointsText = document.getElementById('joints') as HTMLFormElement;

document.getElementById('pause').addEventListener('click', () => {

    pause = (pause) ? false : true;

});

window['world'] = world;

// renderer.init(zoom);

function loop ()
{
    if (!pause)
    {
        world.step(delta);
        // world.OLDstep(delta);

        renderer.render(world, zoom, pan_x, pan_y);

        frameText.value = frame.toString();
        bodiesText.value = world.bodies.length.toString();
        jointsText.value = world.joints.length.toString();

        frame++;
    }

    requestAnimationFrame(loop);
}

loop();
