const fs = require('fs');
const { Pool } = require('pg');
const { table } = require('console');
const SchemaGenerator = require('../generators/schemaGenerator');

const pgQuery = fs.readFileSync('server/queries/tableData.sql', 'utf8');

const pgController = {};

// Middleware function for recovering info from pg tables
pgController.getPGTables = (req, res, next) => {
  let db;
  if (!req.body.uri) {
    db = new Pool({
      connectionString:
        'postgres://ordddiou:g5OjOyAIFxf-tsLk1uwu4ZOfbJfiCFbh@ruby.db.elephantsql.com:5432/ordddiou',
    });
  } else {
    db = new Pool({ connectionString: req.body.uri.trim() });
  }

  db.query(pgQuery)
    .then((data) => {
      res.locals.tables = data.rows[0].tables;
      return next();
    })
    .catch((err) => res.json('error'));

  console.log(req.body.uri);
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

    for (const table in OriginalTables) {
      const currentTable = OriginalTables[table];
      // if this is not a joing table
      if (
        !currentTable.foreignKeys ||
        Object.keys(currentTable.columns).length !==
          Object.keys(currentTable.foreignKeys).length + 1
      ) {
        const pointsTo = [];
        for (const objName in currentTable.foreignKeys) {
          pointsTo.push(currentTable.foreignKeys[objName].referenceTable);
        }
        const referecedBy = [];
        for (const refTableName in currentTable.referencedBy) {
          if (
            !OriginalTables[refTableName].foreignKeys ||
            Object.keys(OriginalTables[refTableName].columns).length !==
              Object.keys(OriginalTables[refTableName].foreignKeys).length + 1
          ) {
            referecedBy.push(refTableName);
          } else {
            // else it's a join table
            for (const foreignKey in OriginalTables[refTableName].foreignKeys) {
              const joinedTable =
                OriginalTables[refTableName].foreignKeys[foreignKey].referenceTable;
              if (joinedTable !== table) {
                referecedBy.push(joinedTable);
              }
            }
          }
        }
        const columns = [];
        for (const columnName in currentTable.columns) {
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