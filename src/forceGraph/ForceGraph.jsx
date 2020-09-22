import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { state } from '../App';
import { useRecoilState, constSelector } from 'recoil';
import styles from './ForceGraph.module.css';
import { generateNodeAndLink, compileToD3, filterTables } from './d3DataBuilder';
import { assembleSchema } from './generators/schemaGenerator';
import deleteIconSrc from './delete.svg';

// The ForceGraph component will be the container for the generated force graph and ForceGraphGenerator will generate the graph using D3.
function ForceGraph({ nodeHoverTooltip }) {  
// React ref hook to reference the container element. (common practice for React + d3)
  const containerRef = useRef(null);
  const [data, setData] = useRecoilState(state);

  function handleDeleteTables(tablesObj, tableToExclude) {
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
    const history = [...data.history, {table: tablesObj, schema: data.schema}];
    setData({ ...data, tables: newTables, schema: newSchema, tableModified: true, history });
  }

  function handleDeleteColumns(tablesObj, columnToExclude, parentName, foreignKeyToDelete) {
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
    const history = [...data.history, {table: tablesObj, schema: data.schema}];
    setData({ ...data, tables: newTables, schema: newSchema, tableModified: true, history });
  }

// useEffect hook to detect successful ref mount, as well as data change 
  useEffect(() => {   
    if (containerRef.current) {
      let currentRawData = compileToD3(data.tables); // to track rawData (for recalculation of d3Data)
      let currentD3Data = null;
      
      const { newD3Data, newObj } = generateNodeAndLink(currentRawData);
      if (data.tableModified) { // if this is an update, clear up the svg before re-run graph
        d3.select(containerRef.current).html("")
      }
      runForceGraph(containerRef.current, newD3Data, newObj, nodeHoverTooltip) 
    }
  }, [data.tables]);

  function runForceGraph(container, d3Data, rawData, nodeHoverTooltip) {
    const { tableNodes, columnNodes, referencedBy, pointsTo, linksToColumns } = d3Data;

    // get the container’s width and height from bounding rectangle:
    const containerRect = container.getBoundingClientRect();
    const height = containerRect.height;
    const width = containerRect.width;

    const topPadding = 250;
    const deleteIconY = 160;
    const deleteIconRadius = 24;
  
    // add the option to drag the force graph nodes as part of it’s simulation.
    const drag = (simulation) => {
      const dragStart = (event, d) => {
        // if condition: dragstarted would be called once for each of the two fingers.
        // The first time it get's called d3.event.active would be 0, and the simulation would be restarted.
        // The second time d3.event.active would be 1, so the simulation wouldn't restart again, because it's already going.
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      };
  
      const dragging = (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      };
  
      const dragEnd = (event, d) => {
        if (!event.active) simulation.alphaTarget(0); // if no event.active, stop the simulation
        // below: node will stay after drag ends
        d.fx = event.x;
        d.fy = event.y;
  
        // below: node will go back to original position after drag ends
        // d.fx = null;
        // d.fy = null;

        // check if nodes are being dragged to the trash can
        if (2 * width / 5 - deleteIconRadius < event.x &&
          event.x < 2 * width / 5 + deleteIconRadius &&
          3 * deleteIconY  - deleteIconRadius < event.y &&
          event.y < 3 * deleteIconY + deleteIconRadius) {

          if (event.subject.primary) {
            console.log('should delete table!', event.subject)
            handleDeleteTables(data.tables, event.subject.name);
          } else {
            handleDeleteColumns(data.tables, event.subject.name, event.subject.parent, event.subject.foreignKey)
          }
        }
      };
  
      return d3.drag().on('start', dragStart).on('drag', dragging).on('end', dragEnd);
    };
  
    // Handle the node tooltip generation: add the tooltip element to the graph
    const tooltip = document.querySelector('#graph-tooltip');
    if (!tooltip) {
      const tooltipDiv = document.createElement('div');
      tooltipDiv.classList.add(styles.tooltip);
      tooltipDiv.style.opacity = '0';
      tooltipDiv.id = 'graph-tooltip';
      document.body.appendChild(tooltipDiv);
    }
    const div = d3.select('#graph-tooltip');
  
    const addTooltip = (hoverTooltip, d, x, y) => {
      div.transition().duration(200).style('opacity', 0.9);
      div
        .html(hoverTooltip(d))
        .style('left', `${x}px`)
        .style('top', `${y + 10}px`);
    };
  
    const removeTooltip = () => {
      div.transition().duration(200).style('opacity', 0);
    };

    const nodesArr = tableNodes.concat(columnNodes);
    
    // const linksArr = referencedBy.concat(pointsTo);
    // linksToColumns
    const linksArr = pointsTo;
    const linesArr = linksToColumns.concat(referencedBy)

    const simulation = d3
      .forceSimulation(nodesArr)
      .force(
        'link',
        d3
          .forceLink(linksArr)
          .id((d) => d.id)
          .distance(400)
          .strength(1)
      )
      .force(
        'line',
        d3
          // .forceLink(linksToColumns)
          .forceLink(linesArr)
          .id((d) => d.id)
          // .distance(60)
          .distance((d) => d.type? 400: 60)
      )
      .force('charge', d3.forceManyBody().strength(-500)) // Negative numbers indicate a repulsive force and positive numbers an attractive force. Strength defaults to -30 upon installation.
      .force(
        'collide',
        d3.forceCollide(25)
      )
      .force('x', d3.forceX()) // These two siblings push nodes towards the desired x and y position.
      .force('y', d3.forceY()); // default to the middle
    

    const svg = d3
      .select(container)
      .append('svg')
      .attr('viewBox', [-width / 2, -height / 2, width, height]) // centering workaround
      .call(
        d3.zoom().on('zoom', function (event, d) {
          svg.attr('transform', event.transform);
        })
      );

    const deleteIcon = svg.append('image')
      .attr('x', 2 * width / 5 - deleteIconRadius)
      .attr('y', 3 * deleteIconY - deleteIconRadius)
      .attr('width', 2 * deleteIconRadius)
      .attr('height', 2 * deleteIconRadius)
      .attr('xlink:href', 'https://toppng.com/uploads/preview/big-trash-can-vector-trash-can-icon-1156305906701r6eta2fm.png')


    // Initialize the links between tables and its columns
    const line = svg
      .append('g')
      .attr('stroke', '#000')
      .attr('stroke-opacity', 0.2)
      .selectAll('line')
      // .data(linesArr)
      .data(linksToColumns)
      .join('line')
  
    const refLine = svg
      .append('g')
      .attr('stroke', '#767c77')
      .attr('stroke-opacity', 1)
      .style('stroke-width', '1.5px')
      .selectAll('line')
      .data(referencedBy)
      // .data(linksToColumns)
      .join('line')

    // appending little triangles, path object, as arrowhead
    // The <defs> element is used to store graphical objects that will be used at a later time
    // The <marker> element defines the graphic that is to be used for drawing arrowheads or polymarkers
    // on a given <path>, <line>, <polyline> or <polygon> element.
    svg
      .append('svg:defs')
      .selectAll('marker')
      .data(['end'])
      .enter()
      .append('svg:marker')
      .attr('id', String)
      .attr('viewBox', '0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
      .attr('refX', 28) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 15)
      .attr('markerHeight', 15)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10,0 L 0,5')
      .attr('fill', 'orange')
      .style('stroke', 'none');
  
    // add the curved line
    const path = svg
      .append('svg:g')
      .selectAll('path')
      .data(linksArr)
      .join('svg:path')
      .attr('fill', 'none')
      .style('stroke', (d) => (d.type === 'pointsTo' ? 'orange' : '#767c77'))
      .style('stroke-width', '1.5px')
      // .attr('marker-end', (d) => (d.type === 'pointsTo' ? 'url(#end)' : null));
      .attr('marker-end', 'url(#end)');
    //The marker-end attribute defines the arrowhead or polymarker that will be drawn at the final vertex of the given shape.
  
    const node = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .selectAll('circle')
      .data(nodesArr)
      .join('circle')
      .style('cursor', 'move')
      .attr('r', (d) => (d.primary ? 40 : 25))
      .attr('fill', (d) => (d.primary ? '#967bb6' : ( d.foreignKey? 'orange' :'#aacfcf')))
      .call(drag(simulation));
  
    const label = svg
      .append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(nodesArr)
      .join('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('class', (d) => (d.primary ? styles.primary : styles.column))
      .text((d) => d.primary ? (d.name.length > 7 ? d.name.slice(0, 6)+'..' : d.name) : (d.name.length > 5 ? d.name.slice(0, 5)+'..' : d.name))
      .call(drag(simulation));
  
    label
      .on('mouseover', (event, d) => addTooltip(nodeHoverTooltip, d, event.pageX, event.pageY))
      .on('mouseout', () => removeTooltip());
  
    simulation.on('tick', () => {
      // update link positions
      line
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      refLine
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);
  
      // update node positions
      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
  
      label.attr('x', (d) => d.x).attr('y', (d) => d.y);
  
      // update the curvy lines
      path.attr('d', (d) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`; // Elliptical Arc (A, a)
        //    M (start point x), (y)      A x_r  y_radii, 0 rotation, (0, 1)direction, end point ${d.target.x},${d.target.y}
        //  https://www.sitepoint.com/closer-look-svg-path-data/
      });
    });
  }
  
  // create a reference to the div which will wrap the generated graph and nothing more.
  return <svg ref={containerRef} className={styles.container} />;
}

export default ForceGraph;
