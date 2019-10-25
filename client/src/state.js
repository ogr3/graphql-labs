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
            console.log("new data: ", newData)
            return newData.showThumbnails;
        }
    }
};

export const initialData = {
    showThumbnails: false
};
