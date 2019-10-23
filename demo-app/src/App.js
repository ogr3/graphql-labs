import React from 'react';
import styled from "styled-components"
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag"

// eslint-disable-next-line
const GRAPHQL_QUERY = gql`
query {
  getAll {
    id
    name
    thumbnail
    stats {
      HP
    }
  }
}
`;

// eslint-disable-next-line
const REST_QUERY = gql`
query {
  getAll @rest(type: "Pokemon", path: "random_pokemons/4") {
    id
    name
    thumbnail
    stats @type(name: "Stats"){
      HP
    }
  }
}
`;

const Cards = styled.div`
display: grid;
grid-template-columns: repeat(5, 1fr);
grid-auto-rows: auto;
grid-gap: 1rem;
padding: 16px;
`

const Card = styled.div`
display: flex;
flex-direction: column;
padding: 10px;
background: gray;
border-radius: 6px;
align-items: center;
`

const CardThumbnail = styled.img`

align-items: space-around;
`

const CardTitle = styled.h2`
`

const CardStats = styled.div`

`

const PokemonCard = ({id, name, thumbnail, stats}) => (
  <Card key={id}>
    <CardTitle>{name}</CardTitle>
    <CardThumbnail alt="thumbnail" src={`http://localhost:4000${thumbnail}`}/>
    <CardStats>{stats.HP} HP</CardStats>
  </Card>
)

function App() {
  const { loading, error, data } = useQuery(REST_QUERY);
  
  if (loading) { return <p>Loading...</p>; }
  if (error) { return <p>Error!</p>; }

  return (
    <Cards>
      {data.getAll.map(PokemonCard)}
    </Cards>
  );
}

export default App;
