import Engine from "./library/Engine.js";
import Node from "./library/Node.js";

class Button {
    constructor(text, onClick) {
        this.text = text;
        this.onClick = onClick;
        this.html = null;
    }

    appendSelfTo(parent) {
        const button = document.createElement("button");
        this.html = button;
        button.textContent = this.text;
        button.classList.add("menu-button");

        button.onclick = this.onClick;
        parent.appendChild(button);
    }
}

export default class MenuScene extends Node {
    constructor(mp) {
        super();

        this.active = true;
        this.html = null;
        this.mp = mp;
        this.createHtml();
        Node.tagNode("MenuScene", this);

    }

        /**
     * Updates the lobby user list in the UI.
     * @param {string[]} usernames
     */
    updateLobby(usernames) {
        const ul = this.lobbyDiv.querySelector("#lobby-users");
        ul.innerHTML = "";
        usernames.forEach(name => {
            const li = document.createElement("li");
            li.textContent = name;
            ul.appendChild(li);
        });
    }

    createHtml() {
        const menuWidth = 300;
        const menuHeight = 200;

        // Username input
        let usernameInput = document.createElement("input");
        usernameInput.type = "text";
        usernameInput.id = "username";
        usernameInput.classList.add("username-input");
        usernameInput.placeholder = "Enter username";

        // Generate random username
        function getRandomUsername() {
            return "User" + Math.floor(10000 + Math.random() * 90000);
        }

        // Cookie helpers
        function setCookie(name, value, days = 365) {
            let expires = "";
            if (days) {
                const date = new Date();
                date.setTime(date.getTime() + (days*24*60*60*1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "")  + expires + "; path=/";
        }
        function getCookie(name) {
            let nameEQ = name + "=";
            let ca = document.cookie.split(';');
            for(let i=0;i < ca.length;i++) {
                let c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }

        // Set username from cookie or random
        let username = getCookie("username") || getRandomUsername();
        usernameInput.value = username;
        setCookie("username", username);

        // Update cookie on change
        usernameInput.addEventListener("input", (e) => {
            setCookie("username", e.target.value);
        });

    // Add username input to menu
    this.html = document.createElement("div");
    this.html.classList.add("menu-scene");
    this.html.appendChild(usernameInput);

    // Lobby UI
    this.lobbyDiv = document.createElement("div");
    this.lobbyDiv.classList.add("lobby-list");
    this.lobbyDiv.innerHTML = `<h3>Lobby</h3><ul id="lobby-users"></ul>`;
    this.html.appendChild(this.lobbyDiv);

        let joinInput = document.createElement("input");

        let Host = new Button("Host Game", () => {
            console.log("Hosting game...");
            this.mp.init(true);
            // Logic to host a game
        });
        Host.appendSelfTo(this.html);

        let Join = new Button("Join Game", () => {
            console.log("Joining game...");
            this.mp.init(false);
            // Logic to join a game
        });
        Join.appendSelfTo(this.html);

        // Input for joining a game
        joinInput.type = "text";
        joinInput.placeholder = "Enter game code";
        joinInput.id = "join-code";
        joinInput.classList.add("join-input");
        this.html.appendChild(joinInput);
        
        Engine.ui.appendChild(this.html);
    }

    render(_) {
        if (!this.active) {

        }
    }
}