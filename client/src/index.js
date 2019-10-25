import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createHttpLink} from "apollo-link-http";
import {ApolloClient} from "apollo-client";
import {InMemoryCache} from "apollo-cache-inmemory";
import {ApolloProvider} from "@apollo/react-hooks";
import {ApolloLink} from "apollo-link";
import {RestLink} from "apollo-link-rest";
import {typeDefs, resolvers, initialData} from "./state";

// Point to graphql endpoint
const httpLink = createHttpLink({uri: "http://localhost:4000/graphql"});
// Create restLink
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
const cache = new InMemoryCache();

const client = new ApolloClient({
    link: ApolloLink.from([restLink, httpLink]),
    cache,
    connectToDevTools: true, // Check environment development and set to false in prod
    typeDefs, // Add the schema definition for the local state
    resolvers // Add the resolvers for the local state
});

// Write the initial state to the GraphQL cache
cache.writeData({
    data: initialData
});


ReactDOM.render(
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>,
    document.getElementById("root")
);

