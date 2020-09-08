function packagejsonFile() {
  const packagejsonContent = `
  {
    "name": "CanvasQL",
    "version": "1.0.0",
    "description": "Visualizer for GraphQL APIs + a schema and resolver creator",
    "main": "server.js",
    "scripts": {
        "start": "nodemon server/server.js"
      },
    "author": "CanvasQL Team - Stanley Huang, Martin Chiang, Darwin Sinchi",
    "license": "ISC",
    "dependencies": {
      "dotenv": "^8.2.0",
      "express": "^4.17.1",
      "express-graphql": "^0.11.0",
      "graphql": "^15.3.0",
      "graphql-playground-middleware-express": "^1.7.15",
      "graphql-tools": "^4.0.7",
      "pg": "^8.3.3"
    },
    "devDependencies": {
      "nodemon": "^2.0.4"
        }
    }
    `;
  return packagejsonContent;
}

module.exports = {
  packagejsonFile,
};
