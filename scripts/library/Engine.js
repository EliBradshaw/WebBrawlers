import Node from "./Node.js";

export default class Engine {
    static FPS = 60;
    static get perfectMS() {
        return 1000 / Engine.FPS; // Convert FPS to milliseconds per frame
    }
    static waitMS = Engine.perfectMS;
    static root = new Node();

    static ctx = null;
    static ui = null;

    static debug = {
        fps: true,
    }
    static init() {
        const canvas = document.getElementById("board");
        Engine.ctx = canvas.getContext("2d");

        const ui = document.getElementById("ui");
        Engine.ui = ui;

        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Start the main loop
        Engine.loop();
    }

    static loop() {
        let before = performance.now();
        Engine.root.tick(Engine.ctx);
        let after = performance.now();
        let timeSpent = after - before;
        let smoothing = 10;
        Engine.waitMS *= smoothing-1; // Make it so that the next frame is averaged over smoothing frames.
        Engine.waitMS += Engine.perfectMS - timeSpent;
        Engine.waitMS /= smoothing;

        if (Engine.debug.fps) {
            Engine.ctx.fillStyle = "black";
            Engine.ctx.fillRect(0, 0, 50, 25);
            Engine.ctx.fillStyle = "white";
            Engine.ctx.fillText(`FPS: ${Math.round(1000 / Engine.waitMS)}`, 10, 20);
        }

        setTimeout(Engine.loop, Engine.waitMS);
    }
}