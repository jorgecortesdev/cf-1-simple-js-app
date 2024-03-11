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
    showLoadingMessage();
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url,
        };
        add(pokemon);
        hideLoadingMessage();
      });
    }).catch(function (e) {
      console.error(e);
      hideLoadingMessage();
    });
  }

  function loadDetails(item) {
    showLoadingMessage();
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types;
      hideLoadingMessage();
    }).catch(function (e) {
      console.error(e);
      hideLoadingMessage();
    });
  }

  function search(query) {
    return pokemonList.filter(pokemon => {
      return pokemon.name.toLowerCase().includes(query.toLowerCase());
    });
  }

  function addListItem(pokemon) {
    let listItem = document.createElement('li');
    listItem.classList.add('list-group-item');

    let button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add('btn', 'btn-primary');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#exampleModal');
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
      showModal(pokemon);
    });
  }

  function showLoadingMessage() {
    let alert = document.querySelector('.alert.alert--info');
    alert.style.display = 'block';
  }

  function hideLoadingMessage() {
    let alert = document.querySelector('.alert.alert--info');
    alert.style.display = 'none';
  }

  function showModal(pokemon) {
    let titleElement = document.querySelector('#exampleModalLabel');
    titleElement.innerText = pokemon.name;

    let imageElement = document.createElement('img');
    imageElement.src = pokemon.imageUrl;

    let heightElement = document.createElement('p');
    heightElement.innerText = `Height: ${pokemon.height}`;

    let typesElement = document.createElement('p');
    typesElement.innerText = `Types: ${pokemon.types.map(({type}) => type.name).join(', ')}`;

    let bodyElement = document.querySelector('.modal-body');
    bodyElement.innerHTML = '';
    bodyElement.appendChild(imageElement);
    bodyElement.appendChild(heightElement);
    bodyElement.appendChild(typesElement);
  }

  function resetList() {
    let list = document.querySelector('.pokemon-list');
    list.innerHTML = '';
  }

  return {
    getAll: getAll,
    add: add,
    search: search,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    resetList: resetList,
  }
})();

pokemonRepository.loadList().then(() => {
  pokemonRepository.getAll().forEach(pokemon => {
    pokemonRepository.addListItem(pokemon);
  });
});

document.querySelector('#search').addEventListener('input', (e) => {
  pokemonRepository.resetList();

  pokemonRepository.search(e.target.value).forEach(pokemon => {
    pokemonRepository.addListItem(pokemon);
  });
})
