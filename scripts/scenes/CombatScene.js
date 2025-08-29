import Node from "../library/Node.js";
import Vector from "../library/Vector.js";
import Platform from "../Platform.js";

export default class CombatScene extends Node {
    constructor() {
        super();
        this.adopt(
            new Platform(800, 50).moveGloballyTo(50, 750)
        )
    }

    render(ctx) {
        ctx.fillStyle = "lightblue";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}