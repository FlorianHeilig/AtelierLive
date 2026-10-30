export default defineWebSocketHandler({
  open(peer) {
    peers.add(peer);
    console.log(`Client connecté (${peers.size} au total)`);
  },

  close(peer) {
    peers.delete(peer);
    console.log(`Client déconnecté (${peers.size} au total)`);
  },
});
