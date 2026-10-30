<script setup lang="ts">
import type { Mesure } from "#shared/types/mesure";

const derniere = ref<Mesure | null>(null);
const statut = ref<"connexion" | "connecté" | "déconnecté">("connexion");
let ws: WebSocket | null = null;

const couleurTemperature = computed(() => {
  if (!derniere.value) return "text-slate-400";
  if (derniere.value.temperature > 80) return "text-red-400";
  if (derniere.value.temperature < 40) return "text-blue-400";
  return "text-green-400";
});

onMounted(() => {
  ws = new WebSocket(`ws://${location.host}/_ws`);
  ws.onopen = () => {
    statut.value = "connecté";
    ws?.send("Bonjour serveur");
  };
  ws.onclose = () => {
    statut.value = "déconnecté";
  };
  ws.onmessage = (event) => {
    derniere.value = JSON.parse(event.data) as Mesure;
  };
});

onBeforeUnmount(() => ws?.close());
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
        Mise à jour : {{ new Date(derniere.at).toLocaleTimeString("fr-FR") }}
      </p>
    </div>

    <p v-else class="text-slate-400">En attente de la première mesure…</p>
  </div>
</template>
