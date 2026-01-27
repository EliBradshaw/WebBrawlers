import Character from "../character/Character.js";
import Controller from "../character/Controller.js";
import InputDetector from "../InputDetector.js";
import Node from "../library/Node.js";
import Vector from "../library/Vector.js";
import Multiplayer from "../multiplayer/Multiplayer.js";
import PacketType from "../multiplayer/PacketType.js";
import Platform from "../Platform.js";
import PlayerController from "../PlayerController.js";

export default class CombatScene extends Node {
    constructor() {
        super();
        this.platforms = [
            new Platform(800, 50).moveGloballyTo(50, 300),
            new Platform(100, 10).moveGloballyTo(200, 200).mod({passThrough: true}),
            new Platform(100, 10).moveGloballyTo(500, 200),
        ];
        this.characters = [
            new Character(PlayerController).moveGloballyTo(100, 200)
        ];

        this.connToChar = {};

        this.platforms.forEach(platform => this.adopt(platform));
        this.characters.forEach(character => this.adopt(character));

        /** @type {Multiplayer} */
        this.mp = Node.getNode('Multiplayer');

        this.adopt(new InputDetector());
        Node.tagNode('CombatScene', this);
    }

    addPlayer(connection) {
        let chr = new Character(Controller).moveGloballyTo(100, 200);
        this.characters.push( // new puppet character
            chr
        )
        this.connToChar[connection.peer] = chr;
        this.adopt(chr);
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
        // Let the host know my position
        if (this.mp.isHost) {
            this.mp.sendPacket(
                PacketType.updatePosition,
                {
                    multi: [...this.mp.connections.map(conn => {
                        let chr = this.connToChar[conn.peer];
                        if (!chr) this.addPlayer(conn);
                        chr = this.connToChar[conn.peer];
                        return {
                            conn: {peer: conn.peer},
                            username: this.mp.connectionToUsername[conn.peer],
                            chM: chr.getMultiUpdate()
                        }
                    }), // Now include the host
                    {
                        conn: {peer: this.mp.peer.peer},
                        username: this.mp.username,
                        chM: this.characters[0].getMultiUpdate()
                    }
                    ]   
                }
            );
        } else {
            let playerChar = this.characters[0];
            this.mp.sendPacket(
                PacketType.updatePosition,
                {
                    username: this.mp.username,
                    chM: playerChar.getMultiUpdate()
                }
            );
        }
    }

    render(ctx) {
        ctx.fillStyle = "lightblue";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}