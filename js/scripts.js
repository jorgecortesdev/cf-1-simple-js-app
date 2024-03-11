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

for (let i = 0; i < pokemonList.length; i++) {
  let pokemon = pokemonList[i];

  document.write(`${pokemon.name} (height: ${pokemon.height})`);

  if (pokemon.height > 5) {
    document.write(' - Wow, that\'s big!');
  }

  document.write('<br>');
}
