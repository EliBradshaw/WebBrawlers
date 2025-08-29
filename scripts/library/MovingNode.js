import Node from "./Node.js";
import Vector from "./Vector.js";

export default class MovingNode extends Node {
    constructor() {
        super();
        this.velocity = new Vector();
    }

    tick(...args) {
        super.tick(...args);
        this.offset.add(this.velocity);
    }
}