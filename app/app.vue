<script setup lang="ts">
const temperature = ref<number>(65);

function chauffer() {
  temperature.value += 5;
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 p-8 text-white">
    <h1 class="mb-6 text-2xl font-bold">Atelier Live</h1>

    <div class="w-64 rounded-xl bg-slate-800 p-6 shadow-lg">
      <h2 class="text-sm uppercase text-slate-400">Presse-01</h2>
      <p
        class="my-2 text-4xl font-bold"
        :class="temperature > 80 ? 'text-red-400' : 'text-green-400'"
      >
        {{ temperature }} °C
      </p>
      <button
        @click="chauffer"
        class="rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-500"
      >
        +5 °C
      </button>
    </div>
  </div>
</template>
