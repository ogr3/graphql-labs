const { ApolloServer } = require("apollo-server-koa");
const { typeDefs } = require("./schema");
const { pokemonTypes } = require("./pokemon-types");
const { pokedex } = require("./pokedex.js");

function findByType(pokemons, type) {
  return pokemons.filter(pokemon => pokemon.type.includes(type));
}

function findByName(pokemons, name) {
  return pokemons.filter(pokemon => pokemon.name === name)[0]
}

function filterTypes(allTypes, ids) {
  return allTypes.filter(type => ids.includes(type.id));
}

const resolvers = {
  Query: {
    getAll: () => pokedex,
    getByName: (parent, args) => findByName(pokedex, args.name),
    getByType: (parent, args, ctx, info) => findByType(pokedex, args.type),
    getTypes: () => pokemonTypes
  },
  Pokemon: {
    type: parent => filterTypes(pokemonTypes, parent.type)
  },
  PokeType: {
    strongVs: parent => filterTypes(pokemonTypes, parent.strongVs),
    weakVs: parent => filterTypes(pokemonTypes, parent.weakVs),
    resist: parent => filterTypes(pokemonTypes, parent.resist),
    vulnerableTo: parent => filterTypes(pokemonType, parent.vulnerableTo)
  }
};

function applyGraphQLMiddleware(app) {
  const server = new ApolloServer({ typeDefs, resolvers });

  server.applyMiddleware({app})
}

exports.applyGraphQLMiddleware = applyGraphQLMiddleware
