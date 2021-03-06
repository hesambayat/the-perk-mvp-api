import '@babel/polyfill/noConflict'
import { GraphQLServer } from 'graphql-yoga'
import { resolvers, fragmentReplacements } from './resolvers'
import prisma from './prisma'

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context(request) {
        return {
            prisma,
            request
        }
    },
    fragmentReplacements
})

server.start({ port: process.env.PORT || 4000 }, () => {
    console.log(`Server is running on localhost:${process.env.PORT || 4000}`)
})