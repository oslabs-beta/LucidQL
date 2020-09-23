import { assembleSchema } from './schemaGenerator';

export function deleteTables(currentState, tableToExclude) {
  const { tables: tablesObj, schema: currentSchema, history: currentHistory } = currentState;
  const newTables = {}
  const helperFuncOnJoinTable = (table, tableToExclude) => { // if this is a join table and it has included tableToExclude
    if (!table.foreignKeys) return false; // no foreign keys, not a join table so just return false
    if (Object.keys(table.columns).length === Object.keys(table.foreignKeys).length + 1) { // if this is a join table
      for(let key in table.foreignKeys) {
        if (table.foreignKeys[key].referenceTable === tableToExclude) return true;
      }
    }
    return false;
  }
  for (let tableName in tablesObj) {
    if (tableName !== tableToExclude && !helperFuncOnJoinTable(tablesObj[tableName], tableToExclude)) {
      newTables[tableName] = {};
      newTables[tableName].primaryKey = tablesObj[tableName].primaryKey;
      newTables[tableName].columns = tablesObj[tableName].columns;
      let newFK = {}
      for (let key in tablesObj[tableName].foreignKeys) {
        if (tablesObj[tableName].foreignKeys[key].referenceTable !== tableToExclude) {
          newFK[key] = tablesObj[tableName].foreignKeys[key]
        }
      }
      newTables[tableName].foreignKeys = newFK
      let newRefby = {}
      for (let refByTableName in tablesObj[tableName].referencedBy) {
        if (refByTableName !== tableToExclude && !helperFuncOnJoinTable(tablesObj[refByTableName], tableToExclude)) { 
          newRefby[refByTableName] = tablesObj[tableName].referencedBy[refByTableName]
        }
      } 
      newTables[tableName].referencedBy = newRefby;
    } 
  }
  const newSchema = assembleSchema(newTables);
  const history = [...currentHistory, {table: tablesObj, schema: currentSchema}];
  return { newTables, newSchema, history }
}

export function deleteColumns(currentState, columnToExclude, parentName, foreignKeyToDelete) {
  const { tables: tablesObj, schema: currentSchema, history: currentHistory } = currentState;
  const newTables = {};

  let FKTargetTable = null;
  if (foreignKeyToDelete) {
    FKTargetTable = tablesObj[parentName].foreignKeys[columnToExclude].referenceTable
  }

  for (let tableName in tablesObj) {
    if (tableName === parentName) {
      const newColumns = {};
      for (let objName in tablesObj[parentName].columns) {
        if (objName !== columnToExclude) {
          newColumns[objName] = tablesObj[parentName].columns[objName]
        }
      }

      if (foreignKeyToDelete) { // if foreignKeyToDelete is true, modify newForeignKeys 
        const newForeignKeys = {};
        for (let objName in tablesObj[parentName].foreignKeys) {
          if (objName !== columnToExclude) {
            newForeignKeys[objName] = tablesObj[parentName].foreignKeys[objName];
          } 
        }          
        newTables[tableName] = {...tablesObj[tableName], columns: newColumns, foreignKeys: newForeignKeys}
      } else { // if foreignKeyToDelete is false...
        newTables[tableName] = {...tablesObj[tableName], columns: newColumns}
      }
    } else if (foreignKeyToDelete && tableName === FKTargetTable) { 
      // if we need to deal with a table that is referenced by this FK
      const newRefby = {}
      for (let refObjName in tablesObj[FKTargetTable].referencedBy) {
        if (refObjName !== parentName) {
          newRefby[refObjName] = tablesObj[FKTargetTable].referencedBy[refObjName];
        }
      }
      newTables[FKTargetTable] = {...tablesObj[FKTargetTable], referencedBy: newRefby}
    } else { // else for other tables we can just make a copy
      newTables[tableName] = tablesObj[tableName]
    }
  }

  const newSchema = assembleSchema(newTables);
  const history = [...currentHistory, {table: tablesObj, schema: currentSchema}];
  return { newTables, newSchema, history }
}