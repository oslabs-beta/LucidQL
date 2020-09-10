export default function generateNodeAndLink(data) {
  const newData = { TableNodes: [], ColumnNodes: [], linksToTables: [], linksToColumns: [] };

  for (const tableName in data) {
    // handle table node
    const parentNode = {
      id: `Parent-${tableName}`,
      name: tableName,
      primary: true,
    };
    newData.TableNodes.push(parentNode);

    // handle links between tables
    data[tableName].pointsTo.forEach((targetTable) => {
      const parentLink = {
        source: `Parent-${tableName}`,
        target: `Parent-${targetTable}`,
        type: 'pointsTo',
        // type: 'foreignKeyTo',
      };
      newData.linksToTables.push(parentLink);
    });
    data[tableName].referecedBy.forEach((refTable) => {
      const parentLink = {
        source: `Parent-${refTable}`,
        target: `Parent-${tableName}`,
        type: 'referecedBy',
        // type: 'referecedBy'
      };
      newData.linksToTables.push(parentLink);
    });

    // handle links between column and its parent
    data[tableName].columns.forEach((columnName) => {
      const childNode = {
        id: `${tableName}-${columnName}`,
        name: columnName,
      };
      const childLink = {
        source: `Parent-${tableName}`,
        target: `${tableName}-${columnName}`,
      };
      newData.ColumnNodes.push(childNode);
      newData.linksToColumns.push(childLink);
    });
  }
  console.log(newData);
  return newData;
}
