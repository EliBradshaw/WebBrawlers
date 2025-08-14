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
        this.children = [];
        this.parent = null;
    }

    adopt(child) {
        this.children.push(child);
        child.parent = this;
        return this;
    }

    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

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