function schemaFile(schema) {
  const fileContent =
    `const { makeExecutableSchema } = require('graphql-tools');\n` +
    `const db = require('../dbConnect');\n${schema}`;
  return fileContent;
}

module.exports = {
  schemaFile,
};
