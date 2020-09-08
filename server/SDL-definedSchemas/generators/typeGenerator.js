/* eslint-disable prettier/prettier */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const { singular } = require('pluralize');
const {
  toCamelCase, toPascalCase, typeSet, getPrimaryKeyType,
} = require('../helpers/helperFunctions');

const TypeGenerator = {};

TypeGenerator.queries = function queries(tableName, tableData) {
  const { primaryKey, foreignKeys, columns } = tableData;
  const nameSingular = singular(tableName);
  const primaryKeyType = getPrimaryKeyType(primaryKey, columns);
  if (!foreignKeys || Object.keys(columns).length !== Object.keys(foreignKeys).length + 1) { // Do not output pure join tables
    let byID = toCamelCase(nameSingular);
    if (nameSingular === tableName) byID += 'ByID';
    return `    ${toCamelCase(tableName)}: [${toPascalCase(nameSingular)}!]!\n`
      + `    ${byID}(${primaryKey}: ${primaryKeyType}!): ${toPascalCase(nameSingular)}!\n`;
  }
  return '';
};

TypeGenerator.mutations = function mutations(tableName, tableData) {
  const { primaryKey, foreignKeys, columns } = tableData;
  if (!foreignKeys || Object.keys(columns).length !== Object.keys(foreignKeys).length + 1) { // Do not output pure join tables
    return this._create(tableName, primaryKey, foreignKeys, columns)
      + this._update(tableName, primaryKey, foreignKeys, columns)
      + this._destroy(tableName, primaryKey);
  }
  return '';
};

TypeGenerator.customTypes = function customTypes(tableName, tables) {
  const { primaryKey, foreignKeys, columns } = tables[tableName];
  const primaryKeyType = getPrimaryKeyType(primaryKey, columns);
  if (foreignKeys === null || Object.keys(columns).length !== Object.keys(foreignKeys).length + 1) {
    return `${`  type ${toPascalCase(singular(tableName))} {\n`
      + `    ${primaryKey}: ${primaryKeyType}!`}${
      this._columns(primaryKey, foreignKeys, columns)
    }${this._getRelationships(tableName, tables)
    }\n  }\n\n`;
  }
  return '';
};

TypeGenerator._columns = function columns(primaryKey, foreignKeys, columns) {
  let colStr = '';
  for (const columnName in columns) {
    if (!(foreignKeys && foreignKeys[columnName]) && columnName !== primaryKey) {
      const { dataType, isNullable, columnDefault } = columns[columnName];
      colStr += `\n    ${columnName}: ${typeSet(dataType)}`;
      if (isNullable === 'NO' && columnDefault === null) colStr += '!';
    }
  }
  return colStr;
};

// Get table relationships
TypeGenerator._getRelationships = function getRelationships(tableName, tables) {
  let relationships = ''; //
  for (const refTableName in tables[tableName].referencedBy) {
    // example1 (table name: film): refTableName: planets_in_films, vessels_in_films, people_in_films, species_in_films
    // example2 (when table name is : species): refTableName: people, species_in_films

    const { referencedBy: foreignRefBy, foreignKeys: foreignFKeys, columns: foreignColumns } = tables[refTableName];

    // One-to-one: when we can find tableName in foreignRefBy, that means this is a direct one to one relation
    if (foreignRefBy && foreignRefBy[tableName]) {
      const refTableType = toPascalCase(singular(refTableName));
      relationships += `\n1-1    ${toCamelCase(singular(reftableName))}: ${refTableType}`;
    }

    // One-to-many: check if this is a join table, and if it's not, we can add relations)
    // example2: people table will meet this criteria
    else if (Object.keys(foreignColumns).length !== Object.keys(foreignFKeys).length + 1) {
      const refTableType = toPascalCase(singular(refTableName));
      // example2: refTableType: Person
      relationships += `\n1-x    ${toCamelCase(refTableName)}: [${refTableType}]`;
      // add 'people: [Person]' and to relation
    }

    // Many-to-many relations (so now handling join tables!)
    for (const foreignFKey in foreignFKeys) {
      // example1(ex: planets_in_films): foreignFKey: film_id(will be filtered out), planet_id (will be added as planets[planet])
      // example1: final output will apply on vessels_in_films, people_in_films, species_in_films as well
      // example2: foreignFKey: species_id(will be filtered out), homeworld_id(will be added to relation as planets: [Planet]):
      // example2: foreignFKey: species_id(will be filtered out), film_id(will be added to relation as films: [Film]):
      if (tableName !== foreignFKeys[foreignFKey].referenceTable) { // Do not include original table in output
        console.log('\n-----start----- tableName:', tableName);
        console.log('refTableName: ', refTableName, '\nforeignFKeys: ', foreignFKeys, '\nforeignFKey: ', foreignFKey);
        console.log('-----end-----');
        const manyToManyTable = toCamelCase(foreignFKeys[foreignFKey].referenceTable);
        relationships += `\nm-m    ${manyToManyTable}: [${toPascalCase(
          singular(manyToManyTable)
        )}]`;
      }
    }
  }
  return relationships;
};

TypeGenerator._create = function create(tableName, primaryKey, foreignKeys, columns) {
  return `    ${toCamelCase(`create_${singular(tableName)}`)}(\n${
    this._typeParams(primaryKey, foreignKeys, columns, false)
  }): ${toPascalCase(singular(tableName))}!\n`;
};

TypeGenerator._update = function update(tableName, primaryKey, foreignKeys, columns) {
  return `    ${toCamelCase(`update_${singular(tableName)}`)}(\n${
    this._typeParams(primaryKey, foreignKeys, columns, true)
  }): ${toPascalCase(singular(tableName))}!\n`;
};

TypeGenerator._destroy = function destroy(tableName, primaryKey) {
  return `    ${toCamelCase(`delete_${singular(tableName)}`)}(${primaryKey}: ID!): ${toPascalCase(singular(tableName))}!\n\n`;
};

TypeGenerator._typeParams = function addParams(primaryKey, foreignKeys, columns, needId) {
  let typeDef = '';
  for (const columnName in columns) {
    const { dataType, isNullable } = columns[columnName];
    if (foreignKeys === null || !foreignKeys[columnName]) {
      // console.log(foreignKeys, 'columnName is', columnName, 'primaryKey is', primaryKey);
      if (!needId && columnName === primaryKey) { // handle mutation on creating
        // console.log('skipped a loop! columnName & primaryKey is: ', columnName, primaryKey);
        continue; // we don't need Id during creating, so skip this loop when columnName === primaryKey
      }

      if (needId && columnName === primaryKey) { // handle mutation on updating (will need Id)
        typeDef += `      ${columnName}: ${typeSet(dataType)}!,\n`; // automatically add '!,\n' (not null)
      } else {
        typeDef += `      ${columnName}: ${typeSet(dataType)}`;
        if (isNullable !== 'YES') typeDef += '!';
        typeDef += ',\n';
      }
    }
  }
  if (typeDef !== '') typeDef += '    ';
  return typeDef;
};

module.exports = TypeGenerator;

// if (typeDef === '') typeDef += '\n'; // change line if it is the first line after mutation declaration
