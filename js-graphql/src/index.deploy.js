/* eslint-disable */
import { createSchema, createYoga } from 'graphql-yoga';

import typeDefs from './schemas';
import resolvers from './resolvers';

import baseContext from './context/baseContext';

export const handler = async (event, lambdaContext) => {
  const yoga = createYoga({
    schema: createSchema({
      typeDefs: await typeDefs,
      resolvers,
    }),
    context: baseContext,
    cors: {
      origin: '*',
    },
  });
  const response = await yoga.fetch(
    event.path + '?' + new URLSearchParams(event.queryStringParameters || {}).toString(),
    {
      method: event.httpMethod,
      headers: event.headers,
      body: event.body ? Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8') : undefined,
    },
    { event, lambdaContext },
  );
  const responseHeaders = Object.fromEntries(response.headers.entries());

  return {
    statusCode: response.status,
    headers: responseHeaders,
    body: await response.text(),
    isBase64Encoded: false,
  };
};
