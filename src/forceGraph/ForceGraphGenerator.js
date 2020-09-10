import * as d3 from "d3";
import styles from "./ForceGraph.module.css";

export function runForceGraph( container, data, nodeHoverTooltip) {
  const { tableNodes, columnNodes, referencedBy, pointsTo, linksToColumns } = data
  // console.log(tableNodes, columnNodes, referencedBy, pointsTo, linksToColumns)

  // get the container’s width and height from bounding rectangle:
  const containerRect = container.getBoundingClientRect();
  // console.log('containerRect: ', containerRect)
  const height = containerRect.height;
  const width = containerRect.width;
  
  // add the option to drag the force graph nodes as part of it’s simulation.
  const drag = (simulation) => {
    const dragStart = (event, d) => {
      // dragstarted would be called once for each of the two fingers. 
      // The first time it get's called d3.event.active would be 0, and the simulation would be restarted. 
      // The second time d3.event.active would be 1, so the simulation wouldn't restart again, 
      // because it's already going.
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

      // below: node will fly back after drag ends
      // d.fx = null;
      // d.fy = null;
    };

    return d3
      .drag()
      .on("start", dragStart)
      .on("drag", dragging)
      .on("end", dragEnd);
  };

  
  // Handle the node tooltip generation: add the tooltip element to the graph
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
      .style("top", `${y+10}px`);
  };

  const removeTooltip = () => {
    div
      .transition()
      .duration(200)
      .style("opacity", 0);
  };

  const simulation = d3
    .forceSimulation([...tableNodes, ...columnNodes])
    .force("link", d3.forceLink([...referencedBy, ...pointsTo]).id(d => d.id).distance(400).strength(1))
    .force("line", d3.forceLink(linksToColumns).id(d => d.id).distance(50))
    .force("charge", d3.forceManyBody().strength(-600)) // Negative numbers indicate a repulsive force and positive numbers an attractive force. Strength defaults to -30 upon installation.
    .force('collision', d3.forceCollide().radius(d => d.r || 20))
    .force("x", d3.forceX()) // These two siblings push nodes towards the desired x and y position.
    .force("y", d3.forceY()); // default to the middle

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .call(d3.zoom().on("zoom", function (event, d) {
      svg.attr("transform", event.transform);
    }));

  // Initialize the links between tables and its columns
  const line = svg
    .append("g")
    .attr("stroke", "#000")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(linksToColumns)
    .join("line")
    .attr("stroke-width", d => Math.sqrt(d.value))

    
 // appending little triangles, path object, as arrowhead
 // The <defs> element is used to store graphical objects that will be used at a later time
 // The <marker> element defines the graphic that is to be used for drawing arrowheads or polymarkers 
 // on a given <path>, <line>, <polyline> or <polygon> element.
  svg
    .append("svg:defs")
    .selectAll("marker")
    .data(["end"])
    .enter()
    .append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10") // //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
    .attr("refX", 25) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
    .attr("refY", -1.5) 
    .attr("orient", "auto") 
    .attr("markerWidth", 13) 
    .attr("markerHeight", 13) 
    .attr('xoverflow', 'visible')
    .append("svg:path") 
    .attr("d", "M 0,-5 L 10,0 L 0,5") 
    .attr('fill', '#999')
    .style('stroke','none')

  // add the curved line
  const path = svg
    .append("svg:g")
    .selectAll("path")
    .data([...referencedBy, ...pointsTo])
    .join("svg:path")
    .attr("fill", "none")
    .style('stroke', d => d.type === "pointsTo" ? "orange" : "blue")
    .style('stroke-width','1.5px')
    .attr("marker-end", "url(#end)");
    //The marker-end attribute defines the arrowhead or polymarker that will be drawn at the final vertex of the given shape.

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1)
    .selectAll("circle")
    .data([...tableNodes, ...columnNodes])
    .join("circle")
    .attr("r", d => d.primary ? 30 : 15)
    .attr("fill", d => d.primary ? "#9D00A0" : "powderblue")
    // .style("stroke", "grey")
    // .style("stroke-opacity",0.3)
    // .style("stroke-width", d => d.runtime/10)
    // .style("fill", d => colorScale(d.group))
    .call(drag(simulation));

  const label = svg.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data([...tableNodes, ...columnNodes])
    .join("text")
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr("class", d => d.primary? styles.primary : styles.column)
    .text(d => d.name)
    .call(drag(simulation));

  label
    .on("mouseover", (event, d) => addTooltip(nodeHoverTooltip, d, event.pageX, event.pageY))
    .on("mouseout", () => removeTooltip());
  
  simulation.on("tick", () => {
    //update link positions
    line
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
  
    // update node positions
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    label
      .attr("x", d =>  d.x )
      .attr("y", d =>  d.y )

    // update the curvy lines
    path.attr("d", d => {
      const dx = d.target.x - d.source.x;;
      const dy = d.target.y - d.source.y;
      const dr = Math.sqrt(dx * dx + dy * dy);
      return "M" + 
          d.source.x + "," + 
          d.source.y + "A" + 
          dr + "," + dr + " 0 0,1 " + 
          d.target.x + "," + 
          d.target.y;
    });
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