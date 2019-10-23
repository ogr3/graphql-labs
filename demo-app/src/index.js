import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { ApolloLink } from "apollo-link"
import {ApolloClient} from "apollo-client";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from "apollo-link-http";
import { RestLink } from 'apollo-link-rest';
import { ApolloProvider } from "@apollo/react-hooks";

const cache = new InMemoryCache()

const httpLink = createHttpLink({ uri: "http://localhost:4000/graphql" });
const restLink = new RestLink({uri: "http://localhost:4000/api/"})

const client = new ApolloClient({
  link: ApolloLink.from([restLink, httpLink]),
  cache,
  resolvers: {
    // Add a resolver for querying and mutating selection
  }
});

// Write default local state
cache.writeData({
  data: {
    selection: []
  }
})

ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>, document.getElementById('root'));

