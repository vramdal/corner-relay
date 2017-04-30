import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} from 'graphql';

import {
    connectionArgs,
    connectionDefinitions,
    connectionFromArray,
    fromGlobalId,
    globalIdField,
    mutationWithClientMutationId,
    nodeDefinitions,
} from 'graphql-relay';

import {
    Pub,
    Person,
    Arrangement,
    getPersonById,
    getPubById,
    getArrangementById,
    getPersoner, getArrangement

} from './database';

const {nodeInterface, nodeField} = nodeDefinitions(
    (globalId) => {
        const {type, id} = fromGlobalId(globalId);
        if (type === 'Arrangement') {
            return getArrangementById(id);
        } else if (type === "Person") {
            return getPersonById(id);
        } else if (type === "Pub") {
            return getPubById(id);
        } else {
            return null;
        }
    },
    (obj) => {
        if (obj instanceof Arrangement) {
            return ArrangementType;
        } else if (obj instanceof Person) {
            return PersonType;
        } else if (obj instanceof Pub) {
            return PubType;
        } else {
            return null;
        }
    }
);

const ArrangementType = new GraphQLObjectType({
        name: "Arrangement",
        description: "Et arrangement pr år",
        fields: () => ({
            id: globalIdField("Arrangement"),
            aarstall: {
                type: new GraphQLNonNull(GraphQLInt),
                description: "Året hvor arrangementet finner sted",
                resolve: (arrangement) => arrangement.aarstall
            }
        }),
    interfaces: [nodeInterface]
});

const PubType = new GraphQLObjectType({
    name: "Pub",
    description: "Et vannhull langs løypa",
    fields: () => ({
        id: globalIdField("Pub"),
        navn: {
            type: new GraphQLNonNull(GraphQLString),
            description: "Etablissementets navn",
            resolve: (pub) => pub.navn
        },
        gjester: {
            type: gjestConnection,
            description: 'Gjester på denne puben akkurat nå',
            args: connectionArgs,
            resolve: (pub, args) => connectionFromArray(getPersoner(), args)
        }
    })
});

const PersonType = new GraphQLObjectType({
    name: "Person",
    description: "En deltaker på løpet",
    fields: () => ({
        id: globalIdField("Person"),
        navn: {
            type: new GraphQLNonNull(GraphQLString),
            description: "Deltakerens navn",
            resolve: (navn) => person.navn
        }
    })
});

const {connectionType: gjestConnection} =
    connectionDefinitions({name: "Person", nodeType: PersonType});

const queryType = new GraphQLObjectType({
    name: "Query",
    fields: () => ({
        node: nodeField,
        arrangement: {
            type: ArrangementType,
            resolve: () => getArrangement()
        }
    })
});

const GjestBesokerPubMutation = mutationWithClientMutationId({
    name: 'GjestBesokerPub',
    inputFields: {
        personId: { type: new GraphQLNonNull(GraphQLID)}
    },
    outputFields: {
        pub: {
            type: PubType,
            resolve: ({localPubId}) => getPubById(localPubId)
        },
        arrangement: {
            type: ArrangementType,
            resolve: () => getArrangement()
        }
    },
    mutateAndGetPayload: ({id}) => {
        const localPubId = fromGlobalId(id).id;
        // TODO: Gjør noe med objektene her
        // checkHidingSpotForTreasure(localHidingSpotId);
        return {localPubId};

    }
});

const mutationType = new GraphQLObjectType({
    name: "Mutation",
    fields: () => ({
        gjestBesokerPub: GjestBesokerPubMutation
    })
});

export const Schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
});