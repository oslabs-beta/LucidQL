import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useRecoilState } from 'recoil';
import { state } from '../App';
import { runForceGraph } from './generators/ForceGraphGenerator';
import { deleteTables, deleteColumns } from './generators/deleteFunctions';

// The ForceGraph component will be the container for the generated force graph and ForceGraphGenerator will generate the graph using D3
function ForceGraph() {
  // useRef hook to reference the container element (common practice for React + d3)
  const containerRef = useRef(null);
  const [data, setData] = useRecoilState(state);

  const nodeHoverTooltip = React.useCallback((node) => {
    if (node.primary)
      return `<h4>Table: ${node.name}</h4><p>(SQL info)</br>Primary Key : ${node.primaryKey}</br>Columns Count : ${
        node.columnCount
      }</br>Foreign Keys :</br>${node.foreignKeys.length > 0 ? node.foreignKeys : 'N/A'}</br>Referenced by :</br>${
        node.referencedBy.length > 0 ? node.referencedBy : 'N/A'
      }`;
    return `<h5>Column: ${node.name}</h5><p>(SQL info)</br>dataType : ${node.dataType}</br>isNullable : ${node.isNullable}</br>charMaxLength : ${node.charMaxLength}</br>columnDefault : ${node.columnDefault}</p>`;
  }, []);

  const handleDeleteTables = (currentState, tableToExclude) => {
    const { newTables, newSchema, history } = deleteTables(currentState, tableToExclude);
    setData({ ...data, tables: newTables, schema: newSchema, tableModified: true, history });
  };

  const handleDeleteColumns = (currentState, columnToExclude, parentName, foreignKeyToDelete) => {
    const { newTables, newSchema, history } = deleteColumns(currentState, columnToExclude, parentName, foreignKeyToDelete);
    setData({ ...data, tables: newTables, schema: newSchema, tableModified: true, history });
  };

  // useEffect hook to detect successful ref mount, as well as data change
  useEffect(() => {
    if (containerRef.current) {
      if (data.tableModified) {
        // if this is an update, clear up the svg before re-run graph
        d3.select(containerRef.current).html('');
      }
      runForceGraph(containerRef.current, data, nodeHoverTooltip, handleDeleteTables, handleDeleteColumns);
    }
  }, [data.tables]);

  // create a reference to the div which will wrap the generated graph and nothing more.
  return <svg ref={containerRef} className="SVG_container" />;
}

export default ForceGraph;
