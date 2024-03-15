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
      item.height = details.height;
      item.weight = details.weight;
      item.species = details.species.name;
      item.abilities = details.abilities.map(({ ability }) => ability.name);
      item.stats = details.stats.map(item => {
        return {
          name: item.stat.name,
          value: item.base_stat
        }
      });
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
    let modalContent = document.querySelector('.modal-content');
    modalContent.className = '';
    modalContent.classList.add('modal-content', `type-bg-${pokemon.types[0]}`);

    let titleElement = document.createElement('h2');
    titleElement.innerText = pokemon.name;

    let listTypesElement = document.createElement('ul');
    listTypesElement.classList.add('panel__types');

    pokemon.types.forEach(function (type) {
      let typeElement = document.createElement('li');
      typeElement.classList.add('panel__badge');
      typeElement.innerText = type;
      listTypesElement.appendChild(typeElement);
    });

    let headerTitleElement = document.createElement('div');
    headerTitleElement.classList.add('modal-header-title');
    headerTitleElement.appendChild(titleElement);
    headerTitleElement.appendChild(listTypesElement);

    let idElement = document.createElement('div');
    idElement.classList.add('modal-header-id');
    idElement.innerText = pokemon.id;

    let headerContainerElement = document.createElement('div');
    headerContainerElement.appendChild(headerTitleElement);
    headerContainerElement.appendChild(idElement);

    let imageElement = document.createElement('img');
    imageElement.src = pokemon.cover;

    let modalHeaderElement = document.querySelector('.modal-header');
    modalHeaderElement.innerHTML = '';
    modalHeaderElement.appendChild(headerContainerElement);
    modalHeaderElement.appendChild(imageElement);

    let definitionListElement = document.createElement('dl');

    let speciesTitleElement = document.createElement('dt');
    speciesTitleElement.innerText = 'Species';
    definitionListElement.appendChild(speciesTitleElement);
    let speciesValueElement = document.createElement('dd');
    speciesValueElement.innerText = pokemon.species;
    definitionListElement.appendChild(speciesValueElement);

    let heightTitleElement = document.createElement('dt');
    heightTitleElement.innerText = 'Height';
    definitionListElement.appendChild(heightTitleElement);
    let heightValueElement = document.createElement('dd');
    heightValueElement.innerText = pokemon.height;
    definitionListElement.appendChild(heightValueElement);

    let weightTitleElement = document.createElement('dt');
    weightTitleElement.innerText = 'Weight';
    definitionListElement.appendChild(weightTitleElement);
    let weightValueElement = document.createElement('dd');
    weightValueElement.innerText = pokemon.weight;
    definitionListElement.appendChild(weightValueElement);

    let abilitiesTitleElement = document.createElement('dt');
    abilitiesTitleElement.innerText = 'Abilities';
    definitionListElement.appendChild(abilitiesTitleElement);
    let abilitiesValueElement = document.createElement('dd');
    abilitiesValueElement.innerText = pokemon.abilities.join(", ");
    definitionListElement.appendChild(abilitiesValueElement);

    let tabContentElement = document.querySelector('#myTabContent');
    tabContentElement.innerHTML = '';

    let aboutTabPaneElement = document.createElement('div');
    aboutTabPaneElement.classList.add('tab-pane', 'fade', 'show', 'active');
    aboutTabPaneElement.setAttribute('id', 'about-tab-pane')
    aboutTabPaneElement.appendChild(definitionListElement);
    tabContentElement.appendChild(aboutTabPaneElement);

    let statsDefinitionListElement = document.createElement('dl');
    pokemon.stats.forEach(stat => {
      let statTitleElement = document.createElement('dt');
      statTitleElement.innerText =
        stat.name === 'special-attack'
        ? 'sp. atk'
        : stat.name === 'special-defense'
        ? 'sp. def'
        : stat.name;
      statsDefinitionListElement.appendChild(statTitleElement);
      let statValueElement = document.createElement('dd');
      statValueElement.classList.add('d-flex', 'flex-row', 'gap-3', 'align-items-center');
      let statValueContainer = document.createElement('span');
      statValueContainer.innerText = stat.value;
      statValueElement.appendChild(statValueContainer);

      let progressContainerElement = document.createElement('div');
      progressContainerElement.classList.add('d-block', 'w-100');
      let progressElement = document.createElement('span');
      progressElement.classList.add('progress');
      progressElement.style = 'height: 16px;';
      let progressBarElement = document.createElement('span');
      progressBarElement.classList.add('progress-bar', `type-bg-${pokemon.types[0]}`);
      progressBarElement.style = `width: ${stat.value}%`;
      progressElement.appendChild(progressBarElement);
      progressContainerElement.appendChild(progressElement);
      statValueElement.appendChild(progressContainerElement);

      statsDefinitionListElement.appendChild(statValueElement);
    });

    let statsTabPaneElement = document.createElement('div');
    statsTabPaneElement.classList.add('tab-pane', 'fade');
    statsTabPaneElement.setAttribute('id', 'stats-tab-pane')
    statsTabPaneElement.appendChild(statsDefinitionListElement);
    tabContentElement.appendChild(statsTabPaneElement);

    // reset tab
    const trigger = document.querySelector('#myTab button[data-bs-target="#about-tab-pane"]');
    bootstrap.Tab.getInstance(trigger).show();
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
