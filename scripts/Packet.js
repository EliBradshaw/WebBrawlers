export default class Packet {
    constructor(type, data) {
        this.type = type; // String indicating the type of packet
        this.data = data; // Payload of the packet
    }

    // Serialize the packet to a JSON string for transmission
    serialize() {
        return JSON.stringify({
            type: this.type,
            data: this.data
        });
    }

    // Deserialize a JSON string back into a Packet object
    static deserialize(jsonString) {
        const obj = JSON.parse(jsonString);
        return new Packet(obj.type, obj.data);
    }
}