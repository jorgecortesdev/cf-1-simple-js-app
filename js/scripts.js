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

  return {
    getAll: getAll,
    add: add,
    search: search,
  }
})();

pokemonRepository.getAll().forEach(pokemon => {
  document.write(`${pokemon.name} (height: ${pokemon.height})`);

  if (pokemon.height > 5) {
    document.write(' - Wow, that\'s big!');
  }

  document.write('<br>');
});
