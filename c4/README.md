# C4

by Deno Vichas · deno@fullstacksystems.com

Built as a personal challenge: write it from scratch during a single flight from Kauai to Oakland.

It was also an excuse to:

- use newer ES features and syntax
- try Web Workers for long-running calculations, so the AI doesn't block the render loop
- play around with [p5.js](https://p5js.org/) / [p5play](https://p5play.org/)

## How the AI works

The computer opponent (`js/ai.js`) runs **minimax with alpha-beta pruning** inside a Web Worker. The board model and position scoring live in `js/c4.js`, and the p5.js rendering and input handling live in `js/connect.js`.

## Run it

Serve this folder over HTTP (module workers won't load from `file://`), then open `index.html`:

```sh
python3 -m http.server
```
