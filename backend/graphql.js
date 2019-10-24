const { ApolloServer } = require("apollo-server-koa");
const schema = require("./schema");
const { pokemonTypes } = require("./pokemon-types");
const { pokedex } = require("./pokedex.js");

function findByType(pokemons, type) {
  return pokemons.filter(pokemon => pokemon.type.includes(type));
}

function findByName(pokemons, name) {
  return pokemons.filter(pokemon => pokemon.name === name)[0];
}

function filterTypes(allTypes, ids) {
  return allTypes.filter(type => ids.includes(type.id));
}

function changeName(id, newName) {
  const pokemon = pokedex.find(pokemon => {
    return pokemon.id == id;
  });

  if (pokemon) {
    pokemon.name = newName;
  }

  return pokemon;
}

const resolvers = {
  Query: {
    getAll: () => pokedex,
    getByName: (parent, args) => findByName(pokedex, args.name),
    getByType: (parent, args) => findByType(pokedex, args.type),
    getTypes: () => pokemonTypes
  },
  Mutation: {
    changeName: (parent, args) => changeName(args.id, args.newName)
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
  const server = new ApolloServer({ typeDefs: schema, resolvers });

  server.applyMiddleware({ app });
}

exports.applyGraphQLMiddleware = applyGraphQLMiddleware;
