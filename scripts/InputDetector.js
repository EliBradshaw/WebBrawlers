import Engine from "./library/Engine.js";
import Node from "./library/Node.js";
import Vector from "./library/Vector.js";

export default class InputDetector extends Node {
    constructor() {
        super();
        Node.tagNode("input", this);

        this.mouse = new Vector();
        this.keys = {};
        window.addEventListener("keydown", e => {
            if (e.key == "p") {
                Engine.debugEnabled = !Engine.debugEnabled;
            }
            this.keys[e.key.toLowerCase()] = true;
        });
        window.addEventListener("keyup", e => {
            this.keys[e.key.toLowerCase()] = false;
        });

        window.addEventListener("mousemove", e => {
            this.mouse.set(e.clientX, e.clientY);
        });
    }
}