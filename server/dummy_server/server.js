const express = require('express');
const expressGraphQL = require('express-graphql');
const expressPlayground = require('graphql-playground-middleware-express').default;

const schema = require('./schema');

const app = express();
const PORT = process.env.PORT || '3000';

app.use(
  '/graphql',
  expressGraphQL({
    schema,
  })
);

app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

app.listen(PORT, () => {
  console.log(
    `Welcome to CanvasQL! To query your database enter your URI into the frontend app,\nthen you can begin using your new schemas at http://localhost:${PORT}/playground`
  );
});
