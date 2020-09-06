import Graph from "react-graph-vis";
import React, { Component, useEffect, useState } from "react";
import { atom, selector, useRecoilValue, useRecoilState } from 'recoil';
import createGraph from './UI'

const options = {
    edges: {
        arrows: {
            to: { enabled: true, scaleFactor: 1 },
            middle: { enabled: false, scaleFactor: 1 },
            from: { enabled: false, scaleFactor: 1 }
        },
        color: {
            // color: 'black',
            hightlight: '#848484',
            inherit: 'false'
        },
        smooth: false,

    },
    nodes: {
        borderWidth: 1,
        borderWidthSelected: 2,
        shape: "circle",
        color: {
            border: "black"
        },
        font: {
            color: "white",
            size: 10,
            face: "Tahoma",
            background: "none",
            strokeWidth: 0,
            strokeColor: "#ffffff",
            hightlight: 'blue'
        },
        shadow: true
    },
    physics: {

        maxVelocity: 146,
        solver: 'forceAtlas2Based',
        timestep: 0.35,
        stabilization: {
            enabled: true,
            iterations: 100,
            updateInterval: 10
        }
    },
    layout: {
        randomSeed: undefined,
        improvedLayout: true,
    }
};

// const options = {
//     layout: {
//         hierarchical: false
//     },
//     edges: {
//         arrows: {
//             to: { enabled: true, scaleFactor: 1 },
//             middle: { enabled: false, scaleFactor: 1 },
//             from: { enabled: false, scaleFactor: 1 }
//         },
//         font: {
//             color: "black",
//             face: "Tahoma",
//             size: 10,
//             align: "top",
//             strokeWidth: 0.3,
//             strokeColor: "black"
//         },
//         shadow: true
//     },
//     // physics: {
//     //     forceAtlas2Based: {
//     //         gravitationalConstant: 0.1,
//     //         centralGravity: 0,
//     //         springLength: 100,
//     //         springConstant: 0.18,
//     //         avoidOverlap: 10
//     //     },
//     //     maxVelocity: 146,
//     //     solver: 'forceAtlas2Based',
//     //     timestep: 0.35,
//     //     stabilization: {
//     //         enabled: true,
//     //         iterations: 1000,
//     //         updateInterval: 25
//     //     }
//     // },
//     physics: true,
//     nodes: {
//         fixed: {
//             x: false,
//             y: false
//         },
//         font: {
//             color: "white",
//             size: 10,
//             face: "Tahoma",
//             background: "none",
//             strokeWidth: 0,
//             strokeColor: "#ffffff"
//         },
//         borderWidth: 1.5,
//         borderWidthSelected: 2,
//         font: {
//             size: 15,
//             align: "center",
//             bold: {
//                 color: "#bbbdc0",
//                 size: 15,
//                 vadjust: 0,
//                 mod: "bold"
//             }
//         }
//     },
// };


export const dataState = atom({
    key: 'dataState',
    default: {}
})

const VisGraph: React.FC = () => {
    const [data, setData] = useRecoilState(dataState);
    const [fetched, setFetched] = useState(false);
    const [graph, setGraph] = useState({})

    useEffect(() => {
        const getData = () => {
            fetch('/db/pg/draw')
                .then(response => response.json())
                .then(data => {
                    let result = createGraph(data)
                    setGraph(result);
                    setFetched(true)
                })
        }
        getData();
    }, [])

    if (fetched) {
        return (
            <div>
                <Graph graph={graph} options={options} style={{ height: "640px" }} />
            </div>
        );
    } else {
        return (
            <div>Loading...</div>
        )
    }

}

export default VisGraph;



// 