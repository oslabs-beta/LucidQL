const mysql = require('mysql2');

const mySQLController = {};

// This method is suitable for older SQL databases
mySQLController.getTables = (req, res, next) => {
  const config = {
    host: req.body.host,
    user: req.body.user,
    password: req.body.password,
    database: req.body.database,
  };
  const connection = mysql.createConnection(config);

  connection.query('SHOW tables', async (err, results, fields) => {
    if (err) {
      return res.json('error');
    }
    const allTables = {};
    const tables = [];
    for (let i = 0; i < results.length; i++) {
      const table = Object.values(results[i])[0];
      allTables[table] = {};
      tables.push(table);
    }
    const columns = [];
    const keys = [];
    for (let i = 0; i < tables.length; i++) {
      const data = await connection.promise().query(`SHOW KEYS FROM ${tables[i]};`);
      const key = data[0];
      allTables[tables[i]].primaryKey = {};
      allTables[tables[i]].foreignKeys = {};
      for (let j = 0; j < key.length; j++) {
        const { Key_name, Column_name } = key[j];
        if (Key_name === 'PRIMARY') {
          allTables[tables[i]].primaryKey = Column_name;
        } else {
          allTables[tables[i]].foreignKeys[Key_name] = {};
          allTables[tables[i]].foreignKeys[Key_name].referenceKey = allTables[tables[i]].primaryKey;
        }
      }
      keys.push(key);
    }
    for (let i = 0; i < tables.length; i++) {
      const data = await connection.promise().query(`SHOW FIELDS FROM ${tables[i]};`);
      const column = data[0];
      allTables[tables[i]].columns = {};
      for (let j = 0; j < column.length; j++) {
        allTables[tables[i]].columns[column[j].Field] = {};
        const { Field, Null } = column[j];
        allTables[tables[i]].columns[column[j].Field].dataType = Field;
        allTables[tables[i]].columns[column[j].Field].isNullable = Null;
      }
      columns.push(column);
    }

    res.locals.tables = allTables;

    return next();
  });
};

module.exports = mySQLController;
