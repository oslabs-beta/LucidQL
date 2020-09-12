function serverFile() {
  const serverInfo = `const express = require('express')
const app = express()
const port = 3000
const { graphqlHTTP } = require ('express-graphql')

const schema = require('./schema')

app.use(express.json())

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql:true
}))

app.listen(port, ()=> { console.log('The GraphQL server is ready at http://localhost:3000/graphql') })
    `;
  return serverInfo;
}

module.exports = {
  serverFile,
};
