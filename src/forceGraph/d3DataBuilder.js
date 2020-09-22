export const generateNodeAndLink = (data, deletedTables) => {
  const newD3Data = { tableNodes:[], columnNodes:[], referencedBy:[], pointsTo: [], linksToColumns:[] };
  const newObj = {};
  // console.log('deletedTables: ', deletedTables)
  // console.log('data in generateNodeAndLink', data)

  for (let tableName in data) {
    if (!deletedTables.includes(tableName)) {
      newObj[tableName] = data[tableName] // make a copy to newObj

      // console.log('tableName', tableName)
      // console.log('data[tableName]', data[tableName])
      // handle table node
      const parentNode = {
        id: `Parent-${tableName}`,
        name: tableName,
        primary: true,
      }
      newD3Data.tableNodes.push(parentNode);
    
      // handle links between tables
      data[tableName].pointsTo.forEach((targetTable) => {
        if (!deletedTables.includes(tableName) && !deletedTables.includes(targetTable)) {
          const parentLink = {
            source: `Parent-${tableName}`,
            target: `Parent-${targetTable}`,
            type: 'pointsTo',
            // type: 'foreignKeyTo',
          }
          newD3Data.pointsTo.push(parentLink);
        }
      })
      data[tableName].referecedBy.forEach(refTable => {
        if (!deletedTables.includes(refTable) && !deletedTables.includes(tableName)) {
          const parentLink = {
            source: `Parent-${refTable}`,
            target: `Parent-${tableName}`,
            type: 'referecedBy',
            // type: 'referecedBy'
          }
          newD3Data.referencedBy.push(parentLink);
        }
      })

      // handle links between column and its parent
      data[tableName].columns.forEach((columnName) => {
        const childNode = {
          id: `${tableName}-${columnName}`,
          name: columnName,
        };
        const childLink = {
          source: `Parent-${tableName}`,
          target: `${tableName}-${columnName}`
        }
        if (data[tableName].foreignKeys.includes(columnName)) { // if this column is a foreign key
          childNode.foreignKey = true;
        }
        newD3Data.columnNodes.push(childNode);
        newD3Data.linksToColumns.push(childLink)
      })  
    }
  }
  // console.log('newD3Data in dataBuilder', newD3Data);
  // console.log('newObj in dataBuilder', newObj);
  return { newD3Data, newObj}
}

export const compileToD3 = (OriginalTables) => {
  const newTables = {};

  for (const table in OriginalTables) {
    const currentTable = OriginalTables[table];
    // if this is not a join table
    if (
      !currentTable.foreignKeys ||
      Object.keys(currentTable.columns).length !==
        Object.keys(currentTable.foreignKeys).length + 1
    ) {
      const pointsTo = [];
      const foreignKeys = [];
      for (const objName in currentTable.foreignKeys) {
        pointsTo.push(currentTable.foreignKeys[objName].referenceTable);
        foreignKeys.push(objName);
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
        foreignKeys,
      };
    }
  }

  return newTables;
}
