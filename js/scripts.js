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

    if (! ['name', 'detailsUrl'].every(key => Object.keys(pokemon).includes(key))) {
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
      json.results.forEach(function (item) {
        const id = item.url.match(/.*\/(\d+)\/$/)[1];
        let pokemon = {
          id: `#${id.padStart(4, '0')}`,
          name: item.name,
          detailsUrl: item.url,
          cover: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        };
        add(pokemon);
        _hideLoadingMessage();
      });
    }).catch(function (e) {
      console.error(e);
      _hideLoadingMessage();
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
      item.types = details.types;
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
    let coverElement = document.createElement('img');
    coverElement.classList.add('card-img-top', 'bg-secondary', 'p-5');
    coverElement.src = pokemon.cover;

    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    let nameElement = document.createElement('h2');
    nameElement.innerHTML = pokemon.name;

    let idText = document.createElement('small');
    idText.classList.add('text-muted');
    idText.innerText = pokemon.id;

    let cardTextElement = document.createElement('p');
    cardTextElement.classList.add('card-text');
    cardTextElement.appendChild(idText);

    let detailsButton = document.createElement('button');
    detailsButton.classList.add('btn', 'btn-block', 'btn-primary', 'stretched-link');
    detailsButton.setAttribute('data-bs-toggle', 'modal');
    detailsButton.setAttribute('data-bs-target', '#exampleModal');
    detailsButton.innerText = 'Details';
    _addEventListener(detailsButton, pokemon);

    let footerElement = document.createElement('p');
    footerElement.classList.add('card-text', 'text-center');
    footerElement.appendChild(detailsButton);

    cardBody.appendChild(nameElement);
    cardBody.appendChild(cardTextElement);
    cardBody.appendChild(footerElement);

    let cardElement = document.createElement('div');
    cardElement.classList.add('card', 'mb-4');
    cardElement.appendChild(coverElement);
    cardElement.appendChild(cardBody);

    let listItem = document.createElement('div');
    listItem.classList.add('col-xs-12', 'col-sm-6', 'col-lg-4', 'col-xl-3');
    listItem.appendChild(cardElement);

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
    typesElement.innerText = `Types: ${pokemon.types.map(({type}) => type.name).join(', ')}`;

    let bodyElement = document.querySelector('.modal-body');
    bodyElement.innerHTML = '';
    bodyElement.appendChild(imageElement);
    bodyElement.appendChild(heightElement);
    bodyElement.appendChild(typesElement);
  }

  function _resetList() {
    let list = document.querySelector('.pokemon-list');
    list.innerHTML = '';
  }

  document.querySelector('#search').addEventListener('input', (e) => {
    _resetList();
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
