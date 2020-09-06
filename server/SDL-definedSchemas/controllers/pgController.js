const fs = require('fs');
const { Pool } = require('pg');
const SchemaGenerator = require('../generators/schemaGenerator');
const { table } = require('console');

const pgQuery = fs.readFileSync('server/queries/tableData.sql', 'utf8');

const pgController = {};

// Middleware function for recovering info from pg tables
pgController.getPGTables = (req, res, next) => {
  // const db = new Pool({ connectionString: req.query.uri });
  const db = new Pool({
    connectionString:
      'postgres://ordddiou:g5OjOyAIFxf-tsLk1uwu4ZOfbJfiCFbh@ruby.db.elephantsql.com:5432/ordddiou',
  });
  db.query(pgQuery)
    .then((data) => {
      res.locals.tables = data.rows[0].tables;
      // console.log('res.locals.tables: ', res.locals.tables);
      // console.log('pgQuery: ', pgQuery);
      return next();
    })
    .catch(
      (err) => res.json('error')
      // next({
      //   log: err,
      //   status: 500,
      //   message: { err: 'There was a problem making database query' },
      // })
    );
};

// Middleware function for assembling SDL schema
pgController.assembleSDLSchema = (req, res, next) => {
  try {
    res.locals.SDLSchema = SchemaGenerator.assembleSchema(res.locals.tables);
    return next();
  } catch (err) {
    return next({
      log: err,
      status: 500,
      message: { err: 'There was a problem assembling SDL schema' },
    });
  }
};

pgController.compileData = (req, res, next) => {
  try {
    const OriginalTables = res.locals.tables;
    const newTables = {};

    for (let table in OriginalTables) {
      const currentTable = OriginalTables[table];
      // if this is not a joing table
      if (
        !currentTable.foreignKeys ||
        Object.keys(currentTable.columns).length !==
        Object.keys(currentTable.foreignKeys).length + 1
      ) {
        const pointsTo = [];
        for (let objName in currentTable.foreignKeys) {
          pointsTo.push(currentTable.foreignKeys[objName].referenceTable);
        }
        const referecedBy = [];
        for (let refTableName in currentTable.referencedBy) {
          if (
            !OriginalTables[refTableName].foreignKeys ||
            Object.keys(OriginalTables[refTableName].columns).length !==
            Object.keys(OriginalTables[refTableName].foreignKeys).length + 1
          ) {
            referecedBy.push(refTableName);
          } else {
            // else it's a join table
            for (let foreignKey in OriginalTables[refTableName].foreignKeys) {
              const joinedTable =
                OriginalTables[refTableName].foreignKeys[foreignKey]
                  .referenceTable;
              if (joinedTable !== table) {
                referecedBy.push(joinedTable);
              }
            }
          }
        }
        const columns = [];
        for (let columnName in currentTable.columns) {
          if (columnName !== currentTable.primaryKey) {
            columns.push(columnName);
          }
        }

        newTables[table] = {
          pointsTo,
          referecedBy,
          columns,
        };
      }
    }
    res.locals.compiledData = newTables;
    return next();
  } catch (err) {
    return next({
      log: err,
      status: 500,
      message: {
        err: 'There was a problem compiling tables in pgController.compileData',
      },
    });
  }
};

module.exports = pgController;
