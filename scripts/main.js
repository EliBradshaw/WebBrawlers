import Engine from "./library/Engine.js";
import MenuScene from "./MenuScene.js";
import Multiplayer from "./Multiplayer.js";


let multiplayer = new Multiplayer({
    onHost: (hostId) => {
        console.log(`Host initialized with ID: ${hostId}`);
    },
    onPeerInit: (connection, peerId) => {
        console.log(`Peer initialized with ID: ${peerId}`);
    },
    onPeerConnected: (connection) => {
        console.log(`Peer connected: ${connection.id}`);
    },
    onMessage: (data) => {
        console.log(`Received message: ${data}`);
    },
    onError: (err) => {
        console.error(err);
    },
});


Engine.init();
Engine.root.adopt(new MenuScene(multiplayer));