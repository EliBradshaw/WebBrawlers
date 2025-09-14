import Node from "../Node.js";

export default class AnimationTree extends Node {
    constructor(...animations) {
        super();
        this.animations = {};
        this.currentAnimation = null;


        for (let anim of animations) {
            this.adopt(anim);
        }
        console.log(this.animations, animations);
    }

    adopt(animation) {
        super.adopt(animation);
        this.animations[animation.settings.title] = animation;
    }

    play(title) {
        if (title === this.currentAnimation?.settings.title) return; // already playing
        if (this.animations[title]) {
            this.animations[title].reset();
            this.currentAnimation = this.animations[title];
        } else {
            console.warn(`Animation with title "${title}" not found.`);
        }
    }

    set isFlipped(isFlipped) {
        if (this.currentAnimation) {
            this.currentAnimation.isFlipped = isFlipped;
        }
    }

    get isFlipped() {
        return this.currentAnimation ? this.currentAnimation.isFlipped : null;
    }

    render(ctx) {
        this.currentAnimation.doRender(ctx);
    }
}