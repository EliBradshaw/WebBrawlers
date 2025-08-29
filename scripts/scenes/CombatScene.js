import Character from "../character/Character.js";
import Node from "../library/Node.js";
import Vector from "../library/Vector.js";
import Platform from "../Platform.js";
import PlayerController from "../PlayerController.js";

export default class CombatScene extends Node {
    constructor() {
        super();
        this.platforms = [
            new Platform(800, 50).moveGloballyTo(50, 750)
        ];
        this.characters = [
            new Character(PlayerController).moveGloballyTo(100, 500)
        ];

        this.platforms.forEach(platform => this.adopt(platform));
        this.characters.forEach(character => this.adopt(character));
    }

    update() {
        for (let platform of this.platforms) {
            for (let character of this.characters) {
                character.considerCollision(platform);
            }
        }
    }

    render(ctx) {
        ctx.fillStyle = "lightblue";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}