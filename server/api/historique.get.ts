import type { Mesure } from "#shared/types/mesure";

type LigneMesure = {
  machine: string;
  temperature: number;
  en_marche: boolean;
  at: Date;
};

export default defineEventHandler(async (): Promise<Mesure[]> => {
  const sql = useDb();

  const lignes = await sql<LigneMesure[]>`
    SELECT machine, temperature, en_marche, at
    FROM mesures
    WHERE machine = ${"Presse-01"}
    ORDER BY at DESC
    LIMIT 20
    `;

  return lignes.map((lignes) => ({
    machine: lignes.machine,
    temperature: lignes.temperature,
    enMarche: lignes.en_marche,
    at: lignes.at.toISOString(),
  }));
});
