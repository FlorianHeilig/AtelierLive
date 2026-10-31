import postgres from "postgres";

let client: postgres.Sql | null = null;

export function useDb() {
  if (!client) {
    client = postgres(useRuntimeConfig().databaseUrl);
  }
  return client;
}
