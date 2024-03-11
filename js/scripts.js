const pokemonRepository = (function () {
  let pokemonList = [
    {
      name: 'Bulbasaur',
      height: 7,
      types: ['grass', 'poison'],
    },
    {
      name: 'Pikachu',
      height: 4,
      types: ['electric'],
    },
    {
      name: 'Ditto',
      height: 3,
      types: ['normal'],
    },
  ];

  function getAll() {
    return pokemonList;
  }

  function add(pokemon) {
    if (typeof pokemon !== 'object') {
      return;
    }

    if (! ['name', 'height', 'types'].every(key => Object.keys(pokemon).includes(key))) {
      console.log('t')
      return;
    }

    pokemonList.push(pokemon);
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
    console.log(pokemon);
  }

  return {
    getAll: getAll,
    add: add,
    search: search,
    addListItem: addListItem,
  }
})();

pokemonRepository.getAll().forEach(pokemon => {
  pokemonRepository.addListItem(pokemon);
});
