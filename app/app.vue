<script setup lang="ts">
const temperature = ref<number>(65);

function chauffer() {
  temperature.value += 5;
}
</script>

<template>
  <div>
    <h1>Atelier Live</h1>
    <p>Presse-01 : {{ temperature }} °C</p>
    <button @click="chauffer">+5 °C</button>
  </div>
</template>
