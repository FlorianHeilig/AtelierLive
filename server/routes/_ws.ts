export default defineWebSocketHandler({
  open(peer) {
    console.log("Client connecté :", peer.id);
  },

  message(peer, message) {
    console.log("Message reçu :", message.text());
    peer.send(`Le serveur a bien reçu : ${message.text()}`);
  },

  close(peer) {
    console.log("Client déconnecté :", peer.id);
  },
});
