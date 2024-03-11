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
    pokemonList.push(pokemon);
  }

  return {
    getAll: getAll,
    add: add,
  }
})();

pokemonRepository.getAll().forEach(pokemon => {
  document.write(`${pokemon.name} (height: ${pokemon.height})`);

  if (pokemon.height > 5) {
    document.write(' - Wow, that\'s big!');
  }

  document.write('<br>');
});
