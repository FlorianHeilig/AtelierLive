import type { Mesure } from "#shared/types/mesure";

export default defineNitroPlugin((nitroApp) => {
  const sql = useDb();
  let temperature = 65;

  const timer = setInterval(async () => {
    temperature += Math.round((Math.random() - 0.5) * 6);
    temperature = Math.min(95, Math.max(30, temperature));

    const mesure: Mesure = {
      machine: "Presse-01",
      temperature,
      enMarche: Math.random() > 0.1,
      at: new Date().toISOString(),
    };

    // 1. Diffusion en direct, en premier
    for (const peer of peers) {
      peer.send(JSON.stringify(mesure));
    }

    // 2. Enregistrement en base
    try {
      await sql`
        INSERT INTO mesures (machine, temperature, en_marche, at)
        VALUES (${mesure.machine}, ${mesure.temperature}, ${mesure.enMarche}, ${mesure.at})
      `;
    } catch (erreur) {
      console.error("Échec de l’enregistrement de la mesure :", erreur);
    }
  }, 2000);

  nitroApp.hooks.hook("close", async () => {
    clearInterval(timer);
    await sql.end();
  });
});
