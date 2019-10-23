const data = require("./data/pokemon-types.json")

// Map data into API domain
const pokemonTypes = data.map(type => ({
    id: type.name,
    ...type
}))

module.exports = {
    pokemonTypes
}
