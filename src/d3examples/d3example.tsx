import React, { Component } from 'react';
import * as d3 from 'd3';
import ReactFauxDOM, { withFauxDOM } from 'react-faux-dom';
import ReactDOM from 'react-dom';


/* 
    Graph
    @props:
        nodes
        edges
*/
class Graph extends Component {
    constructor(props) {
        super(props);
    }
    drawGraph() {
        const reactfauxDOMnode = new ReactFauxDOM.createElement('svg');

        // start of my code;
        let width = 900;
        let height = 600;
        let svg = d3.select(reactfauxDOMnode);
        // Change 1: setting width and height
        svg.attr("width", width).attr("height", height);
        // Change 2: getting data from model
        const graph = {
            links: this.props.model.getEdges(),
            nodes: this.props.model.getLiked()
        };

        // Change 3: removed colors
        // var color = d3.scaleOrdinal(d3.schemeCategory20);

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) { return d.id; }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function (d) { return Math.sqrt(d.value); });

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("r", 5)
            // Change 3 removed colors
            .attr("fill", function (d) { "red"; })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(function (d) { return d.id; });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
            link
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });
        }

        return reactfauxDOMnode.toReact()
    }

    render() {
        return this.drawGraph();
    }
}

export default Graph;