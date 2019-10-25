# Labba med React/GraphQL-klient

## Labb 1

Labb 1 går ut på att utforska ett enklare GraphQL-API mot en lokalt körande server.

Börja med att uppdatera submodulerna, detta för att hämta checka ut lite labbdata.

```
$ git submodule update --init --recursive
```

Sedan startar man servern via NPM

```
$ cd backend
$ npm install
$ npm start
```

Gå därefter till [http://localhost:4000/graphql](http://localhost:4000/graphql) och bekanta dig med den interaktiva GraphQL-klienten.

## Labb 2

I denna labb ska vi skapa en egen GraphQL-klient i React. Vi kommer att använda [Apollo Client (React)](https://www.apollographql.com/docs/react/) som gör det väldigt enkelt att komma igång.

Precis som under vår tidigare kompetensdag runt React så kommer vi här använda oss av `create-react-app` för att skapa vår application

```
$ npx create-react-app client
```

Efter att allt installerats så startar vi klienten och verifierar att allt verkar funka.

```
$ cd client
$ npm start
```

Detta bör öppna [http://localhost:3000](http://localhost:3000) i webbläsaren och visa React-loggan.

Det enklaste sättet att komma igång med Apollo är via ett paket som heter "Apollo Boost". I denna labb ska vi dock sätta upp Apollo från grunden då vi i en senare labb behöver det. Om du i framtiden bara vill komma igång snabbt och bara behöver prata mot en GraphQL-endpoint så kan du följa hänvisningarna på [Apollo Client (React) - Get Started](http://localhost:4000/graphql).

Vi kommer att behöva ett par paket som installeras via NPM

```
$ npm install apollo-client @apollo/react-hooks apollo-link-http apollo-cache-inmemory graphql graphql-tag
```

När dessa installerats så öppnar vi `src/index.js` för att sätta upp en `ApolloClient` och göra den tillgänglig för klienten.

`ApolloClient` behöver dels en länk som används för att prata med servern samt en cache. Vi kommer här använda en `apollo-link-http` och en in-memory-cache. Detta kan också vara ett bra tillfälle att lägga till stöd för [Apollo Client Devtools](https://github.com/apollographql/apollo-client-devtools) vilket görs med `connectDevTools: true` till `ApolloClient`.

```javascript
import { createHttpLink } from "apollo-link-http";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";

// Point to graphql endpoint
const httpLink = createHttpLink({ uri: "http://localhost:4000/graphql" });
const cache = new InMemoryCache();

const client = new ApolloClient({
  link: httpLink,
  cache,
  connectToDevTools: true // Check environment development and set to false in prod
});
```

Efter att clienten skapats måste den göras tillgänglig för komponenterna i React-trädet. Det görs genom en `ApolloProvider` som omsluter `<App/>`-kompontenten.

```javascript
import { ApolloProvider } from "@apollo/react-hooks";

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
```

**OBS:** Efter att man installerat nya paket så kommer man behöva starta om clienten. Hot-reloadingen fungerar inte då.

Efter att ha startat om klienten så bör allt se ut som innan. Nästa steg blir att försöka hämta lite data från servern.

För att använda GraphQL från klienten måste vi definiera vår _Query_. Detta görs enklast via en fördefinierad `gql`-tag som tillhandahålls från paketet `graphql-tag` som vi installerade tidigare.

```javascript
import gql from "graphql-tag";

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
```

Det finns två sätt att anropa vår _Query_. Antingen via en _Higher Order Component_ `graphql` eller via en [React Hook](https://reactjs.org/docs/hooks-intro.html) vid namn `useQuery`. I denna labb använder vi oss av den senare.

```javascript
import { useQuery } from "@apollo/react-hooks";

// Simple component to render a Pokemon
function Pokemon({ pokemon: { name } }) {
  return (<li>{name}</li>)
}

function App() {
  const { loading, error, data } = useQuery(GRAPHQL_QUERY);

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
    <div>All pokemons:
      <ul>
        {data.getAll.map(pokemon => <Pokemon key={pokemon.id} pokemon={pokemon}/>)}
      </ul>
    </div>
  )
```

Nu när vi satt upp en _Query_ så är det lätt att bygga vidare på detta genom att fråga efter mer information. Se ifall du kan hämta mer data och kanske visa en liten bild på varje Pokemon samt lite mer information.

Kom ihåg att du alltid kan gå till [http://localhost:4000/graphql](http://localhost:4000/graphql) för att se dokumentation och testa dina queries.

## Labb 3 - Anropa en Rest-endpoint

Vårt backend har även stöd för ett enkelt Rest-anrop på [http://localhost:4000/api/random_pokemons/5](http://localhost:4000/api/random_pokemons/5). Denna endpoint returner en lista med så många Pokemon man ber om.

I denna labb ska vi lägga till stöd i vår klient för att anropa denna endpoint via GraphQL för att på så sätt kunna kombinera data från flera källor i samma förfrågning.

Precis som i fallet när vi ville prata med vår GraphQL-endpoint måste vi här lägga till en `ApolloLink` för att prata med vårt Rest-API. Det görs via paketet `apollo-link-rest` så vi måste installera det och även två andra paket som vi behöver.

```
$ npm install apollo-link-rest apollo-link graphql-anywhere
```

Nästa steg blir att använda oss av detta paket för att skapa en länk till APIet. I `index.js`, lägg till följande kod och ändra skapandet av `ApolloClient` enligt följande.

```javascript
import { ApolloLink } from "apollo-link";
import { RestLink } from "apollo-link-rest";

// Create restLink
const restLink = new RestLink({ uri: "http://localhost:4000/api" });

// Update the ApolloLink to create a single link from a list of links
const client = new ApolloClient({
  link: ApolloLink.from([restLink, httpLink]),
  cache
});
```

Med länken på plats kan vi lägga till en förfrågning mot den i `App.js`. Utvidga `GRAPHQL_QUERY` till att även fråga:

```javascript
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

    random @rest(type: "Pokemon", path: "/random_pokemons/3") {
      id
      name
      thumbnail
      stats @type(name: "Stats") {
        HP
      }
    }
  }
`;

// The new result can now be used when rendering the component as well
function App() {
  const { loading, error, data } = useQuery(GRAPHQL_QUERY);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      Random pokemons:
      <ul>
        {data.random.map(pokemon => (
          <Pokemon key={pokemon.id} pokemon={pokemon} />
        ))}
      </ul>
      All pokemons:
      <ul>
        {data.getAll.map(pokemon => (
          <Pokemon key={pokemon.id} pokemon={pokemon} />
        ))}
      </ul>
    </div>
  );
}
```

Som du kan se finns det två nya direktiv i denna förfrågan `@rest` och `@type`. Den tidigare hjälper ApolloClient att använda rätt länk medan `@type` är ett sätt att sätta metafältet `__typename` på nästlade objekt. Vi kan förflytta detta till skapandet av `restLink` genom att skicka med `typePatcher` när vi skapar den.

```javascript
const restLink = new RestLink({
  uri: "http://localhost:4000/api",
  typePatcher: {
    Pokemon: (data, outerType, patchDeeper) => {
      if (data.stats != null) {
        data.stats = {
          __typename: "Stats",
          ...data.stats
        };
      }
      return data;
    }
  }
});
```

## Labb 4 - Lägg till Mutation

**Standby for contrived example**

I servern finns även stöd för en mutation vid namn `changeName`. Den tar ett `id` och `newName` och byter namn på den Pokemonen. I denna labb ska vi använda det till att göra en enkel `onClick` som tar bort sista bokstaven i namnet.

Här behöver vi bara modifiera vår `Pokemon`-komponent till att använda en Mutation.

I `App.js`, börja med att definiera mutation vi ska använda:

```javascript
const CHANGENAME_POKEMON = gql`
  mutation DeletePokemon($pokemonId: ID!, $newName: String!) {
    changeName(id: $pokemonId, newName: $newName) {
      id
      name
      thumbnail
      stats {
        HP
      }
    }
  }
`;
```

Därefter ska vi använda mutationen med hjälp av `useMutation` som liknar `useQuery` väldigt mycket.

```javascript
import { useQuery, useMutation } from "@apollo/react-hooks";

function Pokemon({ pokemon: { id, name } }) {
  const [mutation, { loading, error }] = useMutation(CHANGENAME_POKEMON, {
    variables: {
      pokemonId: id,
      newName: name.slice(0, -1)
    }
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <li onClick={mutation}>{name}</li>;
}
```

## Labb 5: Lokalt state

I denna del ska vi lägga till stöd för att klienten kan välja om den vill visa tumnaglar på alla Pokemons eller inte. Detta är state som inte hör hemma på servern utan vi vill behålla i klienten. I många React-appar skulle detta state ligga i Redux men här ska vi istället göra det tillgängligt via GraphQL genom att lägga det i den lokala cachen.

Skapa en fil `state.js` med följande innehåll. Här lägger vi till en

```javascript
import gql from "graphql-tag";

export const GET_SHOW_THUMBNAILS = gql`
  query ShowThumbnails {
    showThumbnails @client
  }
`;

export const TOGGLE_SHOW_THUMBNAILS = gql`
  mutation ToggleShowThumbnails {
    toggleShowThumbnails @client
  }
`;

// Define the schema for the local state
export const typeDefs = gql`
  extend type Query {
    showThumbnails: Boolean!
  }

  extend type Mutation {
    toggleShowThumbnails: Boolean!
  }
`;

// Implement local resolvers to update the state
export const resolvers = {
  Mutation: {
    toggleShowThumbnails: (_, _args, { cache }) => {
      const data = cache.readQuery({ query: GET_SHOW_THUMBNAILS });
      const newData = {
        ...data,
        showThumbnails: !data.showThumbnails
      };
      cache.writeData({ data: newData });
      return newData.showThumbnails;
    }
  }
};

export const initialData = {
  showThumbnails: false
};
```

Med `state.js` på plats kan vi nu använda de exporterade konstanterna för att utöka vår ApolloClient i `index.js`.

```javascript
import { typeDefs, resolvers, initialData } from "./state";

const client = new ApolloClient({
  link: ApolloLink.from([restLink, httpLink]),
  cache,
  connectToDevTools: true,
  typeDefs, // Add the schema definition for the local state
  resolvers // Add the resolvers for the local state
});

// Write the initial state to the GraphQL cache
cache.writeData({
  data: initialData
});
```

Slutligen ska vi använda statet ifrån vår `App.js`.

```javascript
import { useQuery, useMutation } from "@apollo/react-hooks";
import { TOGGLE_SHOW_THUMBNAILS } from "./state";

// Extend the query with

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

    random @rest(type: "Pokemon", path: "/random_pokemons/3") {
      id
      name
      thumbnail
      stats {
        HP
      }
    }
    # Add this
    showThumbnails @client
  }
`;

// Extend our Pokemon component to read a thumbnail when requested
function Pokemon({ pokemon: { id, name, thumbnail }, showThumbnail }) {
  const [mutation, { loading, error }] = useMutation(CHANGENAME_POKEMON, {
    variables: {
      pokemonId: id,
      newName: name.slice(0, -1)
    }
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <li onClick={mutation}>
      {name}
      {showThumbnail && (
        <img alt="thumbnail" src={`http://localhost:4000${thumbnail}`} />
      )}
    </li>
  );
}
```

For now, let's simply add a button at the top of our page that allows us to toggle the value, you can later make this prettier if there is time!

```javascript
function ToggleShowThumbnailsButton() {
  const [toggle] = useMutation(TOGGLE_SHOW_THUMBNAILS);
  return <button onClick={toggle}>Toggle Show Thumbnails</button>;
}

// And render it in App
function App() {
  const { loading, error, data } = useQuery(GRAPHQL_QUERY);

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
      <br />
      Random pokemons:
      <ul>
        {data.random.map(pokemon => (
          <Pokemon
            key={pokemon.id}
            pokemon={pokemon}
            showThumbnail={data.showThumbnails}
          />
        ))}
      </ul>
      All pokemons:
      <ul>
        {data.getAll.map(pokemon => (
          <Pokemon key={pokemon.id} pokemon={pokemon} />
        ))}
      </ul>
    </div>
  );
}
```
