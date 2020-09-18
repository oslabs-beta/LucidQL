const express = require('express');


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
