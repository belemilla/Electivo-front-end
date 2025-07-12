<template>
  <div class="pokemon-detail-container">
    <div class="button-bar">
      <button @click="$router.back()" class="back-button">← Volver</button>
      <button @click="toggleLanguage" class="language-button">
        Ver en {{ language === "es" ? "Inglés" : "Español" }}
      </button>
    </div>

    <div v-if="loading">Cargando detalles...</div>

    <div
      v-else-if="pokemon"
      class="detail-card"
      :style="{ borderColor: typeColor }"
    >
      <div class="card-content">
        <div class="left-column">
          <h2 class="pokemon-name">{{ pokemon.name }}</h2>
          <div class="image-container">
            <img
              :src="pokemon.sprites.front_default"
              :alt="pokemon.name"
              class="pokemon-image"
            />
          </div>
        </div>

        <div class="right-column">
          <div class="info-section">
            <h4>{{ language === "es" ? "Tipos" : "Types" }}:</h4>
            <div class="types-container">
              <span
                v-for="typeInfo in pokemon.types"
                :key="typeInfo.type.name"
                class="type-badge"
                :style="{ backgroundColor: getTypeColor(typeInfo.type.name) }"
              >
                {{ translateType(typeInfo.type.name) }}
              </span>
            </div>
          </div>

          <div class="info-section">
            <h4>
              {{ language === "es" ? "Estadísticas Base" : "Base Stats" }}:
            </h4>
            <ul class="stats-list">
              <li v-for="statInfo in pokemon.stats" :key="statInfo.stat.name">
                <span class="stat-name">{{
                  translateStat(statInfo.stat.name)
                }}</span>
                <div class="stat-bar-container">
                  <div
                    class="stat-bar"
                    :style="{
                      width: getStatPercentage(statInfo.base_stat) + '%',
                    }"
                  ></div>
                </div>
                <span class="stat-value">{{ statInfo.base_stat }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

const pokemon = ref(null);
const loading = ref(true);
const route = useRoute();
const language = ref("es");

const typeTranslations = {
  grass: "Planta",
  poison: "Veneno",
  fire: "Fuego",
  flying: "Volador",
  water: "Agua",
  bug: "Bicho",
  normal: "Normal",
  electric: "Eléctrico",
  ground: "Tierra",
  fighting: "Lucha",
  psychic: "Psíquico",
  rock: "Roca",
  ice: "Hielo",
  ghost: "Fantasma",
  dragon: "Dragón",
  steel: "Acero",
  dark: "Siniestro",
  fairy: "Hada",
};
const statTranslations = {
  hp: "PS",
  attack: "Ataque",
  defense: "Defensa",
  "special-attack": "Ataque Especial",
  "special-defense": "Defensa Especial",
  speed: "Velocidad",
};

const translateType = (typeName) => {
  return language.value === "es"
    ? typeTranslations[typeName] || typeName
    : typeName;
};
const translateStat = (statName) => {
  return language.value === "es"
    ? statTranslations[statName] || statName
    : statName;
};
const toggleLanguage = () => {
  language.value = language.value === "es" ? "en" : "es";
};

const typeColors = {
  grass: "#78C850",
  poison: "#A040A0",
  fire: "#F08030",
  flying: "#A890F0",
  water: "#6890F0",
  bug: "#A8B820",
  normal: "#A8A878",
  electric: "#F8D030",
  ground: "#E0C068",
  fighting: "#C03028",
  psychic: "#F85888",
  rock: "#B8A038",
  ice: "#98D8D8",
  ghost: "#705898",
  dragon: "#7038F8",
  steel: "#B8B8D0",
  dark: "#705848",
  fairy: "#EE99AC",
};

const getTypeColor = (typeName) => typeColors[typeName] || "#68A090";

const typeColor = computed(() => {
  if (pokemon.value && pokemon.value.types.length > 0) {
    return getTypeColor(pokemon.value.types[0].type.name);
  }
  return "#ddd";
});

const getStatPercentage = (baseStat) => {
  const maxStat = 150;
  return (baseStat / maxStat) * 100;
};

onMounted(async () => {
  try {
    const pokemonName = route.params.name;
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    pokemon.value = await response.json();
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.pokemon-detail-container {
  width: 100%;
}
.button-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.back-button,
.language-button {
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}
.back-button {
  background-color: #4a90e2;
  color: white;
}
.language-button {
  background-color: #555;
  color: white;
}
.detail-card {
  background: white;
  border-width: 3px;
  border-style: solid;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: border-color 0.5s ease;
}
.card-content {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}
.left-column,
.right-column {
  flex: 1;
  min-width: 250px;
}
.pokemon-name {
  text-align: center;
  margin-top: 0;
  font-size: 2.5rem;
  text-transform: capitalize;
  color: #333;
}
.image-container {
  background-color: #f2f2f2;
  border-radius: 50%;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  margin: 1rem auto;
}
.pokemon-image {
  width: 180px;
  height: 180px;
  image-rendering: pixelated;
} /* <-- AÑADIMOS DE NUEVO EL ESTILO PARA PIXEL ART */
.info-section {
  margin-bottom: 1.5rem;
}
.info-section h4 {
  margin-bottom: 0.5rem;
  color: #555;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}
.types-container {
  display: flex;
  gap: 10px;
}
.type-badge {
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 0.9rem;
  text-transform: capitalize;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.stats-list {
  list-style: none;
  padding: 0;
}
.stats-list li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  text-transform: capitalize;
}
.stat-name {
  width: 140px;
  font-weight: bold;
  font-size: 0.9rem;
}
.stat-bar-container {
  flex-grow: 1;
  background-color: #e0e0e0;
  border-radius: 5px;
  height: 20px;
  overflow: hidden;
}
.stat-bar {
  height: 100%;
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-color: #4a90e2;
  border-radius: 5px;
  transition: width 0.5s ease-in-out;
}
.stat-value {
  width: 40px;
  text-align: right;
  font-weight: bold;
}
</style>
