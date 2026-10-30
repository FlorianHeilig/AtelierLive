import type { Mesure } from "~~/shared/types/mesure";

export default defineNitroPlugin((nitroApp) => {
  let temperature = 65;

  const timer = setInterval(() => {
    temperature += Math.round((Math.random() - 0.5) * 6);
    temperature = Math.min(95, Math.max(30, temperature));

    const mesure: Mesure = {
      machine: "Presse-01",
      temperature,
      enMarche: Math.random() > 0.1,
      at: new Date().toISOString(),
    };
    console.log(`Mesure ${temperature} °C envoyée à ${peers.size} client(s)`);
    for (const peer of peers) {
      peer.send(JSON.stringify(mesure));
    }
  }, 2000);

  nitroApp.hooks.hook("close", () => clearInterval(timer));
});
