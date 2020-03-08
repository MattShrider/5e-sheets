"use strict";
// const { tagEvent } = require("./serverless_sdk");
const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql')
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();


// This method just inserts the user's first name into the greeting message.
const getGreeting = firstName => `Hello, ${firstName}.`


// Here we declare the schema and resolvers for the query
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType', // an arbitrary name
    fields: {
      // the query has a field called 'greeting'
      greeting: {
        // we need to know the user's name to greet them
        args: { firstName: { name: 'firstName', type: new GraphQLNonNull(GraphQLString) } },
        // the greeting message is a string
        type: GraphQLString,
        // resolve to a greeting message
        resolve: (parent, args) => getGreeting(args.firstName)
      }
    }
  }),
})

// We want to make a GET request with ?query=<graphql query>
// The event properties are specific to AWS. Other providers will differ.
module.exports.query = (event, context, callback) => graphql(schema, event.queryStringParameters.query)
  .then(
    result => callback(null, {statusCode: 200, body: JSON.stringify(result)}),
    err => callback(err)
  )



// module.exports.hello = async event => {
//   tagEvent("custom-tag", "hello world", { custom: { tag: "data" } });

//   return {
//     statusCode: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*", // Required for CORS support to work
//       "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
//     },
//     body: JSON.stringify(
//       {
//         message: "Go Serverless v1.0! Your function executed successfully!",
//         input: event
//       },
//       null,
//       2
//     )
//   };

//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };
