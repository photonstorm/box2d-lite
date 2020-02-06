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
            frame200Text.value = vec2Text.value;
        }
        else if (frame === 600)
        {
            frame600Text.value = vec2Text.value;
        }

        frame++;
    }

    requestAnimationFrame(loop);
}

loop();
