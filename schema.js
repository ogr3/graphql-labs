const { gql } = require("apollo-server-koa");

const typeDefs = gql`
  type Stats {
    HP: Int
    Attack: Int
    Defense: Int
    SpecialAttack: Int
    SpecialDefense: Int
    Speed: Int
  }

  type Pokemon {
    id: ID
    name: String
    type: [PokeType]
    stats: Stats
    image: String
    thumbnail: String
  }

  type PokeType {
    id: ID
    name: String 
    strongVs: [PokeType]
    weakVs: [PokeType]
    resist: [PokeType]
    vulnerableTo: [PokeType]
  }

  type Query {
    getAll: [Pokemon]
    getByType(type: ID): [Pokemon]
    getByName(name: String): Pokemon
    getTypes: [PokeType]
  }
`;

module.exports = {
    typeDefs
}
