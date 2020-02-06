# Box2D Lite TypeScript

This is a port of Erin Catto's Box2D Lite to TypeScript.

## v0.0.1

All classes ported. Test bed created. Everything runs, but it's generating a staggering number of vec2 and mat22 instances per frame. Currently, the test is making around 270,000 vec2s and 37,000 mat22s per frame. This needs sorting. Inline math to the rescue.

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

