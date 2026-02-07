import Controller from "./character/Controller.js";
import Engine from "./library/Engine.js";
import Node from "./library/Node.js";
import Vector from "./library/Vector.js";

export default class PlayerController extends Controller {
    constructor(character) {
        super(character);
        this.coyoteTime = 0;
    }

    update() {
        let cols = this.character.colFlags;
        let input = Node.getNode("input");
        this.input = input;
        let chr = this.character;
        let vel = chr.velocity;

        vel.y += chr.stats.gravity;
        if (cols.bottom) {
            vel.y = 0;
        }
        let accel = cols.bottom ? chr.stats.acceleration : chr.stats.airAcceleration;
        if (input.keys.a) {
            if (vel.x > 0)
                vel.x *= chr.stats.switchupSpeed;
            // Approach characters full speed
            vel.x *= accel; // average
            vel.x -= chr.stats.speed;
            vel.x /= accel+1;
        }

        if (input.keys.d) {
            if (vel.x < 0)
                vel.x *= cols.bottom ? chr.stats.switchupSpeed : chr.stats.switchupSpeedAir;
            // Approach characters full speed
            vel.x *= accel; // average
            vel.x += chr.stats.speed;
            vel.x /= accel+1;
        }

        if (!(input.keys.a ^ input.keys.d)) { // Deaccel if neither or both are pressed
            // Approach characters full speed
            vel.x *= chr.stats.deaccel; // average
            vel.x /= chr.stats.deaccel+1;
        }
        Engine.debug(vel.y)
        if (this.coyoteTime > 0 && input.keys[" "] && vel.y >= 0) {
            chr.offset.y -= 1;
            vel.y = -chr.stats.jumpHeight;
            this.coyoteTime = 0;
        }
        if (!input.keys[" "] && vel.y < 0) {
            vel.y *= chr.stats.jumpFalloff
        }

        if (input.keys.s) {
            vel.y += chr.stats.fastFall;
        }

        if (cols.bottom && this.coyoteTime < 0) { // just hit the floor
            vel.x *= chr.stats.landingDeaccel;
        }

        if (cols.bottom) {
            this.coyoteTime = chr.stats.coyoteTime;
        } else {
            this.coyoteTime--;
        }

        if (Math.abs(vel.x) < 0.1)
            chr.aniTree.play("idle");
        else if (cols.bottom) {
            chr.aniTree.play("walk");
            let speed = 25-Math.abs(vel.x) * 5;
            chr.aniTree.currentAnimation.settings.tpf = speed;
        } else {
            chr.aniTree.play("jump");
        }

        chr.aniTree.isFlipped = vel.x < 0;

        if (input.keys["h"] && !this.swordCollision(chr.sword.rotation - 5)) {
            chr.sword.rotation -= 5;
        }
        if (input.keys["k"] && !this.swordCollision(chr.sword.rotation + 5)) {
            chr.sword.rotation += 5;
        }

        let err = 0;

        let swordDir = new Vector(
            Math.cos(chr.sword.rotation/360 * 2 * Math.PI),
            Math.sin(chr.sword.rotation/360 * 2 * Math.PI)
        );
        while (this.swordCollision(chr.sword.rotation) && err++ < 30) {
            if (swordDir.x < 0 && swordDir.y > 0)
                chr.sword.rotation += 1;
            else if (swordDir.x > 0 && swordDir.y > 0)
                chr.sword.rotation -= 1;
            else if (swordDir.x < 0)
                chr.sword.rotation -= 1;
            else
                chr.sword.rotation += 1;

            // repel the character out of the collision
            vel.add(swordDir.scaled(-0.05));
        }
    }

    checkPoint(point) {
        // Check if sword end is inside any rectangle (platforms or other characters)
        let platforms = Node.getNode("CombatScene").platforms;
        for (let platform of platforms) {
            let pos = platform.getGlobalPosition();
            let dim = platform.dimensions;
            if (point.x > pos.x && point.x < pos.x + dim.x &&
                point.y > pos.y && point.y < pos.y + dim.y) {
                return true;
            }
        }
        return false;
    }


    swordCollision(newRotation) {
        let sword = this.character.sword.getGlobalPosition();
        sword.add(new Vector(20, 20)); // Adjust for sword sprite offset
        let swordLength = 75;
        let swordDir = new Vector(
            Math.cos(newRotation/360 * 2 * Math.PI),
            Math.sin(newRotation/360 * 2 * Math.PI)
        );
        let points = 9;
        for (let i=2; i<points; i++) {
            let swordEnd = sword.with(swordDir.scaled(swordLength * (i/points)));
            
        if (this.checkPoint(swordEnd))
            return swordEnd;
        }

        return false;

    }
}