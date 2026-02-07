import Animation from "../library/animation/Animation.js";
import AnimationTree from "../library/animation/AnimationTree.js";
import MovingNode from "../library/MovingNode.js";
import Node from "../library/Node.js";
import Sprite from "../library/Sprite.js";
import Vector from "../library/Vector.js";
import Controller from "./Controller.js";

export default class Character extends MovingNode {
    constructor(controllerClass) {
        super();
        this.controllerClass = controllerClass;
        this.controller = new controllerClass(this);
        this.dimensions = new Vector(12, 35);
        this.velocity = new Vector();

        this.stats = {
            acceleration: 30, // frames until full values are reached
            airAcceleration: 25,
            deaccel: 2,
            landingDeaccel: 1.5, // % left after landing
            fastFall: 0.25,

            switchupSpeed: 0.8, // % taken off speed when velx is opposite as wanted
            switchupSpeedAir : 1,
            speed: 4,

            jumpFalloff: 0.9, // % taken off y when jump is not held and still going up
            jumpHeight: 10,
            gravity: 0.4,
            coyoteTime: 10 // frames after leaving a platform where jump is still allowed
        }

        this.colFlags = {
            top: false,
            bottom: false,
            left: false,
            right: false
        };
        this.aniTree = null;
        this.adopt(this.aniTree = new AnimationTree(
            new Animation({
                path: "player_idle",
                frames: 2,
                title: "idle",
                tpf: 40,
                scale: 3,
            }).nudge(0, 2),
            new Animation({
                path: "player_walk",
                frames: 4,
                title: "walk",
                tpf: 5,
                scale: 3,
            }).nudge(0, 2),
            new Animation({
                path: "player_jump",
                frames: 6,
                title: "jump",
                tpf: 10,
                scale: 3,
            }).nudge(0, 2),
        ).nudge(-20, -13));
        this.aniTree.play("walk");

        this.adopt(this.sword = new Sprite("sword.png", 0.05, 45, new Vector(1, 1)).nudge(-15, 0));
    }

    update() {
        if (this.controllerClass == Controller) // Assume dummy controller for puppets
            return;
        this.controller.update();
    } 

    render(ctx) {
        return; // Rendering is handled by the player sprite
        let pos = this.getGlobalPosition();
        ctx.fillStyle = "red";
        ctx.fillRect(pos.x, pos.y, this.dimensions.x, this.dimensions.y);
    }

    getMultiUpdate() {
        let pos = this.getGlobalPosition();
        let facing = this.aniTree.isFlipped;
        let currentAnim = this.aniTree.currentAnimation.settings.title;
        let currentFrame = this.aniTree.currentAnimation.currentFrame;
        let swordRotation = this.sword.rotation;
        return {
            x: pos.x,
            y: pos.y,
            facing,
            currentAnim,
            currentFrame,
            swordRotation
        };
    }

    receiveMultiUpdate(data) {
        this.setGlobalPosition(new Vector(data.x, data.y));
        let anim = this.aniTree.animations[data.currentAnim];
        if (anim) {
            this.aniTree.play(anim.settings.title);
        }
        this.aniTree.currentAnimation.currentFrame = data.currentFrame;
        this.aniTree.isFlipped = data.facing;
        this.sword.rotation = data.swordRotation;
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
        this.offset.y += 1;
        if (!col.collidesWithBox(this)) return change;
        this.offset.y -= 1;

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