import Engine from "./library/Engine.js";
import Multiplayer from "./multiplayer/Multiplayer.js";
import MenuScene from "./scenes/MenuScene.js";



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
        
    },
    onError: (err) => {
        console.error(err);
    },
});


Engine.init();
Engine.root.adopt(new MenuScene(multiplayer));