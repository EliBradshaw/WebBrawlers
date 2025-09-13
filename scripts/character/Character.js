import MovingNode from "../library/MovingNode.js";
import Node from "../library/Node.js";
import Vector from "../library/Vector.js";

export default class Character extends MovingNode {
    constructor(controllerClass) {
        super();
        this.controller = new controllerClass(this);
        this.dimensions = new Vector(50, 50);
        this.velocity = new Vector();

        this.stats = {
            acceleration: 20, // frames until full values are reached
            airAcceleration: 100,
            deaccel: 2,
            landingDeaccel: 0.2, // % left after landing

            switchupSpeed: 0.8, // % taken off speed when velx is opposite as wanted
            speed: 5,

            jumpFalloff: 0.8, // % taken off y when jump is not held and still going up
            jumpHeight: 15,
            gravity: 0.5,
            coyoteTime: 10 // frames after leaving a platform where jump is still allowed
        }

        this.colFlags = {
            top: false,
            bottom: false,
            left: false,
            right: false
        };
    }

    update() {
        this.controller.update();
    }

    render(ctx) {
        let pos = this.getGlobalPosition();
        ctx.fillStyle = "red";
        ctx.fillRect(pos.x, pos.y, this.dimensions.x, this.dimensions.y);
    }


    /** Accepts any col node with a collidesWithBox method */
    wipeCols() {
        this.colFlags = {
            top: false,
            bottom: false,
            left: false,
            right: false
        };
    }

    considerCollision(col) {
        let change = this.offset.clone();
        // Get positions and dimensions
        let a = this.getGlobalPosition();
        let b = col.getGlobalPosition();
        let aw = this.dimensions.x, ah = this.dimensions.y;
        let bw = col.dimensions.x, bh = col.dimensions.y;

        // Only check if colliding at all
        if (!col.collidesWithBox(this)) return change;

        // Calculate overlap on each side
        let dx = (a.x + aw / 2) - (b.x + bw / 2);
        let dy = (a.y + ah / 2) - (b.y + bh / 2);
        let combinedHalfWidths = (aw + bw) / 2;
        let combinedHalfHeights = (ah + bh) / 2;
        let overlapX = combinedHalfWidths - Math.abs(dx);
        let overlapY = combinedHalfHeights - Math.abs(dy);

        // Snap position based on collision side
        if (overlapX < overlapY) {
            // Colliding more on X axis
            if (dx > 0) {
                this.colFlags.left = true; // Character's left hits col's right
                // Snap character's left to col's right
                change.x = b.x + bw;
            } else {
                this.colFlags.right = true; // Character's right hits col's left
                // Snap character's right to col's left
                change.x = b.x - aw;
            }
        } else {
            // Colliding more on Y axis
            if (dy > 0) {
                this.colFlags.top = true; // Character's top hits col's bottom
                // Snap character's top to col's bottom
                change.y = b.y + bh;
            } else {
                this.colFlags.bottom = true; // Character's bottom hits col's top
                // Snap character's bottom to col's top
                change.y = b.y - ah;
            }
        }
        return change;
    }
}