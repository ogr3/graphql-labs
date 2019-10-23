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

`ApolloClient` behöver dels en länk som används för att prata med servern samt en cache. Vi kommer här använda en `apollo-link-http` och en in-memory-cache.

```javascript
import { createHttpLink } from "apollo-link-http";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";

// Point to graphql endpoint
const httpLink = createHttpLink({ uri: "http://localhost:4000/graphql" });
const cache = new InMemoryCache();

const client = new ApolloClient({
  link: httpLink,
  cache
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
```

Det finns två sätt att anropa vår _Query_. Antingen via en _Higher Order Component_ `graphql` eller via en [React Hook](https://reactjs.org/docs/hooks-intro.html) vid namn `useQuery`. I denna labb använder vi oss av den senare.

```javascript
import { useQuery } from "@apollo/react-hooks";

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
        {data.getAll.map(pokemon => <li key={pokemon.id}>{pokemon.name}</li>)}
      </ul>
    </div>
  )
```

Nu när vi satt upp en _Query_ så är det lätt att bygga vidare på detta genom att fråga efter mer information. Se ifall du kan hämta mer data och kanske visa en liten bild på varje Pokemon samt lite mer information.

Kom ihåg att du alltid kan gå till [http://localhost:4000/graphql](http://localhost:4000/graphql) för att se dokumentation och testa dina queries.

## Labb 3 - Anropa en Rest-endpoint

## Labb 4 - Lägg till Mutation
