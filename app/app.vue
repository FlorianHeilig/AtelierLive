<script setup lang="ts">
import type { Mesure } from "#shared/types/mesure";

const { data: historique, refresh } = await useFetch<Mesure[]>(
  "/api/historique",
  {
    default: () => [],
  },
);

const derniere = ref<Mesure | null>(historique.value[0] ?? null);
const statut = ref<"connexion" | "connecté" | "déconnecté">("connexion");

let ws: WebSocket | null = null;
let tentatives = 0;
let dejaConnecte = false;
let fermetureVolontaire = false;
let timerReconnexion: ReturnType<typeof setTimeout> | null = null;

const couleurTemperature = computed(() => {
  if (!derniere.value) return "text-slate-400";
  if (derniere.value.temperature > 80) return "text-red-400";
  if (derniere.value.temperature < 40) return "text-blue-400";
  return "text-green-400";
});

function formaterHeure(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR");
}

function connecter() {
  statut.value = "connexion";
  const protocole = location.protocol === "https:" ? "wss" : "ws";
  ws = new WebSocket(`${protocole}://${location.host}/_ws`);

  ws.onopen = async () => {
    statut.value = "connecté";
    tentatives = 0;

    if (dejaConnecte) {
      await refresh();
      derniere.value = historique.value[0] ?? derniere.value;
    }
    dejaConnecte = true;
  };

  ws.onmessage = (event) => {
    const mesure = JSON.parse(event.data) as Mesure;
    derniere.value = mesure;
    historique.value = [mesure, ...historique.value].slice(0, 20);
  };

  ws.onclose = () => {
    statut.value = "déconnecté";
    if (fermetureVolontaire) return;

    const delai = Math.min(1000 * 2 ** tentatives, 30_000);
    tentatives++;
    console.log(`Reconnexion dans ${delai / 1000} s (tentative ${tentatives})`);
    timerReconnexion = setTimeout(connecter, delai);
  };
}

onMounted(connecter);

onBeforeUnmount(() => {
  fermetureVolontaire = true;
  if (timerReconnexion) clearTimeout(timerReconnexion);
  ws?.close();
});
</script>

<template>
  <div class="min-h-screen bg-slate-900 p-8 text-white">
    <h1 class="mb-2 text-2xl font-bold">Atelier Live</h1>
    <p class="mb-6 text-sm text-slate-400">WebSocket : {{ statut }}</p>

    <div v-if="derniere" class="w-64 rounded-xl bg-slate-800 p-6 shadow-lg">
      <div class="flex items-center justify-between">
        <h2 class="text-sm uppercase text-slate-400">{{ derniere.machine }}</h2>
        <span
          class="rounded-full px-2 py-0.5 text-xs"
          :class="derniere.enMarche ? 'bg-green-600' : 'bg-red-600'"
        >
          {{ derniere.enMarche ? "En marche" : "Arrêt" }}
        </span>
      </div>
      <p class="my-2 text-4xl font-bold" :class="couleurTemperature">
        {{ derniere.temperature }} °C
      </p>
      <p class="text-xs text-slate-500">
        Mise à jour : {{ formaterHeure(derniere.at) }}
      </p>
    </div>
    <p v-else class="text-slate-400">En attente de la première mesure…</p>
    <div class="mt-8 max-w-xl rounded-xl bg-slate-800 p-6">
      <h2 class="mb-4 text-lg font-bold">Historique</h2>
      <table class="w-full text-left text-sm">
        <thead class="text-slate-400">
          <tr>
            <th class="pb-2">Heure</th>
            <th class="pb-2">Température</th>
            <th class="pb-2">État</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="mesure in historique"
            :key="mesure.at"
            class="border-t border-slate-700"
          >
            <td class="py-1">{{ formaterHeure(mesure.at) }}</td>
            <td class="py-1">{{ mesure.temperature }} °C</td>
            <td
              class="py-1"
              :class="mesure.enMarche ? 'text-green-400' : 'text-red-400'"
            >
              {{ mesure.enMarche ? "En marche" : "Arrêt" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
