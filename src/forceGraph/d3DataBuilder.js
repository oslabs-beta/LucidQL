/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
export default function generateNodeAndLink(data) {
  const newData = { tableNodes: [], columnNodes: [], referencedBy: [], pointsTo: [], linksToColumns: [] };

  for (const tableName in data) {
    // handle table node
    const parentNode = {
      id: `Parent-${tableName}`,
      name: tableName,
      primary: true,
    };
    newData.tableNodes.push(parentNode);

    // handle links between tables
    data[tableName].pointsTo.forEach((targetTable) => {
      const parentLink = {
        source: `Parent-${tableName}`,
        target: `Parent-${targetTable}`,
        type: 'pointsTo',
        // type: 'foreignKeyTo',
      };
      newData.pointsTo.push(parentLink);
    });
    data[tableName].referecedBy.forEach((refTable) => {
      const parentLink = {
        source: `Parent-${refTable}`,
        target: `Parent-${tableName}`,
        type: 'referecedBy',
        // type: 'referecedBy'
      };
      newData.referencedBy.push(parentLink);
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
      newData.columnNodes.push(childNode);
      newData.linksToColumns.push(childLink);
    });
  }
  return newData;
}
