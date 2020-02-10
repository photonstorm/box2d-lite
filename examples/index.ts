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

let demoIndex = 1;
let oldStep = false;

const k_pi = 3.14159265358979323846264;

let width = 1280;
let height = 720;
let zoom = 30;
let pan_x = 0;
let pan_y = 8;
let bomb: Body;

let world = new World(width, height, gravity, iterations);

window['world'] = world;

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
    frame = 0;

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

// Single box
function Demo1 ()
{
    world.addBody(new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE));

    world.addBody(new Body(0, -4, 1, 1, 200));
}

// A simple pendulum
function Demo2 ()
{
    /*
    const b1 = world.addBody(new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE));
    const b2 = world.addBody(new Body(9, -11, 1, 1, 100));

    let j = world.addJoint(new Joint());
    j.set(world, b1, b2, new Vec2(0, -11));
    */

    world.addBody(new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE));

    const b1 = world.addBody(new Body(-2.5, -15, 1, 1, 100));
    const b2 = world.addBody(new Body(2.5, -15, 1, 1, 100));

    world.addBody(new Body(-2.5, -10, 8, 0.5, Number.MAX_VALUE));

    let j = world.addJoint(new Joint());

    //  x0 = the joint is in the middle space between the 2 bodies
    //  x2 = the joint is near the right-hand body
    //  x-2 = the joint is near the left-hand body
    // j.set(world, b1, b2, new Vec2(-1, -15));
    j.set(world, b1, b2, new Vec2(b1.position.x, b1.position.y));

}

// Varying friction coefficients
function Demo3 ()
{
}

// A vertical stack
function Demo4 ()
{
    world.addBody(new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE));

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
    world.addBody(new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE));

    let x = new Vec2(-6, -0.75);
    let y = new Vec2();

    for (let i: number = 0; i < 12; i++)
    {
        //  y = x
        y.set(x.x, x.y);

        for (let j: number = i; j < 12; j++)
        {
            world.addBody(new Body(y.x, y.y, 1, 1, 10));

            y.x += 1.125;
        }

        x.x += 0.5625;
        x.y -= 2;
    }
}

// A teeter
function Demo6 ()
{
    const b1 = world.addBody(new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE));

    const b2 = world.addBody(new Body(0, -1, 12, 0.25, 100));
    const b3 = world.addBody(new Body(-5, -2, 0.5, 0.5, 25));
    const b4 = world.addBody(new Body(-5.5, -2, 0.5, 0.5, 25));
    const b5 = world.addBody(new Body(5.5, -15, 1, 1, 100));

    let j = world.addJoint(new Joint());
    j.set(world, b1, b2, new Vec2(0, -1));
}

// A suspension bridge
function Demo7 ()
{
    let b1 = world.addBody(new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE));

	const numPlanks = 15;
    let mass = 50.0;
    
    let planks = [];

	for (let i = 0; i < numPlanks; i++)
	{
        let p = world.addBody(new Body(-8.5 + 1.25 * i, -10, 1, 0.25, mass));

        planks.push(p);
    }

	// Tuning
	let frequencyHz = 2.0;
	let dampingRatio = 0.7;

	// frequency in radians
	let omega = 2.0 * k_pi * frequencyHz;

	// damping coefficient
	let d = 2.0 * mass * dampingRatio * omega;

	// spring stifness
	let k = mass * omega * omega;

	// magic formulas
	let softness = 1.0 / (d + delta * k);
    let biasFactor = delta * k / (d + delta * k);
    
    let j: Joint;

	for (let i = 0; i < numPlanks - 1; i++)
	{
        let p1 = planks[i];
        let p2 = planks[i + 1];

        j = world.addJoint(new Joint());
        j.set(world, p1, p2, new Vec2(p1.position.x + ((p2.position.x - p1.position.x) / 2), p1.position.y));
        j.softness = softness;
        j.biasFactor = biasFactor;

        // console.log(j.)
	}

    j = world.addJoint(new Joint());
    j.set(world, b1, planks[0], new Vec2(-9.125, -10));
    j.softness = softness;
    j.biasFactor = biasFactor;

    j = world.addJoint(new Joint());
    j.set(world, b1, planks[numPlanks - 1], new Vec2(-9.125 + 1.25 * numPlanks, -10));
    j.softness = softness;
    j.biasFactor = biasFactor;

    //  Some random bodies
    for (let i = 0; i < 20; i++)
    {
        world.addBody(new Body(Random(-8, 8), Random(-20, -30), 1, 1, 1));
    }

}

// Dominos
function Demo8 ()
{
    const b1 = world.addBody(new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE));

    world.addBody(new Body(-1.5, -10, 10, 0.5, Number.MAX_VALUE));

    let b: Body;

    for (let i: number = 0; i < 10; i++)
    {
        b = new Body(-6 + (1 * i), -11.125, 0.2, 2.0, 10);
        b.friction = 0.1;
        world.addBody(b);
    }

    b = world.addBody(new Body(1, -6, 14, 0.5, Number.MAX_VALUE));
    b.rotation = -0.3;

    const b2 = world.addBody(new Body(-7, -4, 0.5, 3.0, Number.MAX_VALUE));

    const b3 = world.addBody(new Body(-0.9, -1, 12, 0.25, 20));

    let j: Joint = world.addJoint(new Joint());
    j.set(world, b1, b3, new Vec2(-2, -1));

    const b4 = world.addBody(new Body(-10, -15, 0.5, 0.5, 10));

    j = world.addJoint(new Joint());
    j.set(world, b2, b4, new Vec2(-7, -15));

    const b5 = world.addBody(new Body(6, -2.5, 2, 2, 20));
    b5.friction = 0.1;

    j = world.addJoint(new Joint());
    j.set(world, b1, b5, new Vec2(6, -2.6));

    const b6 = world.addBody(new Body(6, -3.6, 2, 0.2, 10));

    j = world.addJoint(new Joint());
    j.set(world, b5, b6, new Vec2(7, -3.5));
}

// A multi-pendulum (chain)
function Demo9 ()
{
    let b1 = world.addBody(new Body(0, 0.5 * 20, 100, 20, Number.MAX_VALUE));

    let mass = 10;

    // Tuning
	let frequencyHz = 4.;
	let dampingRatio = 0.7;

	// frequency in radians
	let omega = 2.0 * k_pi * frequencyHz;

	// damping coefficient
	let d = 2.0 * mass * dampingRatio * omega;

	// spring stiffness
	let k = mass * omega * omega;

	// magic formulas
	let softness = 1.0 / (d + delta * k);
	let biasFactor = delta * k / (d + delta * k);

	const y = -16.0;

    for (let i: number = 0; i < 15; i++)
	{
        let b = world.addBody(new Body(0.5 + i, y, 0.75, 0.25, mass));

        let j: Joint = world.addJoint(new Joint());
        j.set(world, b1, b, new Vec2(i, y));
        j.softness = softness;
        j.biasFactor = biasFactor;

        b1 = b;
    }
}

let renderer = new CanvasRenderer(document.getElementById('demo') as HTMLCanvasElement);

// renderer.showContacts = false;
renderer.showBounds = false;

let pause = false;
let frame = 0;

InitDemo(1);

let demoList = document.getElementById('demolist');

demoList.addEventListener('change', (e) => {

    let target = e.target as HTMLFormElement ;

    demoIndex = parseInt(target.value);

    InitDemo(demoIndex);

    pauseButton.innerText = 'play';
    pause = true;

});

let frameText = document.getElementById('frame') as HTMLFormElement;
let bodiesText = document.getElementById('bodies') as HTMLFormElement;
let jointsText = document.getElementById('joints') as HTMLFormElement;
let pauseButton = document.getElementById('pause') as HTMLFormElement;
let boundsToggle = document.getElementById('showBounds') as HTMLFormElement;
let contactsToggle = document.getElementById('showContacts') as HTMLFormElement;
let jointsToggle = document.getElementById('showJoints') as HTMLFormElement;
let bodiesToggle = document.getElementById('showBodies') as HTMLFormElement;
let zoomRange = document.getElementById('zoom') as HTMLFormElement;
let panHRange = document.getElementById('panH') as HTMLFormElement;
let panVRange = document.getElementById('panV') as HTMLFormElement;

let stepButton = document.getElementById('stepType') as HTMLFormElement;

boundsToggle.addEventListener('change', () => {
    renderer.showBounds = boundsToggle.checked;
});

contactsToggle.addEventListener('change', () => {
    renderer.showContacts = contactsToggle.checked;
});

jointsToggle.addEventListener('change', () => {
    renderer.showJoints = jointsToggle.checked;
});

bodiesToggle.addEventListener('change', () => {
    renderer.showBodies = bodiesToggle.checked;
});

zoomRange.addEventListener('input', () => {
    zoom = zoomRange.valueAsNumber;
});

panHRange.addEventListener('input', () => {
    pan_x = panHRange.valueAsNumber;
});

panVRange.addEventListener('input', () => {
    pan_y = panVRange.valueAsNumber;
});

pauseButton.addEventListener('click', () => {

    if (pause)
    {
        pauseButton.innerText = 'pause';
        pause = false;
    }
    else
    {
        pauseButton.innerText = 'play';
        pause = true;
    }

});

stepButton.addEventListener('click', () => {

    if (oldStep)
    {
        stepButton.innerText = 'NEW';
        oldStep = false;
    }
    else
    {
        stepButton.innerText = 'OLD';
        oldStep = true;
    }

});

function loop ()
{
    if (!pause)
    {
        if (oldStep)
        {
            world.OLDstep(delta);
        }
        else
        {
            world.step(delta);
        }

        frame++;
    }

    renderer.render(world, zoom, pan_x, pan_y);

    frameText.value = frame.toString();
    bodiesText.value = world.bodies.length.toString();
    jointsText.value = world.joints.length.toString();

    requestAnimationFrame(loop);
}

loop();
