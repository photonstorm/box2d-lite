# Box2D Lite TypeScript

This is a port of Erin Catto's Box2D Lite to TypeScript.

## v0.0.1


All classes ported. Test bed created. Everything runs, but it's generating a staggering number of vec2 and mat22 instances per frame. Currently, the test is making around 270,000 vec2s and 37,000 mat22s per frame. This needs sorting. Inline math to the rescue.

## v0.0.2

Inlined all of the Mat22 static functions.

Test case now down from 270k vec2 per frame to around 96k.
Mat22s still at 37k per frame.


