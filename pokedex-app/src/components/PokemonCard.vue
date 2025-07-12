<template>
  <div class="pokemon-card" @click="selectPokemon">
    <img :src="pokemon.image" :alt="pokemon.name" />
    <h3>{{ pokemon.name }}</h3>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  pokemon: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["viewDetail"]);

const selectPokemon = () => {
  emit("viewDetail");
};
</script>

<style scoped>
.pokemon-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  background-color: white;
  text-transform: capitalize;
}
.pokemon-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}
.pokemon-card img {
  width: 96px;
  height: 96px;
  /* <-- AÑADIMOS DE NUEVO EL ESTILO PARA PIXEL ART */
  image-rendering: pixelated;
}
</style>
