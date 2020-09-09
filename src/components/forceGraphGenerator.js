import * as d3 from "d3";
// import { event as currentEvent} from 'd3-selection';

import "@fortawesome/fontawesome-free/css/all.min.css";
import styles from "./forceGraph.module.css";
// import * as selection from "d3-selection"
// const d3 = Object.assign(selection, require("d3-selection"), require("d3-drag"), require("d3-force"), require("d3-zoom"), require("d3-transition"));
// d3.getEvent = function () {
//   return require("d3-selection").event;
// }
// const currentEvent = require("d3-selection").event;

export function runForceGraph( container, linksData, nodesData, nodeHoverTooltip) {
  const links = linksData.map((d) => Object.assign({}, d));
  const nodes = nodesData.map((d) => Object.assign({}, d));
  console.log(links, nodes);
  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;

  const color = () => { return "#9D00A0"; };

  const icon = (d) => {
    return d.gender === "male" ? "\uf222" : "\uf221";
  }

  const getClass = (d) => {
    return d.gender === "male" ? styles.male : styles.female;
  };

  // from https://stackoverflow.com/questions/50559874/d3-event-is-null-in-webpack-build
  // getEvent = () => require("d3-selection").event;
  
  const drag = (simulation) => {
    const dragstarted = (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      console.log('1', d)
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (event, d) => {
      // console.log('dragged', d)
      // console.log('d3.event', d3.event)
      // console.log('d3.getEvent', d3.getEvent())
      // console.log('d3.getEvent.x', d3.getEvent.x)
      // console.log('d3.getEvent.y', d3.getEvent.y)
      d.fx = event.x;
      d.fy = event.y;
    };


    const dragended = (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      console.log('3', d)
      d.fx = null;
      d.fy = null;
    };

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  // Add the tooltip element to the graph
  const tooltip = document.querySelector("#graph-tooltip");
  if (!tooltip) {
    const tooltipDiv = document.createElement("div");
    tooltipDiv.classList.add(styles.tooltip);
    tooltipDiv.style.opacity = "0";
    tooltipDiv.id = "graph-tooltip";
    document.body.appendChild(tooltipDiv);
  }
  const div = d3.select("#graph-tooltip");

  const addTooltip = (hoverTooltip, d, x, y) => {
    div
      .transition()
      .duration(200)
      .style("opacity", 0.9);
    div
      .html(hoverTooltip(d))
      .style("left", `${x}px`)
      .style("top", `${y - 28}px`);
  };

  const removeTooltip = () => {
    div
      .transition()
      .duration(200)
      .style("opacity", 0);
  };

  // const simulation = d3
  // .forceSimulation(nodes)
  // .force("link", d3.forceLink(links).id(d => d.id))
  // .force("charge", d3.forceManyBody().strength(-150))
  // .force("x", d3.forceX())
  // .force("y", d3.forceY());

  const simulation = d3
  .forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id))
  .force("charge", d3.forceManyBody().strength(-150))
  .force("x", d3.forceX())
  .force("y", d3.forceY());

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .call(d3.zoom().on("zoom", function (event, d) {
      svg.attr("transform", event.transform);
    }));

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", d => Math.sqrt(d.value));

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 12)
    .attr("fill", color)
    .call(drag(simulation));

  const label = svg.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr("class", d => `fa ${getClass(d)}`)
    .text(d => {return icon(d);})
    .call(drag(simulation));

  label.on("mouseover", (event, d) => {
    addTooltip(nodeHoverTooltip, d, event.pageX, event.pageY);
  })
    .on("mouseout", () => {
      removeTooltip();
    });
  
  // -----------
  // simulation.nodes(nodes).on("tick", ticked);
  // simulation.force("link").links(links);
    
  // function ticked() {
  //   link
  //     .attr("x1", function(d: any) {
  //       return d.source.x;
  //     })
  //     .attr("y1", function(d: any) {
  //       return d.source.y;
  //     })
  //     .attr("x2", function(d: any) {
  //       return d.target.x;
  //     })
  //     .attr("y2", function(d: any) {
  //       return d.target.y;
  //     });

  //   node
  //     .attr("cx", function(d: any) {
  //       return d.x;
  //     })
  //     .attr("cy", function(d: any) {
  //       return d.y;
  //     });
  // }
  // -----------

  simulation.on("tick", () => {
    //update link positions
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
  
    // update node positions
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
    // node
    //   .attr("cx", d => d.x = d3.getEvent.x  )
    //   .attr("cy", d => d.y = d3.getEvent.y  );
  
    // update label positions
    label
      .attr("x", d => { return d.x; })
      .attr("y", d => { return d.y; })
  });


  return {
    destroy: () => {
      simulation.stop();
    },
    nodes: () => {
      return svg.node();
    }
  };
}