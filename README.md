# 🕹️ games

Small browser games built for fun, as challenges, and as an excuse to try new tech. Each one runs entirely in the browser: no build step, no backend, no install. Open it and play.

## 🔴🔵 Connect Four: built from Kauai to Oakland

**The challenge:** board a flight in Kauai and land in Oakland with a working Connect Four, *including an AI opponent that actually fights back*.

It shipped before the wheels touched down. 🛬

What's inside:

- **🧠 A minimax AI with alpha-beta pruning.** It searches several moves ahead and cuts off branches it doesn't need to explore, so it finds strong moves fast.
- **⚡ Web Workers.** The AI does its thinking off the main thread, so the board never freezes while the computer decides how to beat you.
- **🎨 p5.js rendering.** The board, pieces, hover preview and win screen are all drawn on a canvas.
- **✨ Modern JavaScript.** It uses ES modules, classes, arrow functions and destructuring.

👉 [Play it](connect-four/) · [Read about it](connect-four/README.md)

## Run locally

ES modules and Web Workers need to be served over HTTP, so opening the files directly from disk won't work:

```sh
npx serve .        # or: python3 -m http.server
```

Then open `http://localhost:3000/connect-four/` (port 8000 if you used Python).

---

Made by [Deno Vichas](https://github.com/denov). More games coming.
