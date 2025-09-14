import Engine from "../Engine.js";
import Node from "../Node.js";

export default class Animation extends Node {
    /** Settings:
     * - Path (path): relative to images directory
     * - Frame count (frames): number of frames to this image
     * - Title (title): Base name of every image
     * - Ticks per frame (tpf): speed of animation
     */
    constructor(newSettings) {
        super();
        this.settings = { // defaults
            path: 'unknown',
            frames: 1,
            title: '',
            tpf: 1,
            scale: 1,
        };
        for (let key in this.settings) {
            this.settings[key] = newSettings[key] || this.settings[key];
        }

        this.images = [];
        this.imagesLoaded = 0;
        this.allImagesLoaded = false;

        for (let i = 0; i < this.settings.frames; i++) {
            let img = new Image();
            img.onload = () => {
                this.imagesLoaded++;
                if (this.imagesLoaded === this.settings.frames) {
                    this.allImagesLoaded = true;
                }
            };
            img.src = `images/${this.settings.path}/${this.settings.title}${i}.png`;
            this.images.push(img);
        }

        this.isFlipped = true; // Default to not flipped
        this.ticksSoFar = 0;
        this.currentFrame = 0;
    }

    reset() {
        this.ticksSoFar = 0;
        this.currentFrame = 0;
        this.isFlipped = false;
    }

    // Named differently so it is not called automatically
    doRender(ctx) {
        if (!this.allImagesLoaded) return; // Wait for images to load

        let pos = this.getGlobalPosition();
        let frame = this.currentFrame;
        const img = this.images[frame];
        const scale = this.settings.scale || 1;
        ctx.imageSmoothingEnabled = false;

        ctx.save();
        if (this.isFlipped) {
            ctx.translate(pos.x + img.width * scale, pos.y);
            ctx.scale(-1, 1);
            ctx.drawImage(
                img,
                0,
                0,
                img.width * scale,
                img.height * scale
            );
        } else {
            ctx.drawImage(
                img,
                pos.x,
                pos.y,
                img.width * scale,
                img.height * scale
            );
        }
        ctx.restore();
        this.ticksSoFar++;
        if (this.ticksSoFar >= this.settings.tpf) {
            this.currentFrame++;
            this.currentFrame %= this.settings.frames;
            this.ticksSoFar = 0;
        }
    }
}