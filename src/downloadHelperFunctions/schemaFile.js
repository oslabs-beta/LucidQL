function schemaFile(schema) {
  const fileContent = `const { makeExecutableSchema } = require('graphql-tools');
const db = require('./connectToDB');\n\n${schema}`;

  return fileContent;
}

module.exports = {
  schemaFile,
};
