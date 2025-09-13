import Character from "../character/Character.js";
import InputDetector from "../InputDetector.js";
import Node from "../library/Node.js";
import Vector from "../library/Vector.js";
import Platform from "../Platform.js";
import PlayerController from "../PlayerController.js";

export default class CombatScene extends Node {
    constructor() {
        super();
        this.platforms = [
            new Platform(800, 50).moveGloballyTo(50, 300)
        ];
        this.characters = [
            new Character(PlayerController).moveGloballyTo(100, 200)
        ];

        this.platforms.forEach(platform => this.adopt(platform));
        this.characters.forEach(character => this.adopt(character));

        this.adopt(new InputDetector());
    }

    update() {
        for (let character of this.characters) {
            character.wipeCols();
            for (let platform of this.platforms) {
                let change = character.considerCollision(platform);
                // if (character.offset.y < change.y)
                //     change.y = character.offset.y;
                character.offset.take(change);
            }
        }
    }

    render(ctx) {
        ctx.fillStyle = "lightblue";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}