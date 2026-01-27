let i = 0;
const PacketType = {
    init: i++,
    disconnect: i++,
    chatMessage: i++,
    move: i++,
    introduce: i++, // Peer introduces their username
    gotoCombat: i++, // Signal to go to combat scene
    updatePosition: i++, // Update player position
};
export const PacketTypeNames = Object.keys(PacketType);
export default PacketType;