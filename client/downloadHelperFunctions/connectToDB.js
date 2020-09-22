function connectToDB(uri) {
  const dbConnection = `const {Pool} = require('pg');
const PG_URI = '${uri.trim()}';

const pool = new Pool({
    connectionString: PG_URI
})

module.exports = {
    query: (text,params, callback) => {
        console.log('executed query:', text)
        return pool.query(text, params, callback)
    }
}
  `;
  return dbConnection;
}

module.exports = {
  connectToDB,
};
