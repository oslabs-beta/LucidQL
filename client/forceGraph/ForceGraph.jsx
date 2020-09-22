import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useRecoilState } from 'recoil';
import { state } from '../App';
import styles from './ForceGraph.module.css';
import { generateNodeAndLink, compileToD3, filterTables } from './d3DataBuilder';
import { assembleSchema } from './generators/schemaGenerator';
import deleteIconSrc from './delete.svg';

// The ForceGraph component will be the container for the generated force graph and ForceGraphGenerator will generate the graph using D3.
const deletedTables = []; // store deleted tableNames

function ForceGraph({ nodeHoverTooltip }) {
  // React ref hook to reference the container element. (common practice for React + d3)
  const containerRef = useRef(null);
  const [data, setData] = useRecoilState(state);
  // console.log('ForceGraph run! and tableData is: ', data.tables)

  function handleDeleteTables(tablesObj, tableToExclude) {
    const newTables = {};
    const helperFuncOnJoinTable = (table, tableToExclude) => {
      // if this is a join table and it has included tableToExclude
      if (!table.foreignKeys) return false; // no foreign keys, not a join table so just return false
      if (Object.keys(table.columns).length === Object.keys(table.foreignKeys).length + 1) {
        // if this is a join table
        for (const key in table.foreignKeys) {
          // console.log(key, table.foreignKeys[key].referenceTable)
          if (table.foreignKeys[key].referenceTable === tableToExclude) return true;
        }
      }
      return false;
    };
    for (const tableName in tablesObj) {
      if (tableName !== tableToExclude && !helperFuncOnJoinTable(tablesObj[tableName], tableToExclude)) {
        // console.log(tableName)
        newTables[tableName] = {};
        newTables[tableName].primaryKey = tablesObj[tableName].primaryKey;
        newTables[tableName].columns = tablesObj[tableName].columns;
        const newFK = {};
        for (const key in tablesObj[tableName].foreignKeys) {
          if (tablesObj[tableName].foreignKeys[key].referenceTable !== tableToExclude) {
            newFK[key] = tablesObj[tableName].foreignKeys[key];
          }
        }
        // console.log('newFK is', newFK)
        newTables[tableName].foreignKeys = newFK;
        const newRefby = {};
        for (const refByTableName in tablesObj[tableName].referencedBy) {
          if (refByTableName !== tableToExclude && !helperFuncOnJoinTable(tablesObj[refByTableName], tableToExclude)) {
            newRefby[refByTableName] = tablesObj[tableName].referencedBy[refByTableName];
          }
        }
        newTables[tableName].referencedBy = newRefby;
      }
    }
    // console.log('originalTables are: ', tablesObj)
    console.log('newTables are: ', newTables);
    // currentTables = newTables;
    const newSchema = assembleSchema(newTables);

    setData({ ...data, tables: newTables, schema: newSchema, tableModified: true });
  }

  // useEffect hook to detect successful ref mount, as well as data change
  useEffect(() => {
    if (containerRef.current) {
      const currentRawData = compileToD3(data.tables); // to track rawData (for recalculation of d3Data)
      console.log('currentRawData is: ', currentRawData);
      const currentD3Data = null;

      const { newD3Data, newObj } = generateNodeAndLink(currentRawData, deletedTables);
      console.log('in useEffect', newD3Data, newObj);

      if (data.tableModified) {
        d3.select(containerRef.current).html('');
      }
      runForceGraph(containerRef.current, newD3Data, newObj, nodeHoverTooltip);
    }
  }, [data.tables]);

  function runForceGraph(container, d3Data, rawData, nodeHoverTooltip) {
    console.log('runForceGraph!', d3Data);
    const { tableNodes, columnNodes, referencedBy, pointsTo, linksToColumns } = d3Data;

    // get the container’s width and height from bounding rectangle:
    const containerRect = container.getBoundingClientRect();
    // console.log('containerRect: ', containerRect)
    const { height } = containerRect;
    const { width } = containerRect;

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
        // deleteIcon.style('display', 'block');
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
        if (
          (2 * width) / 5 - deleteIconRadius < event.x &&
          event.x < (2 * width) / 5 + deleteIconRadius &&
          (5 * deleteIconY) / 2 - deleteIconRadius < event.y &&
          event.y < (5 * deleteIconY) / 2 + deleteIconRadius
        ) {
          // .attr('x', 2 * width / 5 - deleteIconRadius)
          // .attr('y', 2 * deleteIconY - deleteIconRadius)

          if (event.subject.primary) {
            console.log('should delete table!', event.subject);
            deletedTables.push(event.subject.name); // push to deletedTable array
            handleDeleteTables(data.tables, event.subject.name);
          } else if (event.subject.foreignKey) console.log('cant');
          else console.log('should delete column!', event.subject);
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

    // const nodesArr = [...tableNodes, ...columnNodes]
    // const linksArr = [...referencedBy, ...pointsTo]
    const nodesArr = tableNodes.concat(columnNodes);
    const linksArr = referencedBy.concat(pointsTo);
    // console.log('run! nodesArr', nodesArr, linksArr)

    const simulation = d3
      .forceSimulation(nodesArr)
      .force(
        'link',
        d3
          .forceLink(linksArr)
          .id((d) => d.id)
          .distance(300)
          .strength(1)
      )
      .force(
        'line',
        d3
          .forceLink(linksToColumns)
          .id((d) => d.id)
          .distance(50)
      )
      .force('charge', d3.forceManyBody().strength(-400)) // Negative numbers indicate a repulsive force and positive numbers an attractive force. Strength defaults to -30 upon installation.
      .force(
        'collide',
        d3.forceCollide(20)
        // .radius((d) => d.r || 20)
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

    const deleteIcon = svg
      .append('image')
      .attr('x', (2 * width) / 5 - deleteIconRadius)
      .attr('y', (5 * deleteIconY) / 2 - deleteIconRadius)
      .attr('width', 2 * deleteIconRadius)
      .attr('height', 2 * deleteIconRadius)
      .attr(
        'xlink:href',
        'https://toppng.com/uploads/preview/big-trash-can-vector-trash-can-icon-1156305906701r6eta2fm.png'
      );
    // .attr('fill', 'black')
    // .style('display', 'none');

    // Initialize the links between tables and its columns
    const line = svg
      .append('g')
      .attr('stroke', '#000')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(linksToColumns)
      .join('line')
      .attr('stroke-width', (d) => Math.sqrt(d.value));

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
      .attr('viewBox', '0 -5 10 10') // the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
      .attr('refX', 32) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 12)
      .attr('markerHeight', 12)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10,0 L 0,5')
      .attr('fill', '#999')
      .style('stroke', 'none');

    // add the curved line
    const path = svg
      .append('svg:g')
      .selectAll('path')
      .data(linksArr)
      .join('svg:path')
      .attr('fill', 'none')
      .style('stroke', (d) => (d.type === 'pointsTo' ? 'orange' : '#c4fb6d'))
      .style('stroke-width', '1.5px')
      .attr('marker-end', 'url(#end)');
    // The marker-end attribute defines the arrowhead or polymarker that will be drawn at the final vertex of the given shape.

    const node = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .selectAll('circle')
      .data(nodesArr)
      .join('circle')
      // .join(
      //   enter => (
      //     enter.append("circle")
      //         .attr("cx", d => d * 15 + 10)
      //         .attr("cy", 10)
      //         .attr("r", 0)
      //         .attr("fill", "cornflowerblue")
      //       .call(enter => (
      //         enter.transition().duration(1200)
      //           .attr("cy", 10)
      //           .attr("r", 6)
      //           .style("opacity", 1)
      //       ))
      //   ),
      //   update => (
      //     update.attr("fill", "lightgrey")
      //   ),
      //   exit => (
      //     exit.attr("fill", "tomato")
      //       .call(exit => (
      //         exit.transition().duration(1200)
      //           .attr("r", 0)
      //           .style("opacity", 0)
      //           .remove()
      //       ))
      //   ),
      // )
      .style('cursor', 'move')
      .attr('r', (d) => (d.primary ? 40 : 25))
      .attr('fill', (d) => (d.primary ? '#967bb6' : d.foreignKey ? 'orange' : '#aacfcf'))
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
      .text((d) =>
        d.primary
          ? d.name.length > 7
            ? `${d.name.slice(0, 6)}..`
            : d.name
          : d.name.length > 5
          ? `${d.name.slice(0, 5)}..`
          : d.name
      )
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

  // creating a reference to the div which will wrap the generated graph and nothing more.
  return <svg ref={containerRef} className={styles.container} />;
}

export default ForceGraph;
