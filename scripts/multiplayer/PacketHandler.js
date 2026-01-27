import Engine from "../library/Engine.js";
import Node from "../library/Node.js";
import Vector from "../library/Vector.js";
import CombatScene from "../scenes/CombatScene.js";
import Packet from "./Packet.js";
import {
    PacketTypeNames
} from "./PacketType.js";

export default class PacketHandler extends Node {
    constructor(mp) {
        super();
        this.mp = mp; // Reference to the Multiplayer instance
        Node.tagNode('PacketHandler', this);
        this.usernames = [];
        this.usernameToConnections = {};
    }


    receivePacket(packet, connection) {
        packet = Packet.deserialize(packet);

        // Handle the packet based on its type
        const typeName = PacketTypeNames[packet.type];
        this[`type_${typeName}`](packet.data, connection);
    }

    type_init(data) {
        console.log("Received init packet:", data);
        // Handle init packet
    }

    type_introduce(data, connection) {
        // connection is not passed by default, so we need to get it from Multiplayer
        // We'll assume Multiplayer passes the connection as a second argument
        const username = data.username;
        if (!username) return;
        if (!this.usernames.includes(username)) {
            this.usernames.push(username);
        }
        this.usernameToConnections[username] = connection;
        this.mp.connectionToUsername[connection.peer] = username;
        // Sync with Lobby UI
        const menuScene = Node.getNode('MenuScene');
        if (menuScene) {
            menuScene.updateLobby(this.usernames);
        }
        console.log("Lobby usernames:", this.usernames);
    }

    type_gotoCombat(data, connection) {
        console.log("Received gotoCombat packet:", data);
        // Transition to CombatScene
        const menuScene = Node.getNode('MenuScene');
        if (menuScene) {
            menuScene.active = false;
            Engine.root.adopt(new CombatScene());
        }
    }

    type_updatePosition(data, connection) {
        let { multi, username, x, y } = data;
        // Update the character's position in the game state
        // Implementation depends on how characters are managed
        if (!this.mp.isHost) {
            // Handle multiple characters
            multi.forEach(char => {
                if (char.username == this.mp.username) return;
                // Update character position logic here
                let cs = Node.getNode('CombatScene');
                let chr = cs.connToChar[char.conn.peer];
                if (!chr) cs.addPlayer(char.conn);
                chr = cs.connToChar[char.conn.peer];
                chr.receiveMultiUpdate(char.chM);
            });
            return;
        }
        let cs = Node.getNode('CombatScene');
        let chr = cs.connToChar[connection.peer];
        if (!chr) cs.addPlayer(connection);
        chr = cs.connToChar[connection.peer];
        chr.receiveMultiUpdate(data.chM);
    }
}