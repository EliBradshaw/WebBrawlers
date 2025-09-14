import Vector from "./Vector.js";

export default class Node {
    /** @type {Map<string, Node>} */
    static tagMap = {}; 
    static tagNode(tag, node) {
        this.tagMap[tag] = node;
    }

    static getNode(tag) {
        return this.tagMap[tag];
    }
    constructor() {
        this.offset = new Vector();
        this.children = [];
        this.parent = null;
    }

    nudge(vec, y) {
        if (typeof vec != "object")
            vec = new Vector(vec, y);
        this.offset.add(vec);
        return this;
    }

    moveGloballyTo(vec, y) {
        if (typeof vec != "object")
            vec = new Vector(vec, y);
        let currentPos = this.getGlobalPosition();
        let diff = vec.without(currentPos);
        this.offset.add(diff);
        return this;
    }

    /** Returns the global position of this node by adding up all parent offsets. Can be costly if this has many parents */
    getGlobalPosition() {
        let pos = this.offset.clone();
        let current = this.parent;
        while (current) {
            pos.add(current.offset);
            current = current.parent;
        }
        return pos;
    }

    /** Adds a child node and sets its parent to this node */
    adopt(child) {
        this.children.push(child);
        child.parent = this;
        return this;
    }

    /** Removes a child node from this node */
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    /** Removes this node from its parent and sets its parent to null, recur = do the same for all children */
    orphan(recur = false) {
        this.parent.removeChild(this);
        this.parent = null;
        if (!recur) return;
        for (let node of this.children) {
            node.orphan(true);
        }
    }

    tick(ctx) {
        this.update();
        this.render(ctx);
        for (let child of this.children) {
            child.tick(ctx);
        }
    }

    update() {

    }

    render(ctx, ui) {
        
    }
}