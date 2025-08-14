// This class auto-selects its role based on the URL.
// If the URL contains a "?host=HOST_ID" parameter, it joins as a peer.
// Otherwise, it becomes the host and generates an invite link for peers.


import Packet from "./Packet.js";
import PacketType from "./PacketType.js";
import PacketHandler from "./PacketHandler.js";
import Node from "./library/Node.js";

export default class Multiplayer extends Node {
    /**
     * Creates a new P2PChat instance.
     * @param {Object} options - Callback options.
     * @param {Function} options.onHostInit - Called for the host with (inviteLink, hostId).
     * @param {Function} options.onPeerInit - Called for a peer when the connection opens with (connection, peerId).
     * @param {Function} options.onPeerConnected - Called on the host when a new peer connects with (connection).
     * @param {Function} options.onMessage - Called when any message is received.
     * @param {Function} options.onError - Called when an error occurs.
     */
    constructor(options = {}) {
        super();
        this.options = options;
        this.peer = null;
        this.peerId = Math.random();
        this.isHost = false;
        // For host: multiple peer connections.
        this.connections = [];
        // For peer: a single connection.
        this.connection = null;
        // PacketHandler instance
    this.packetHandler = new PacketHandler(this);
    Node.tagNode('Multiplayer', this);

        this.usernames = [];
        this.usernameToConnections = {};
    }

        /**
     * Sends an introduce packet with the current username to the host.
     */
    sendIntroducePacket(conn) {
        let username = document.getElementById('username')?.value || '';
        if (!username) {
            // fallback to cookie
            let nameEQ = 'username=';
            let ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) username = c.substring(nameEQ.length, c.length);
            }
        }
        this.sendPacket(PacketType.introduce, { username }, conn);
    }

    init(doHost) {
        // Get code from URL join
        const jc = document.getElementById('join-code');
        const hostIdFromURL = jc?.value

        if (!doHost) {
            // Act as a peer connecting to a host.
            this.isHost = false;
            this.peer = new Peer();
            this.peer.on('open', (id) => {
                this.connection = this.peer.connect(hostIdFromURL);
                this.connection.on('open', () => {
                    this.sendIntroducePacket(this.connection);
                    if (this.options.onPeerInit) {
                        this.options.onPeerInit(this.connection, id);
                    }
                });
                this.connection.on('data', (packet) => {
                    // Pass received data to PacketHandler
                    this.packetHandler.receivePacket(packet, this.connection);
                    if (this.options.onMessage) {
                        this.options.onMessage(packet);
                    }
                });
                this.connection.on('error', (err) => {
                    if (this.options.onError) {
                        this.options.onError(err);
                    } else {
                        console.error(err);
                    }
                });
            });
            this.peer.on('error', (err) => {
                if (this.options.onError) {
                    this.options.onError(err);
                } else {
                    console.error(err);
                }
            });
        } else {
            // Act as the host.
            this.isHost = true;
            this.peer = new Peer();
            jc.disabled = true;
            jc.value = "Generating code..."
            this.peer.on('open', (id) => {
                jc.disabled = true; // Disable input for host
                jc.value = id;
                if (this.options.onHostInit) {
                    this.options.onHostInit(id);
                }
            });
            // Listen for incoming connections from peers.
            this.peer.on('connection', (conn) => {
                this.connections.push(conn);
                conn.on('open', () => {
                    // Send init packet to the newly connected peer
                    this.sendPacket(PacketType.init, {
                        hostId: this.peerId
                    }, conn);
                    if (this.options.onPeerConnected) {
                        this.options.onPeerConnected(conn);
                    }
                });
                conn.on('data', (packet) => {
                    // Pass received data to PacketHandler
                    this.packetHandler.receivePacket(packet, conn);
                    if (this.isHost) {
                        // Broadcast to all other connected peers.
                        this.connections.forEach(c => {
                            if (c !== conn && c.open) {
                                c.send(packet);
                            }
                        });
                    }
                    if (this.options.onMessage) {
                        this.options.onMessage(packet);
                    }
                });
                conn.on('close', () => {
                    this.connections = this.connections.filter(c => c !== conn);
                });
                conn.on('error', (err) => {
                    if (this.options.onError) {
                        this.options.onError(err);
                    } else {
                        console.error(err);
                    }
                });
            });
            this.peer.on('error', (err) => {
                if (this.options.onError) {
                    this.options.onError(err);
                } else {
                    console.error(err);
                }
            });
        }
    }

    /**
     * Sends a Packet over the established connection(s).
     * For the host, this broadcasts the message to all connected peers unless a specific target is provided.
     * For a peer, it sends data over its single connection.
     * @param {number} type - PacketType enum value.
     * @param {Object} data - Payload for the packet.
     * @param {Peer.DataConnection} [targetConnection] - Optional specific connection to target (host-only).
     */
    sendPacket(type, data, targetConnection = null) {
        const packet = new Packet(type, data);
        const serialized = packet.serialize();
        if (this.isHost) {
            if (targetConnection) {
                if (targetConnection.open) {
                    targetConnection.send(serialized);
                }
            } else {
                this.connections.forEach(conn => {
                    if (conn.open) {
                        conn.send(serialized);
                    }
                });
            }
        } else {
            if (this.connection && this.connection.open) {
                this.connection.send(serialized);
            } else {
                console.warn('No open connection to send data.');
            }
        }
    }

    /**
     * Closes all connections and destroys the peer.
     */
    close() {
        if (this.isHost) {
            this.connections.forEach(conn => conn.close());
            this.connections = [];
        } else {
            if (this.connection) {
                this.connection.close();
            }
        }
        if (this.peer) {
            this.peer.destroy();
        }
    }
}