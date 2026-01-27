import Node from "./Node.js";
import Vector from "./Vector.js";

export default class Sprite extends Node {
    constructor(imageSrc, scale = 1, extraRotation = 0, origin = null) {
        super();
        this.image = new Image();
        this.image.onload = () => {
            this.loaded = true;
            if (!origin) {
                this.origin = new Vector(this.image.width / 2, this.image.height / 2);
            }
        };
        this.image.src = "images/" + imageSrc;
        this.origin = origin; // {x: , y: } or null for top-left
        this.loaded = false;
        this.rotation = 0; // in degrees
        this.scale = scale;
        this.extraRotation = extraRotation; // in degrees
    }

    render(ctx) {
        if (!this.loaded) return; // Wait for image to load

        let pos = this.getGlobalPosition();
        const width = this.image.width * this.scale;
        const height = this.image.height * this.scale;
        ctx.save();
        if (this.origin) { // Rotate around origin
            // use Math to move the origin to the desired point
            let rad = (((this.rotation) % 360) * Math.PI) / 180;
            // Get direction vector from rotation
            let dirX = Math.cos(rad);
            let dirY = Math.sin(rad);
            ctx.translate(
                dirX * (this.origin.y * width),
                dirY * (this.origin.x * height)
            );
        }
        ctx.translate(pos.x + width / 2, pos.y + height / 2);
        ctx.rotate((((this.rotation + this.extraRotation) % 360) * Math.PI) / 180);
        ctx.drawImage(
            this.image,
            -width / 2,
            -height / 2,
            width,
            height
        );
        ctx.restore();
    }
}