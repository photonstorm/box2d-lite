import Body from '../src/Body';
import CanvasRenderer from '../src/CanvasRenderer';
import Joint from '../src/Joint';
import World from '../src/World';
import Vec2 from '../src/math/Vec2';

window['vec2Total'] = 0;
window['mat22Total'] = 0;

let delta = 1 / 30;
let world = new World(new Vec2(0, 40), 10);

let floor = new Body(new Vec2(2000, 80), Number.MAX_VALUE);

floor.position.set(500, 500);

world.addBody(floor);

let box;
let boxPos = new Vec2(300, -150);
let boxesPerRow = 10;
let boxesPerCol = 10;
let boxOffset = 16;

for (let i = 0; i < boxesPerRow; i++)
{
    for (let j = 0; j < boxesPerCol; j++)
    {
        box = new Body(new Vec2(12, 12), 5);
        box.position.set(boxPos.x + i * boxOffset, boxPos.y + j * boxOffset);
        box.velocity.y = -50 + j;
        world.addBody(box);
    }
}

let support = new Body(new Vec2(25, 25), Number.MAX_VALUE);
support.position.set(350+180, 50);
world.addBody(support);

let pendulum = new Body(new Vec2(50, 50), 900);
pendulum.position.set(505+180, 40);
world.addBody(pendulum);

let joint = new Joint();
joint.set(world, support, pendulum, support.position);
world.addJoint(joint);

let renderer = new CanvasRenderer(document.getElementById('demo') as HTMLCanvasElement);

let pause = true;
let frame = 0;

let frameText = document.getElementById('frame') as HTMLFormElement;
let vec2Text = document.getElementById('vec2') as HTMLFormElement;
let mat22Text = document.getElementById('mat22') as HTMLFormElement;
let frame200Text = document.getElementById('frame200') as HTMLFormElement;
let frame600Text = document.getElementById('frame600') as HTMLFormElement;

document.getElementById('pause').addEventListener('click', () => {

    pause = (pause) ? false : true;

});

function showStepStats (text)
{
    const debug = [
        '1)',
        window['step1'],
        '2)',
        window['step2'],
        '3)',
        window['step3'],
        '4)',
        window['step4'],
        '5)',
        window['step5'],
        '6)',
        window['step6'],
        '7)',
        window['step7']
    ];

    text.value = debug.join(' ');
}

function showBodyStats ()
{
    world.bodies.forEach((body) => {
        console.log(body.id, body.total);
    });
}

console.log('start-up: ', window['vec2Total'], window['mat22Total']);

function loop ()
{
    window['vec2Total'] = 0;
    window['mat22Total'] = 0;

    if (!pause)
    {
        world.step(delta);

        renderer.render(world);

        frameText.value = frame.toString();
        vec2Text.value = window['vec2Total'].toString();
        mat22Text.value = window['mat22Total'].toString();

        if (frame === 200)
        {
            // showStepStats(frame200Text);
            // console.log('200');
            // showBodyStats();
            frame200Text.value = 'vec2: ' + vec2Text.value + ' mat22: ' + mat22Text.value + ' arbiters: ' + world.arbiters.length + ' bodies: ' + world.bodies.length;
        }
        else if (frame === 600)
        {
            // showStepStats(frame600Text);
            // console.log('');
            // console.log('600');
            // showBodyStats();
            frame600Text.value = 'vec2: ' + vec2Text.value + ' mat22: ' + mat22Text.value + ' arbiters: ' + world.arbiters.length + ' bodies: ' + world.bodies.length;
        }

        frame++;
    }

    requestAnimationFrame(loop);
}

loop();
