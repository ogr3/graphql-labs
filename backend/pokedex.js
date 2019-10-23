const pokedexData = require("./pokemon.json/pokedex.json");

function imageName(id) {
  return `${id.toString().padStart(3, '0')}.png`;
}

const pokedex = pokedexData.map(pokemon => ({
  ...pokemon,
  name: pokemon.name.english,
  stats: {
    ...pokemon.base,
    SpecialAttack: pokemon.base["Sp. Attack"],
    SpecialDefense: pokemon.base["Sp. Defense"]
  },
  image: `/images/${imageName(pokemon.id)}`,
  thumbnail: `/thumbnails/${imageName(pokemon.id)}`
}));

module.exports = {
    pokedex
};
