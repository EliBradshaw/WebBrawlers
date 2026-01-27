import Controller from "./character/Controller.js";
import Engine from "./library/Engine.js";
import Node from "./library/Node.js";

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
        if (this.coyoteTime > 0 && input.keys[" "]) {
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

        // Make sword follow mouse
        let mouse = this.input.mouse;
        let chrPos = chr.getGlobalPosition().with(chr.dimensions.scaled(0.5));
        let dir = mouse.without(chrPos);
        let angle = Math.atan2(dir.y, dir.x) * 180 / Math.PI;
        chr.sword.rotation = angle;
    }
}