import React from 'react';
import logo from './logo.svg';
import './App.css';
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { TOGGLE_SHOW_THUMBNAILS } from "./state";


const GRAPHQL_QUERY = gql`
  query {
    getAll {
      id
      name
      thumbnail
      stats {
        HP
        Attack
        Defense
        Speed
      }
    }

    random @rest(type: "Pokemon", path: "/random_pokemons/3") {
      id
      name
      thumbnail
      stats {
        HP
        Attack
        Defense
        Speed
      }
    }

    showThumbnails @client
  }
`;

const CHANGENAME_POKEMON = gql`
  mutation DeletePokemon($pokemonId: ID!, $newName: String!) {
    changeName(id: $pokemonId, newName: $newName) {
      id
      name
      thumbnail
      stats {
        HP
        Attack
        Defense
        Speed
      }
    }
  }
`;

function ToggleShowThumbnailsButton() {
  const [toggle] = useMutation(TOGGLE_SHOW_THUMBNAILS);
  return <button onClick={toggle}>Toggle Show Thumbnails</button>;
}

// Simple component to render a Pokemon
function Pokemon({ pokemon, showThumbnail }) {
  const [mutation, { loading, error }] = useMutation(CHANGENAME_POKEMON, {
    variables: {
      pokemonId: pokemon.id,
      newName: pokemon.name.slice(0, -1)
    }
  });

  return (<li>
    <div className='pokemon-header' onClick={mutation}>{pokemon.name}</div>
    <ul className='normal-list'>
      {showThumbnail && <li><img style={{ display: 'block' }} src={`//localhost:4000${pokemon.thumbnail}` }/></li>}
      <li>Pokédex: {pokemon.id}</li>
      <li>Attack: {pokemon.stats.Attack}</li>
      <li>Defense: {pokemon.stats.Defense}</li>
      <li>HP: {pokemon.stats.HP}</li>
      <li>Speed: {pokemon.stats.Speed}</li>
    </ul>
  </li>)
}

function App() {
  const {loading, error, data} = useQuery(GRAPHQL_QUERY);

  // Show some kind of spinner while loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Inform the user that an error occured
  if (error) {
    return <div>Error: {error}</div>;
  }

  // At this point we can be sure that `data` is set with the result of our query
  return (
      <div>
        <ToggleShowThumbnailsButton />
        <br/>
        Random pokemons:
      <ul className='inline-list'>
        {data.random.map(pokemon => (
            <Pokemon key={pokemon.id} pokemon={pokemon} showThumbnail={data.showThumbnails}/>
        ))}
      </ul>
      All pokemons:
        <ul className='inline-list'>
          {data.getAll.map(pokemon => <Pokemon key={pokemon.id} pokemon={pokemon} showThumbnail={data.showThumbnails}/>)}
        </ul>
      </div>
  )
}

export default App;
