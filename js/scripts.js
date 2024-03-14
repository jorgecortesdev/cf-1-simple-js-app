const pokemonRepository = (function () {
  let pokemonList = [];
  let limit = 12;
  let apiUrl = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}`;

  function getAll() {
    return pokemonList;
  }

  function add(pokemon) {
    if (typeof pokemon !== 'object') {
      return;
    }

    if (! ['id', 'name', 'detailsUrl', 'types', 'cover'].every(key => Object.keys(pokemon).includes(key))) {
      return;
    }

    pokemonList.push(pokemon);
  }

  function loadList() {
    _showLoadingMessage();

    return fetch(apiUrl).then(function (response) {
        return response.json();
      }).then(function (json) {
        apiUrl = json.next;

        const results = json.results.map(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };

          return _pokemonDetails(pokemon);
        });

        return Promise.all(results).then(() => _hideLoadingMessage());
      }).catch(function (e) {
        console.error(e);
        _hideLoadingMessage()
      });
  }

  function _pokemonDetails(pokemon) {
    const id = pokemon.detailsUrl.match(/.*\/(\d+)\/$/)[1];

    return fetch(pokemon.detailsUrl).then(function (response) {
      return response.json();
    }).then(function (details) {
      pokemon.id = `#${id.padStart(4, '0')}`;
      pokemon.imageUrl = details.sprites.front_default;
      pokemon.types = details.types.map(({ type }) => type.name);
      pokemon.cover = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
      add(pokemon)
    }).catch(function (e) {
      console.error(e);
    });
  }

  function loadDetails(item) {
    _showLoadingMessage();
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      _hideLoadingMessage();
    }).catch(function (e) {
      console.error(e);
      _hideLoadingMessage();
    });
  }

  function _search(query) {
    return pokemonList.filter(pokemon => {
      return pokemon.name.toLowerCase().includes(query.toLowerCase());
    });
  }

  function addListItem(pokemon) {
    let idText = document.createElement('p');
    idText.classList.add('panel__id');
    idText.innerText = pokemon.id;

    let nameElement = document.createElement('h2');
    nameElement.innerHTML = pokemon.name;

    let typesElement = document.createElement('div');
    typesElement.classList.add('panel__types');
    pokemon.types.forEach(function (type) {
      let typeElement = document.createElement('p');
      typeElement.classList.add('panel__badge');
      typeElement.innerText = type;
      typesElement.appendChild(typeElement);
    });

    let coverElement = document.createElement('img');
    coverElement.classList.add('panel__image');
    coverElement.src = pokemon.cover;

    let detailsButton = document.createElement('a');
    detailsButton.classList.add('stretched-link', 'mt-2');
    detailsButton.setAttribute('data-bs-toggle', 'modal');
    detailsButton.setAttribute('data-bs-target', '#exampleModal');
    _addEventListener(detailsButton, pokemon);

    let panelElement = document.createElement('div');
    panelElement.classList.add('panel', `type-bg-${pokemon.types[0]}`);

    panelElement.appendChild(idText);
    panelElement.appendChild(nameElement);
    panelElement.appendChild(typesElement);
    panelElement.appendChild(coverElement);
    panelElement.appendChild(detailsButton);

    let listItem = document.createElement('div');
    listItem.classList.add('col-xs-12', 'col-sm-6', 'col-lg-4', 'col-xl-3');
    listItem.appendChild(panelElement);

    let list = document.querySelector('.pokemon-list');
    list.appendChild(listItem);
  }

  function _addEventListener(button, pokemon) {
    button.addEventListener('click', () => {
      _showDetails(pokemon);
    });
  }

  function _showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      _showModal(pokemon);
    });
  }

  function _showLoadingMessage() {
    let alert = document.querySelector('.alert.alert--info');
    alert.style.display = 'block';
  }

  function _hideLoadingMessage() {
    let alert = document.querySelector('.alert.alert--info');
    alert.style.display = 'none';
  }

  function _showModal(pokemon) {
    let titleElement = document.querySelector('#exampleModalLabel');
    titleElement.innerText = pokemon.name;

    let imageElement = document.createElement('img');
    imageElement.src = pokemon.imageUrl;

    let heightElement = document.createElement('p');
    heightElement.innerText = `Height: ${pokemon.height}`;

    let typesElement = document.createElement('p');
    typesElement.innerText = `Types: ${pokemon.types.join(', ')}`;

    let bodyElement = document.querySelector('.modal-body');
    bodyElement.innerHTML = '';
    bodyElement.appendChild(imageElement);
    bodyElement.appendChild(heightElement);
    bodyElement.appendChild(typesElement);
  }

  document.querySelector('#search').addEventListener('input', (e) => {
    let list = document.querySelector('.pokemon-list');
    list.innerHTML = '';

    _search(e.target.value).forEach(pokemon => addListItem(pokemon));
  });

  document.querySelector('#load-more').addEventListener('click', async () => {
    await loadList();
    pokemonList.slice(-limit).forEach(pokemon => addListItem(pokemon));
  });

  return {
    getAll: getAll,
    add: add,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails
  }
})();

pokemonRepository.loadList().then(() => {
  pokemonRepository.getAll().forEach(pokemon => {
    pokemonRepository.addListItem(pokemon);
  });
});
