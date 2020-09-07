import Graph from "react-graph-vis";
import React, { Component, useEffect, useState } from "react";
import { atom, selector, useRecoilValue, useRecoilState } from 'recoil';
import createGraph from '../UI'

const options = {
    edges: {
        arrows: {
            to: { enabled: true, scaleFactor: 1 },
            middle: { enabled: false, scaleFactor: 1 },
            from: { enabled: false, scaleFactor: 1 }
        },
        color: {
            // color: 'black',
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
            strokeColor: "#ffffff"
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

const style = {
    display: "flex",
    justifyContent: "center",
    width: "1000px",
    height: "1000px",
    border: "1px solid black",
}




const VisGraph: React.FC = () => {
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
                <Graph className="graph" graph={graph} options={options} style={style} />
            </div>
        );
    } else {
        return (
            <div>Loading...</div>
        )
    }

}

export default VisGraph;