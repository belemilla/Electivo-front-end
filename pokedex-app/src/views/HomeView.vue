<template>
  <div class="home">
    <div v-if="favorites.length > 0" class="favorites-section">
      <h2>Mis Favoritos</h2>
      <div class="pokemon-grid">
        <PokemonCard
          v-for="fav in favorites"
          :key="fav.name"
          :pokemon="fav"
          @viewDetail="goToDetail(fav.name)"
        />
      </div>
    </div>
    <hr v-if="favorites.length > 0" />

    <h2>Lista de Pokémon</h2>
    <input
      type="text"
      v-model="searchTerm"
      placeholder="Buscar Pokémon..."
      class="search-bar"
    />

    <div v-if="loading && pokemons.length === 0">Cargando Pokémon...</div>

    <div class="pokemon-grid">
      <PokemonCard
        v-for="pokemon in filteredPokemons"
        :key="pokemon.name"
        :pokemon="pokemon"
        @viewDetail="goToDetail(pokemon.name)"
      />
    </div>

    <div v-if="loading" class="loading-more">Cargando más...</div>
  </div>
</template>

<script setup>
import PokemonCard from "../components/PokemonCard.vue";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const pokemons = ref([]);
const loading = ref(true);
const favorites = ref([]);
const router = useRouter();
const searchTerm = ref("");

const filteredPokemons = computed(() => {
  if (!searchTerm.value) {
    return pokemons.value;
  }
  return pokemons.value.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// --- LÓGICA OPTIMIZADA PARA CARGAR POR LOTES ---
const fetchPokemonInBatches = async (pokemonList) => {
  const batchSize = 20; // Haremos peticiones en grupos de 20
  for (let i = 0; i < pokemonList.length; i += batchSize) {
    const batch = pokemonList.slice(i, i + batchSize);
    const detailPromises = batch.map(async (p) => {
      const res = await fetch(p.url);
      const details = await res.json();
      return {
        name: details.name,
        image: details.sprites.front_default,
      };
    });
    const batchDetails = await Promise.all(detailPromises);
    pokemons.value.push(...batchDetails); // Añadimos el lote al array
  }
};

onMounted(async () => {
  const savedFavorites = localStorage.getItem("pokemonFavorites");
  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites);
  }

  try {
    loading.value = true;
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await response.json();
    await fetchPokemonInBatches(data.results); // Llamamos a la nueva función
  } catch (error) {
    console.error("Error fetching Pokémon list:", error);
  } finally {
    loading.value = false;
  }
});

const goToDetail = (name) => {
  router.push({ name: "pokemon-detail", params: { name } });
};
</script>

<style scoped>
.search-bar {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  margin-bottom: 2rem;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}
.favorites-section {
  margin-bottom: 2rem;
}
hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 2rem 0;
}
.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}
.loading-more {
  text-align: center;
  padding: 2rem;
  font-style: italic;
  color: #888;
}
</style>
