import Body from '../src/Body';
import World from '../src/World';
import Vec2 from '../src/math/Vec2';

let delta = 1 / 30;
let world = new World();

let floor = new Body(new Vec2(500, 20), Number.MAX_VALUE);

floor.position.set(250, 300);

world.addBody(floor);

let box = new Body(new Vec2(30, 30), 5);

box.velocity.y = -20;

world.addBody(box);

function loop ()
{
    world.step(delta);

    requestAnimationFrame(loop);
}

loop();
