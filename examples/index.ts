import Body from '../src/Body';
import CanvasRenderer from '../src/CanvasRenderer';
import Joint from '../src/Joint';
import World from '../src/World';
import Vec2 from '../src/math/Vec2';

let delta = 1 / 30;
let world = new World(new Vec2(0, 40), 10);
// let world = new World();

let floor = new Body(new Vec2(800, 64), Number.MAX_VALUE);

floor.position.set(400, 600-32);
floor.friction = 0;

world.addBody(floor);

let leftWall = new Body(new Vec2(64, 600), Number.MAX_VALUE);

leftWall.position.set(-32, 300);
leftWall.friction = 0;

world.addBody(leftWall);

let rightWall = new Body(new Vec2(64, 600), Number.MAX_VALUE);

rightWall.position.set(832, 300);
rightWall.friction = 0;

world.addBody(rightWall);

for (let i = 0; i < 16; i++)
{
    let box = new Body(new Vec2(32, 32), 1);

    box.position.set(400, 520 - (i * 40));
    // box.friction = 0;
    box.fixedRotation = true;
    
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

let pause = false;
let frame = 0;

let frameText = document.getElementById('frame') as HTMLFormElement;
let bodiesText = document.getElementById('bodies') as HTMLFormElement;
let arbitersText = document.getElementById('arbiters') as HTMLFormElement;

document.getElementById('pause').addEventListener('click', () => {

    pause = (pause) ? false : true;

});

function loop ()
{
    if (!pause)
    {
        world.step(delta);

        renderer.render(world);

        frameText.value = frame.toString();
        bodiesText.value = world.bodies.length.toString();
        arbitersText.value = world.arbiters.length.toString();

        frame++;
    }

    requestAnimationFrame(loop);
}

loop();
