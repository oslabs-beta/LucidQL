const {Pool} = require('pg');
const PG_URI = 'postgres://mxnahgtg:V5_1wi1TPrDLRvmsl0pKczgf9SMQy1j6@lallah.db.elephantsql.com:5432/mxnahgtg';

const pool = new Pool({
    connectionString: PG_URI
})

module.exports = {
    query: (text,params, callback) => {
        console.log('executed query:', text)
        return pool.query(text, params, callback)
    }
}
  