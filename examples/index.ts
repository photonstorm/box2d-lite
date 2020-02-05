import Body from '../src/Body';
import CanvasRenderer from '../src/CanvasRenderer';
import World from '../src/World';
import Vec2 from '../src/math/Vec2';

console.log('Box2D Lite');

let delta = 1 / 30;
let world = new World(new Vec2(0, 40), 20);

let floor = new Body(new Vec2(1000, 80), Number.MAX_VALUE);

floor.position.set(500, 500);

world.addBody(floor);

let box = new Body(new Vec2(30, 30), 5);

box.velocity.y = -20;
box.position.set(100, 10);

world.addBody(box);

window.world = world;

let box2 = new Body(new Vec2(120, 60), 25);

box2.velocity.y = -10;
box2.position.set(500, 10);

world.addBody(box2);

let renderer = new CanvasRenderer(document.getElementById('demo') as HTMLCanvasElement);

function loop ()
{
    world.step(delta);

    renderer.render(world);

    requestAnimationFrame(loop);
}

loop();
