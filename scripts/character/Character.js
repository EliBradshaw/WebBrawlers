import Node from "../library/Node.js";
import Vector from "../library/Vector.js";

export default class Character extends Node {
    constructor(controllerClass) {
        super();
        this.controller = new controllerClass(this);
        this.dimensions = new Vector(50, 50);
        this.moveGloballyTo(100, 500);
    }

    render(ctx) {
        let pos = this.getGlobalPosition();
        ctx.fillStyle = "red";
        ctx.fillRect(pos.x, pos.y, this.dimensions.x, this.dimensions.y);
    }
}