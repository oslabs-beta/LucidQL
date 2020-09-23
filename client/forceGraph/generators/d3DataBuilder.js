export const generateNodeAndLink = (data) => {
  const d3Arrays = { tableNodes:[], columnNodes:[], referencedBy:[], pointsTo: [], linksToColumns:[] };
  for (let tableName in data) {    // handle table node
    const parentNode = {
      id: `Parent-${tableName}`,
      name: tableName,
      primary: true,
      primaryKey: data[tableName].primaryKey,
      foreignKeys: data[tableName].foreignKeys,
      columnCount: data[tableName].columns.length,
      referencedBy: data[tableName].referencedBy
    }
    d3Arrays.tableNodes.push(parentNode);
  
    // handle links between tables
    data[tableName].pointsTo.forEach((targetTable) => {
        const parentLink = {
          source: `Parent-${tableName}`,
          target: `Parent-${targetTable}`,
          type: 'pointsTo',
        }
        d3Arrays.pointsTo.push(parentLink);
    })
    data[tableName].referencedBy.forEach(refTable => {
        const parentLink = {
          source: `Parent-${refTable}`,
          target: `Parent-${tableName}`,
          type: 'referencedBy',
        }
        d3Arrays.referencedBy.push(parentLink);
    })

    // handle links between column and its parent
    data[tableName].columns.forEach((columnObj) => {
      const childNode = {
        id: `${tableName}-${columnObj.columnName}`,
        name: columnObj.columnName,
        parent: tableName,
        ...columnObj,
      };
      const childLink = {
        source: `Parent-${tableName}`,
        target: `${tableName}-${columnObj.columnName}`
      }
      if (data[tableName].foreignKeys.includes(columnObj.columnName)) { // if this column is a foreign key
        childNode.foreignKey = true;
      }
      d3Arrays.columnNodes.push(childNode);
      d3Arrays.linksToColumns.push(childLink)
    })  
  }
  return d3Arrays;
};

export const simplifyTable = (OriginalTables) => {
  const newTables = {};

  for (const table in OriginalTables) {
    const currentTable = OriginalTables[table];
    if (    // if this is not a join table
      !currentTable.foreignKeys ||
      Object.keys(currentTable.columns).length !== Object.keys(currentTable.foreignKeys).length + 1
    ) {
      const pointsTo = [];
      const foreignKeys = [];
      for (const objName in currentTable.foreignKeys) {
        pointsTo.push(currentTable.foreignKeys[objName].referenceTable);
        foreignKeys.push(objName);
      }
      const referencedBy = [];
      for (const refTableName in currentTable.referencedBy) {
        if (
          !OriginalTables[refTableName].foreignKeys ||
          Object.keys(OriginalTables[refTableName].columns).length !==
            Object.keys(OriginalTables[refTableName].foreignKeys).length + 1
        ) {
          referencedBy.push(refTableName);
        } else {  // else it's a join table
          for (const foreignKey in OriginalTables[refTableName].foreignKeys) {
            const joinedTable = OriginalTables[refTableName].foreignKeys[foreignKey].referenceTable;
            if (joinedTable !== table) {
              referencedBy.push(joinedTable);
            }
          }
        }
      }
      const columns = [];
      for (const columnName in currentTable.columns) {
        if (columnName !== currentTable.primaryKey) {
          const columnInfo = {
            columnName,
            ...currentTable.columns[columnName]
          }
          columns.push(columnInfo);
        }
      }

      newTables[table] = {
        pointsTo,
        referencedBy,
        columns,
        foreignKeys,
        primaryKey: currentTable.primaryKey
      };
    }
  }

  return newTables;
};
