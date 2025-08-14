let i = 0;
const PacketType = {
    init: i++,
    disconnect: i++,
    chatMessage: i++,
    move: i++,
    introduce: i++, // Peer introduces their username
};
export const PacketTypeNames = Object.keys(PacketType);
export default PacketType;