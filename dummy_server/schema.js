const { makeExecutableSchema } = require('graphql-tools');
const db = require('./connectToDB');

const typeDefs = `
  type Query {
    messages: [Message!]!
    message(id: Int!): Message!
  }

  type Mutation {

    createMessage(
      name: String,
      message: String,
      time: String,
    ): Message!

    updateMessage(
      name: String,
      message: String,
      time: String,
      id: Int!,
    ): Message!

    deleteMessage(id: ID!): Message!
  }

  type Message {
    id: Int!
    name: String
    message: String
    time: String
  }

`;

const resolvers = {
  Query: {
    message: (parent, args) => {
      try {
        const query = 'SELECT * FROM messages WHERE id = $1';
        const values = [args.id];
        return db.query(query, values).then((res) => res.rows[0]);
      } catch (err) {
        throw new Error(err);
      }
    },
    messages: () => {
      try {
        const query = 'SELECT * FROM messages';
        return db.query(query).then((res) => res.rows);
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    createMessage: (parent, args) => {
      const query = 'INSERT INTO messages(name, message, time) VALUES($1, $2, $3)';
      const values = [args.name, args.message, args.time];
      try {
        return db.query(query, values);
      } catch (err) {
        throw new Error(err);
      }
    },
    updateMessage: (parent, args) => {
      try {
        const query = 'UPDATE messages SET name=$1, message=$2, time=$3 WHERE id = $4';
        const values = [args.name, args.message, args.time, args.id];
        return db.query(query, values).then((res) => res.rows);
      } catch (err) {
        throw new Error(err);
      }
    },
    deleteMessage: (parent, args) => {
      try {
        const query = 'DELETE FROM messages WHERE id = $1';
        const values = [args.id];
        return db.query(query, values).then((res) => res.rows);
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;
