import Node from "./library/Node.js";
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
        // Sync with Lobby UI
        const menuScene = Node.getNode('MenuScene');
        if (menuScene && typeof menuScene.updateLobby === 'function') {
            menuScene.updateLobby(this.usernames);
        }
        console.log("Lobby usernames:", this.usernames);
    }
}