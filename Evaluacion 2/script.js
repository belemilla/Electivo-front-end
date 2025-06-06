// Configuración de Pokémon por región con nombres correctos
const regionPokemon = {
    kanto: [
        { id: 1, name: 'bulbasaur' },    // Bulbasaur
        { id: 4, name: 'charmander' },   // Charmander  
        { id: 7, name: 'squirtle' }      // Squirtle
    ],
    johto: [
        { id: 152, name: 'chikorita' },  // Chikorita
        { id: 155, name: 'cyndaquil' },  // Cyndaquil
        { id: 158, name: 'totodile' }    // Totodile
    ],
    hoenn: [
        { id: 252, name: 'treecko' },    // Treecko
        { id: 255, name: 'torchic' },    // Torchic
        { id: 258, name: 'mudkip' }      // Mudkip
    ]
};

// Variables globales
let chosenPokemon = new Set();
let choices = [];

// Elementos del DOM
const trainerNameInput = document.getElementById('trainerName');
const regionSelect = document.getElementById('regionSelect');
const pokemonContainer = document.getElementById('pokemonContainer');
const regionTitle = document.getElementById('regionTitle');
const choicesList = document.getElementById('choicesList');
const resetBtn = document.getElementById('resetBtn');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔬 Laboratorio Pokémon Virtual iniciado correctamente');
    
    // Agregar event listeners
    regionSelect.addEventListener('change', handleRegionChange);
    resetBtn.addEventListener('click', resetAllChoices);
});

// Función para manejar cambio de región
async function handleRegionChange() {
    const selectedRegion = regionSelect.value;
    
    console.log('Región seleccionada:', selectedRegion);
    
    if (!selectedRegion) {
        pokemonContainer.innerHTML = '<div class="loading">Selecciona una región para ver los Pokémon iniciales disponibles</div>';
        regionTitle.textContent = 'Pokémon Iniciales';
        return;
    }

    // Actualizar título
    const regionName = selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1);
    regionTitle.textContent = `Pokémon Iniciales de ${regionName}`;
    
    // Mostrar loading
    pokemonContainer.innerHTML = '<div class="loading">🔄 Cargando Pokémon...</div>';

    try {
        const pokemonList = regionPokemon[selectedRegion];
        console.log('Lista de Pokémon a cargar:', pokemonList);
        
        const pokemonData = await Promise.all(
            pokemonList.map(pokemon => fetchPokemonData(pokemon.id))
        );
        
        console.log('Datos de Pokémon cargados:', pokemonData);
        displayPokemon(pokemonData);
    } catch (error) {
        console.error('Error loading Pokemon:', error);
        pokemonContainer.innerHTML = '<div class="error">❌ Error al cargar los Pokémon. Verifica tu conexión a internet.</div>';
    }
}

// Función para obtener datos de un Pokémon desde la PokeAPI
async function fetchPokemonData(id) {
    console.log(`Fetching Pokemon with ID: ${id}`);
    
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Pokemon ${id} data loaded:`, data.name);
        return data;
    } catch (error) {
        console.error(`Error fetching Pokemon ${id}:`, error);
        throw error;
    }
}

// Función para mostrar los Pokémon
function displayPokemon(pokemonArray) {
    console.log('Displaying Pokemon:', pokemonArray.length);
    
    if (!pokemonArray || pokemonArray.length === 0) {
        pokemonContainer.innerHTML = '<div class="error">No se pudieron cargar los Pokémon</div>';
        return;
    }

    const pokemonGrid = document.createElement('div');
    pokemonGrid.className = 'pokemon-grid';

    pokemonArray.forEach(pokemon => {
        if (pokemon) {
            const pokemonCard = createPokemonCard(pokemon);
            pokemonGrid.appendChild(pokemonCard);
        }
    });

    pokemonContainer.innerHTML = '';
    pokemonContainer.appendChild(pokemonGrid);
}

// Función para crear una tarjeta de Pokémon
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    
    // Verificar si el Pokémon ya fue elegido
    const isChosen = chosenPokemon.has(pokemon.id);
    if (isChosen) {
        card.classList.add('disabled');
    }

    // Crear tipos del Pokémon
    const typesHtml = pokemon.types.map(typeInfo => 
        `<span class="type-badge type-${typeInfo.type.name}">${typeInfo.type.name}</span>`
    ).join('');

    // Obtener la imagen del Pokémon (priorizar imágenes de alta calidad)
    const pokemonImage = 
        // 1. Artwork oficial (mejor calidad)
        (pokemon.sprites.other && pokemon.sprites.other['official-artwork'] && 
         pokemon.sprites.other['official-artwork'].front_default) ||
        // 2. Dream World (buena calidad)
        (pokemon.sprites.other && pokemon.sprites.other.dream_world && 
         pokemon.sprites.other.dream_world.front_default) ||
        // 3. Home sprites (buena calidad)
        (pokemon.sprites.other && pokemon.sprites.other.home && 
         pokemon.sprites.other.home.front_default) ||
        // 4. Sprites de alta resolución si están disponibles
        (pokemon.sprites.front_default) ||
        // 5. Fallback
        'https://via.placeholder.com/200x200?text=Pokemon';

    card.innerHTML = `
        <img src="${pokemonImage}" alt="${pokemon.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x200?text=Pokemon'">
        <div class="pokemon-id">#${pokemon.id}</div>
        <h3>${capitalize(pokemon.name)}</h3>
        <div class="pokemon-types">${typesHtml}</div>
        <button class="choose-btn" data-pokemon-id="${pokemon.id}" onclick="choosePokemon(${pokemon.id}, '${pokemon.name}')" ${isChosen ? 'disabled' : ''}>
            ${isChosen ? '✅ Ya Elegido' : '⭐ Elegir'}
        </button>
    `;

    return card;
}

// Función para elegir un Pokémon
function choosePokemon(pokemonId, pokemonName) {
    console.log(`Attempting to choose Pokemon: ${pokemonName} (ID: ${pokemonId})`);
    
    const trainerName = trainerNameInput.value.trim();

    // Validar que el nombre del entrenador esté ingresado
    if (!trainerName) {
        alert('⚠️ Por favor, ingresa tu nombre antes de elegir un Pokémon.');
        trainerNameInput.focus();
        return;
    }

    // Validar que el Pokémon no haya sido elegido previamente
    if (chosenPokemon.has(pokemonId)) {
        alert('⚠️ Este Pokémon ya ha sido elegido por otro entrenador.');
        console.log('Pokemon already chosen:', pokemonId);
        return;
    }

    // Registrar la elección
    chosenPokemon.add(pokemonId);
    const newChoice = {
        trainer: trainerName,
        pokemon: pokemonName,
        pokemonId: pokemonId,
        timestamp: new Date()
    };
    
    choices.push(newChoice);
    console.log('New choice added:', newChoice);
    console.log('Total choices:', choices.length);
    console.log('Chosen Pokemon set:', Array.from(chosenPokemon));

    // Actualizar la interfaz
    updateChoicesList();
    updatePokemonButtons(pokemonId);

    // Limpiar el nombre del entrenador para la siguiente elección
    trainerNameInput.value = '';

    // Mostrar mensaje de éxito
    alert(`🎉 ¡Felicidades ${trainerName}! Has elegido a ${capitalize(pokemonName)} como tu compañero Pokémon.`);
}

// Función para actualizar la lista de elecciones
function updateChoicesList() {
    if (choices.length === 0) {
        choicesList.innerHTML = '<li class="choice-item">No hay elecciones aún. ¡Sé el primero en elegir tu Pokémon!</li>';
        return;
    }

    choicesList.innerHTML = choices.map((choice, index) => `
        <li class="choice-item">
            <strong>Entrenador:</strong> ${choice.trainer} - 
            <strong>Pokémon:</strong> #${choice.pokemonId} ${capitalize(choice.pokemon)}
        </li>
    `).join('');
}

// Función para actualizar los botones de Pokémon
function updatePokemonButtons(pokemonId) {
    // Buscar el botón específico por el data-pokemon-id
    const targetButton = document.querySelector(`[data-pokemon-id="${pokemonId}"]`);
    
    if (targetButton) {
        targetButton.disabled = true;
        targetButton.textContent = '✅ Ya Elegido';
        targetButton.parentElement.classList.add('disabled');
        console.log(`Button for Pokemon ${pokemonId} disabled`);
    }
    
    // También actualizar usando el método anterior como respaldo
    const buttons = document.querySelectorAll('.choose-btn');
    buttons.forEach(button => {
        const onclick = button.getAttribute('onclick');
        if (onclick && onclick.includes(`choosePokemon(${pokemonId},`)) {
            button.disabled = true;
            button.textContent = '✅ Ya Elegido';
            button.parentElement.classList.add('disabled');
        }
    });
}

// Función para reiniciar todas las elecciones
function resetAllChoices() {
    if (choices.length === 0) {
        alert('ℹ️ No hay elecciones para reiniciar.');
        return;
    }

    const confirmed = confirm('🔄 ¿Estás seguro de que quieres reiniciar todas las elecciones? Esta acción no se puede deshacer.');
    
    if (confirmed) {
        // Limpiar datos
        chosenPokemon.clear();
        choices = [];
        
        console.log('All choices reset');
        
        // Actualizar interfaz
        updateChoicesList();
        
        // Reactivar todos los botones
        const cards = document.querySelectorAll('.pokemon-card');
        cards.forEach(card => {
            card.classList.remove('disabled');
            const button = card.querySelector('.choose-btn');
            if (button) {
                button.disabled = false;
                button.textContent = '⭐ Elegir';
            }
        });

        alert('✅ Todas las elecciones han sido reiniciadas. ¡Los Pokémon están disponibles nuevamente!');
    }
}

// Función para capitalizar nombres
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Función de utilidad para debug
function debugInfo() {
    console.log('=== DEBUG INFO ===');
    console.log('Chosen Pokemon:', chosenPokemon);
    console.log('Choices:', choices);
    console.log('Current region:', regionSelect.value);
    console.log('==================');
}