function createGraph(data) {
  const colors = ['red', 'blue', 'green', 'orange', 'purple', 'gray'];
  let nodes = [];
  let edges = [];
  // access all table names on object
  let keys = Object.keys(data);

  for (let i = 0; i < colors.length; i++) {
    // access properties on each table (columns, pointsTo, referencedBy)
    if (!data[keys[i]]) {
      break;
    } else {
      let columns = data[keys[i]].columns;
      let pointsTo = data[keys[i]].pointsTo;
      let referencedBy = data[keys[i]].referecedBy;

      nodes.push({ id: keys[i], label: keys[i], color: colors[i], size: 20, shape: 'circle' });
      for (let j = 0; j < columns.length; j++) {
        nodes.push({ id: columns[j] + j, label: columns[j], color: colors[i], shape: 'circle' });
        edges.push({ from: keys[i], to: columns[j] + j });
      }

      if (!pointsTo[0]) {
        continue;
      } else {
        pointsTo.forEach((point) => {
          edges.push({
            from: keys[i],
            to: point,
            hightlight: 'red',
            physics: { springLength: 200 },
          });
        });
      }

      if (!referencedBy[0]) {
        continue;
      } else {
        referencedBy.forEach((ref) => {
          edges.push({ from: ref, to: keys[i], highlight: 'cyan', physics: { springLength: 200 } });
        });
      }
    }
  }
  return { nodes, edges };
}

export default createGraph;
