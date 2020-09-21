function serverFile() {
  const serverInfo = `const express = require('express');
const expressGraphQL = require('express-graphql');
require('dotenv').config();
const expressPlayground = require('graphql-playground-middleware-express').default;

const schema = require('./sdlSchema/schema');
const app = express();
const PORT = 3000;

app.use(
  '/graphql',
  expressGraphQL({
    schema
  })
);

app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

app.listen(PORT, () => {
  console.log('Welcome to CanvasQL! To query your database enter your URI into the frontend app, then you can begin using your new schemas, please go to http://localhost:3000/playground');
});`;

  return serverInfo;
}

module.exports = {
  serverFile,
};
