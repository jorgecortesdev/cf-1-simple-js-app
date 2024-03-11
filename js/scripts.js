const pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function getAll() {
    return pokemonList;
  }

  function add(pokemon) {
    if (typeof pokemon !== 'object') {
      return;
    }

    if (! ['name', 'detailsUrl'].every(key => Object.keys(pokemon).includes(key))) {
      return;
    }

    pokemonList.push(pokemon);
  }

  function loadList() {
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url,
        };
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    });
  }

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types;
    }).catch(function (e) {
      console.error(e);
    });
  }

  function search(query) {
    return pokemonList.filter(pokemon => {
      return pokemon.name.toLowerCase().includes(query.toLowerCase());
    });
  }

  function addListItem(pokemon) {
    let listItem = document.createElement('li');

    let button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add('pokemon-list__button');
    addEventListener(button, pokemon);

    listItem.appendChild(button);

    let list = document.querySelector('.pokemon-list');
    list.appendChild(listItem);
  }

  function addEventListener(button, pokemon) {
    button.addEventListener('click', () => {
      showDetails(pokemon);
    });
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      console.log(pokemon);
    });
  }

  return {
    getAll: getAll,
    add: add,
    search: search,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
  }
})();

pokemonRepository.loadList().then(() => {
  pokemonRepository.getAll().forEach(pokemon => {
    pokemonRepository.addListItem(pokemon);
  });
});
