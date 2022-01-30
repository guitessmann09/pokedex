async function fetchPokemonsData(pokemons) {
  const allPokemonData = [];

  for (const pokemon of pokemons) {
    const pokemonData = await fetchPokemon(pokemon.url);
    allPokemonData.push(pokemonData);
  }
  return allPokemonData;
}

async function fetchPokemons() {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=42&offset=1"
  );
  const responseJSON = await response.json();
  return responseJSON.results;
}

async function fetchPokemon(url) {
  const response = await fetch(url);
  const responseJSON = await response.json();
  return responseJSON;
}

function insertPokemonHTML(pokemon) {
  const hpStat = pokemon.stats.find((item) => item.stat.name === "hp");
  const attackStat = pokemon.stats.find((item) => item.stat.name === "attack");
  const defenseStat = pokemon.stats.find(
    (item) => item.stat.name === "defense"
  );
  const specialStat = pokemon.stats.find(
    (item) => item.stat.name === "special-attack"
  );
  const pokemonHTML = `
<li class="pokemons-item">
    <div class="pokemon-card" data-pokemon-card-type-name:="eletric">
        <div class="pokemon-image-container">
            <img src="${pokemon.sprites.front_default}" class="pokemon-image" style="height:200px">
        </div>
        <div class="pokemon-card-info">
            <h3 class="pokemon-name">${pokemon.name}</h3>
            <span class="pokemon-type">${pokemon.types[0].type.name}</span>
        </div>
        <ul class="pokemon-attributes-list">
            <li class="pokemon-attribute">
                <span class="pokemon-attribute-name">HP</span>
                <div class="pokemon-progress">
                    <div class="pokemon-progress-bar" style="width:${hpStat.base_stat}%">
                        <span class="stats-number">${hpStat.base_stat}</span>
                    </div>
                </div>
            </li>
            <li class="pokemon-attribute">
                <span class="pokemon-attribute-name">Attack</span>
                <div class="pokemon-progress">
                    <div class="pokemon-progress-bar" style="width:${attackStat.base_stat}%">
                        <span class="stats-number">${attackStat.base_stat}</span>
                    </div>
                </div>
            </li>
            <li class="pokemon-attribute">
                <span class="pokemon-attribute-name">Defense</span>
                <div class="pokemon-progress">
                    <div class="pokemon-progress-bar" style="width:${defenseStat.base_stat}%">
                        <span class="stats-number">${defenseStat.base_stat}</span>
                    </div>
                </div>
            </li>
            <li class="pokemon-attribute">
                <span class="pokemon-attribute-name">Special Attack</span>
                <div class="pokemon-progress">
                    <div class="pokemon-progress-bar" style="width:${specialStat.base_stat}%">
                        <span class="stats-number">${specialStat.base_stat}</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</li>
        `;
  const pokemonListUl = document.querySelector(".pokemons-list");
  pokemonListUl.insertAdjacentHTML("beforeend", pokemonHTML);
}

async function populatePokemons(pokemons) {
  const allPokemonsData = await fetchPokemonsData(pokemons);

  for (const allPokemonData of allPokemonsData) {
    insertPokemonHTML(allPokemonData);
  }
}

function removeAllPokemons() {
  const pokemonsListUl = document.querySelector(".pokemons-list");
  pokemonsListUl.innerHTML = " ";
}

async function handleSearchInput(event, pokemons) {
  const pokemonNameSearch = event.target.value;
  const currentPokemon = pokemons.find((pokemon) => pokemon.name === pokemonNameSearch.toLowerCase());
  if (!pokemonNameSearch) {
    populatePokemons(pokemons);
    removeAllPokemons();
  } else if (currentPokemon) {
    const currentPokemonData = await fetchPokemon(currentPokemon.url);

    if (currentPokemonData) {
      removeAllPokemons();
      insertPokemonHTML(currentPokemonData);
    }
  }
}
function initSearchFunction(pokemons) {
  const searchInput = document.querySelector("#search");
  searchInput.addEventListener(
    "change",
    async (event) => await handleSearchInput(event, pokemons)
  );
}

async function filterClicked(filter, pokemonsData) {
  const pokemonType = filter.dataset.pokemonTypeName;

  const pokemonsDataFilteredByType = pokemonsData.filter(pokemonData => {
    return pokemonData.types[0].type.name === pokemonType;
  })
  
  if (pokemonType === "all") {
    removeAllPokemons();
    for (const pokemon of pokemonsData) {
      insertPokemonHTML(pokemon)
    }
  } else {
    removeAllPokemons();
    for (const pokemon of pokemonsDataFilteredByType) {
      insertPokemonHTML(pokemon)
    }
  }
  
}

function initFiltersFunction(pokemonsData) {
  const filters = document.querySelectorAll(".filter-btn");
  filters.forEach((filter) => {
    filter.addEventListener(
      "click",
      async () => await filterClicked(filter, pokemonsData)
    );
  });
}

async function main() {
  const pokemons = await fetchPokemons();

  const pokemonsData = await fetchPokemonsData(pokemons);

  populatePokemons(pokemons);
  initSearchFunction(pokemons);
  initFiltersFunction(pokemonsData);
}

main();
