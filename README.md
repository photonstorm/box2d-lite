# Box2D Lite TypeScript

This is a port of Erin Catto's Box2D Lite to TypeScript.

## v0.0.1

All classes ported. Test bed created. Everything runs, but it's generating a staggering number of vec2 and mat22 instances per frame. Currently, the test is creating 274,000 vec2s and 37,000 mat22s per frame at 20 world iterations. This needs sorting. Inline math to the rescue.

20 world iterations:

Frame: 200 = 201,806 vec2s - 36,926 mat22s
Frame: 600 = 274,009 vec2s - 37,007 mat22s

10 world iterations:

Frame: 200 = 190,846 vec2s - 36,929 mat22s
Frame: 600 = 226,913 vec2s - 37,007 mat22s

All tests from now will use 10 iterations.

Note that the totals are how many _brand new_ vec2 and mat22 instances are created
in that one single frame. I.e. used purely for collision math.

Why frames 200 and 600? Because in Frame 200 most of the bodies are in the air, the only contacts are with each other or the pendulum. By Frame 600 they're all resting on the floor, so have lots of contacts.

## v0.0.2

Inlined all of the Mat22 static functions.

Frame: 200 = 64,448 vec2s - 36,933 mat22s
Frame: 600 = 97,684 vec2s - 36,999 mat22s

Test case now down from 270k vec2 per frame to around 97k.

mat22s fluctate per frame

## v0.0.3

ComputeIncidentEdge clipVertex inline:

Frame: 200 = 64,224 vec2s - 36,933 mat22s
Frame: 600 = 97,196 vec2s - 36,999 mat22s

## v0.0.4

ComputeIncidentEdge n / abs n inline:

Frame: 200 = 64,112 vec2s - 36,877 mat22s
Frame: 600 = 96,952 vec2s - 36,877 mat22s

## v0.0.5

Inline mat22 and vec2s in CanvasRenderer:

Frame: 200 = 62,460 vec2s - 36,772 mat22s
Frame: 600 = 95,300 vec2s - 36,772 mat22s

## v0.0.6

Let's break-down which part of the World.step is causing the most creations:

vec2s:

Frame 200: 

1) 48,065 - World.broadphase
2) 48,368 - Integrate forces
3) 48,928 - Arbiters preStep
4) 48,937 - Joints preStep
5) 62,357 - Perform aribter and joint iterations
6) 62,460 - Integrate velocities

Frame 600:

1) 49,225 - World.broadphase
2) 49,528 - Integrate forces
3) 51,368 - Arbiters preStep
4) 51,377 - Joints preStep
5) 95,197 - Perform aribter and joint iterations
6) 95,300 - Integrate velocities

mat22s:

Frame 200 and 600 are the same:

1) 36,764 - World.broadphase
2) 36,764 - Integrate forces
3) 36,764 - Arbiters preStep
4) 36,772 - Joints preStep
5) 36,772 - Perform aribter and joint iterations
6) 36,772 - Integrate velocities

So, for vec2s the majority happen in World.broadphase and then a massive jump when performing arbiter and joint iterations.

For mat22s everything pretty much happens in World.broadphase.

Let's try and reduce the number of vec2s created during arbiter iterations by inlining a bunch of that math.

## v0.0.7

Inlined all vector math in Arbiter.applyImpulse and found some duplicate code:

Frame: 200 = 50,210 vec2s - 36,772 mat22s
Frame: 600 = 53,998 vec2s - 36,772 mat22s

This is a 19.6126% decrease on Frame 200 and a massive 43.3389% decrease on Frame 600.

Let's check this against our World.step flow:

Frame 200:

1) 48,163 - World.broadphase
2) 48,466 - Integrate forces
3) 49,138 - Arbiters preStep
4) 49,147 - Joints preStep
5) 50,107 - Perform aribter and joint iterations
6) 50,210 - Integrate velocities

Frame 600:

1) 49,287 - World.broadphase
2) 49,590 - Integrate forces
3) 51,446 - Arbiters preStep
4) 51,455 - Joints preStep
5) 53,895 - Perform aribter and joint iterations
6) 53,998 - Integrate velocities

At this stage, it doesn't matter if the bodies are in contact or not, we're getting a much more steady count.

## v0.0.8

When the test starts-up there are 533 vec2 instances and 7 mat22 instances, this is before the World has even stepped once, so it's just what the bodies, joints, etc need to exist.

World.broadphase is clearly the biggest cost here because of the Collide function.

It creates 4 new vec2s _per_ Contact instance. Let's see if we can get that lower.

Ok, after replacing the Contact vec2s with numbers and inlining a load of Arbiter math, we've got:

Frame: 200 = 48,236 vec2s - 36,772 mat22s
Frame: 600 = 48,666 vec2s - 36,772 mat22s

This is a 3.93149% decrease on Frame 200 and 9.87444% decrease on Frame 600.

## v0.0.9

Have gone through the Collide function and used a set of 7 locally cached Mat22 instances and added a few modifier functions that operate on existing instances. Also cached all vec2 instances in the same function. The end result speaks for itself:

Frame: 200 = 684 vec2s - 8 mat22s
Frame: 600 = 866 vec2s - 8 mat22s

This is a 98.582% decrease on Frame 200 and 98.2205% decrease on Frame 600 for vec2s, and a huge 99.9782% decrease for the mat22s :)

Pretty happy with just 8 mat22s in the entire test! We're still creating ~700 vec2s per frame, though. That is well within an acceptable range, but it'd be good to see if we can push this any further.

## v0.1.0

It would appear that the final instance creating bastion is the ClipVertex. It only creates one vec2 instance per class, but we can still do away with it perfectly easily, with minimal changes elsewhere. Let's go...

Frame: 200 = 535 vec2s - 8 mat22s
Frame: 600 = 535 vec2s - 8 mat22s

We've now got the vec2 instance count perfectly stable, regardless of the number of contacts, which is great.

Also, a 38.2217% decrease is pretty good. But, I'm sure we can go further without mangling the code too much.

