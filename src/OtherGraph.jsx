import Graph from "react-graph-vis";
// import Graph from "../../lib";

// import Graph from 'react-graph-vis'

import React, { Component } from "react";
import { render } from "react-dom";

const graph = {
    nodes: [
        { id: "people", label: "People", color: "#e04141" },
        { id: "planets", label: "Planets", color: "#e09c41", shape: "dot" },
        { id: 3, label: "Node 3", color: "#e0df41", shape: "dot", size: 10 },
        { id: 4, label: "Node 4", color: "#7be041", shape: "dot", size: 10 },
        { id: 5, label: "Node 5", color: "#41e0c9", shape: "dot", size: 10 },
        { id: 6, label: "Node 6", color: "#41e0c9", shape: "dot", size: 10 },
        { id: 7, label: "Node 7", color: "#41e0c9", shape: "dot", size: 10 },
        { id: 8, label: "Node 8", color: "#41e0c9", shape: "dot", size: 10 },
        { id: 9, label: "Node 9", color: "#41e0c9", shape: "dot", size: 10 },
        { id: 10, label: "Node 10", color: "#41e0c9", shape: "dot", size: 10 },
        { id: 11, label: "Node 1", color: "#41e0c9", shape: "dot", size: 10 },
    ],
    edges: [{ from: "people", to: "planets", physics: { springLength: 200 } }, { from: "people", to: 6 }, { from: "people", to: 7 }, { from: "people", to: 8 }, { from: "people", to: 9 }, { from: "people", to: 3 }, { from: "planets", to: 4 }, { from: "planets", to: 5 }]
};

const options = {
    layout: {
        hierarchical: false
    },
    // edges: {
    //     color: "#000000"
    // },
    physics: {
        forceAtlas2Based: {
            gravitationalConstant: 0.1,
            centralGravity: 0,
            springLength: 100,
            springConstant: 0.18,
            avoidOverlap: 10
        },
        maxVelocity: 146,
        solver: 'forceAtlas2Based',
        timestep: 0.35,
        stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 25
        }
    },
    nodes: {
        fixed: {
            x: false,
            y: false
        },
        shape: "dot",
        borderWidth: 1.5,
        borderWidthSelected: 2,
        font: {
            size: 15,
            align: "center",
            bold: {
                color: "#bbbdc0",
                size: 15,
                vadjust: 0,
                mod: "bold"
            }
        }
    },
    edges: {
        width: 0.01,
        color: {
            color: "#00000",
            highlight: "#797979",
            hover: "#797979",
            opacity: 1.0
        },
        arrows: {
            to: { enabled: true, scaleFactor: 1, type: "arrow" },
            middle: { enabled: false, scaleFactor: 1, type: "arrow" },
            from: { enabled: false, scaleFactor: 1, type: "arrow" }
        },
        smooth: {
            type: "continuous",
            roundness: 0
        }
    },
};

const events = {
    select: function (event) {
        var { nodes, edges } = event;
        console.log("Selected nodes:");
        console.log(nodes);
        console.log("Selected edges:");
        console.log(edges);
    }
};

class OtherGraph extends Component {
    render() {
        return (
            <div>
                <Graph graph={graph} options={options} events={events} style={{ height: "640px" }} />
            </div>
        );
    }
}

export default OtherGraph;

