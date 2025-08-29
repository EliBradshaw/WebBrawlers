import Node from "./library/Node.js";
import Vector from "./library/Vector.js";

export default class Platform extends Node {
    constructor(width, height, color = "brown") {
        super();
        this.dimensions = new Vector(width, height);
        this.color = color;
    }

    render(ctx) {
        let pos = this.getGlobalPosition();
        ctx.fillStyle = this.color;
        ctx.fillRect(pos.x, pos.y, this.dimensions.x, this.dimensions.y);
    }

    /** Accepts any node with offset for position and dimensions for size */
    collidesWithBox(box) {
        let [x, y, w, h, ox, oy, ow, oh] = [
            this.getGlobalPosition().x,
            this.getGlobalPosition().y,
            this.dimensions.x,
            this.dimensions.y,
            box.getGlobalPosition().x,
            box.getGlobalPosition().y,
            box.dimensions.x,
            box.dimensions.y
        ];

        return x < ox + ow && 
            x + w > ox && 
            y < oy + oh && 
            y + h > oy;
    }
}