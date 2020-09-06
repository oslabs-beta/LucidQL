import Graph from "react-graph-vis";
import React, { Component } from "react";
import { atom, selector, useRecoilValue, useRecoilState } from 'recoil';
import { dataState } from './App';

function createGraph(data) {
    let nodes = [];
    let edges = [];
    // access all table names on object
    let keys = Object.keys(obj);

    for (let i = 0; i < colors.length; i++) {
        // access properties on each table (columns, pointsTo, referencedBy)
        let columns = obj[keys[i]].columns
        let pointsTo = obj[keys[i]].pointsTo
        let referecedBy = obj[keys[i]].referecedBy

        nodes.push({ id: keys[i], label: keys[i], color: colors[i], size: 20, shape: 'circle' })
        for (let j = 0; j < columns.length; j++) {
            nodes.push({ id: columns[j] + j, label: columns[j], color: colors[i], shape: 'circle' })
            edges.push({ from: keys[i], to: columns[j] + j })
        }

        pointsTo.forEach(point => {
            edges.push({ from: keys[i], to: point, physics: { springLength: 200 } })
        })

        referecedBy.forEach(ref => {
            edges.push({ from: ref, to: keys[i], physics: { springLength: 200 } })
        })
    }
    return { nodes, edges }
}

const graph = {
    // nodes: [
    //     { id: "people", label: "People", color: "#e04141", size: 20, shape: 'circle' },
    //     { id: "planets", label: "Planets", color: "#e09c41", size: 20, shape: 'circle' },
    //     { id: 3, label: "Node 3", color: "#e0df41", size: 10 },
    //     { id: 4, label: "Node 4", color: "#7be041", size: 10 },
    //     { id: 5, label: "Node 5", color: "#41e0c9", size: 10 },
    //     { id: 6, label: "Node 6", color: "#41e0c9", size: 10 },
    //     { id: 7, label: "Node 7", color: "#41e0c9", size: 10 },
    //     { id: 8, label: "Node 8", color: "#41e0c9", size: 10 },
    //     { id: 9, label: "Node 9", color: "#41e0c9", size: 10 },
    //     { id: 10, label: "Node 10", color: "#41e0c9", size: 10 },
    //     { id: 11, label: "Node 1", color: "#41e0c9", size: 10 },
    // ],
    nodes: [
        {
            id: 'people',
            label: 'people',
            color: 'red',
            size: 20,
            shape: 'circle'
        },
        { id: 'gender0', label: 'gender', color: 'red', shape: 'circle' },
        {
            id: 'species_id1',
            label: 'species_id',
            color: 'red',
            shape: 'circle'
        },
        {
            id: 'homeworld_id2',
            label: 'homeworld_id',
            color: 'red',
            shape: 'circle'
        },
        { id: 'height3', label: 'height', color: 'red', shape: 'circle' },
        { id: 'mass4', label: 'mass', color: 'red', shape: 'circle' },
        {
            id: 'hair_color5',
            label: 'hair_color',
            color: 'red',
            shape: 'circle'
        },
        {
            id: 'skin_color6',
            label: 'skin_color',
            color: 'red',
            shape: 'circle'
        },
        {
            id: 'eye_color7',
            label: 'eye_color',
            color: 'red',
            shape: 'circle'
        },
        { id: 'name8', label: 'name', color: 'red', shape: 'circle' },
        {
            id: 'birth_year9',
            label: 'birth_year',
            color: 'red',
            shape: 'circle'
        },
        {
            id: 'films',
            label: 'films',
            color: 'blue',
            size: 20,
            shape: 'circle'
        },
        {
            id: 'director0',
            label: 'director',
            color: 'blue',
            shape: 'circle'
        },
        {
            id: 'opening_crawl1',
            label: 'opening_crawl',
            color: 'blue',
            shape: 'circle'
        },
        {
            id: 'episode_id2',
            label: 'episode_id',
            color: 'blue',
            shape: 'circle'
        },
        { id: 'title3', label: 'title', color: 'blue', shape: 'circle' },
        {
            id: 'release_date4',
            label: 'release_date',
            color: 'blue',
            shape: 'circle'
        },
        {
            id: 'producer5',
            label: 'producer',
            color: 'blue',
            shape: 'circle'
        },
        {
            id: 'planets',
            label: 'planets',
            color: 'green',
            size: 20,
            shape: 'circle'
        },
        {
            id: 'orbital_period0',
            label: 'orbital_period',
            color: 'green',
            shape: 'circle'
        },
        {
            id: 'climate1',
            label: 'climate',
            color: 'green',
            shape: 'circle'
        },
        {
            id: 'gravity2',
            label: 'gravity',
            color: 'green',
            shape: 'circle'
        },
        {
            id: 'terrain3',
            label: 'terrain',
            color: 'green',
            shape: 'circle'
        },
        {
            id: 'surface_water4',
            label: 'surface_water',
            color: 'green',
            shape: 'circle'
        },
        {
            id: 'population5',
            label: 'population',
            color: 'green',
            shape: 'circle'
        },
        { id: 'name6', label: 'name', color: 'green', shape: 'circle' },
        {
            id: 'rotation_period7',
            label: 'rotation_period',
            color: 'green',
            shape: 'circle'
        },
        {
            id: 'diameter8',
            label: 'diameter',
            color: 'green',
            shape: 'circle'
        },
        {
            id: 'species',
            label: 'species',
            color: 'orange',
            size: 20,
            shape: 'circle'
        },
        {
            id: 'hair_colors0',
            label: 'hair_colors',
            color: 'orange',
            shape: 'circle'
        },
        { id: 'name1', label: 'name', color: 'orange', shape: 'circle' },
        {
            id: 'classification2',
            label: 'classification',
            color: 'orange',
            shape: 'circle'
        },
        {
            id: 'average_height3',
            label: 'average_height',
            color: 'orange',
            shape: 'circle'
        },
        {
            id: 'average_lifespan4',
            label: 'average_lifespan',
            color: 'orange',
            shape: 'circle'
        },
        {
            id: 'skin_colors5',
            label: 'skin_colors',
            color: 'orange',
            shape: 'circle'
        },
        {
            id: 'eye_colors6',
            label: 'eye_colors',
            color: 'orange',
            shape: 'circle'
        },
        {
            id: 'language7',
            label: 'language',
            color: 'orange',
            shape: 'circle'
        },
        {
            id: 'homeworld_id8',
            label: 'homeworld_id',
            color: 'orange',
            shape: 'circle'
        },
        {
            id: 'vessels',
            label: 'vessels',
            color: 'purple',
            size: 20,
            shape: 'circle'
        },
        {
            id: 'cost_in_credits0',
            label: 'cost_in_credits',
            color: 'purple',
            shape: 'circle'
        },
        {
            id: 'length1',
            label: 'length',
            color: 'purple',
            shape: 'circle'
        },
        {
            id: 'vessel_type2',
            label: 'vessel_type',
            color: 'purple',
            shape: 'circle'
        },
        { id: 'model3', label: 'model', color: 'purple', shape: 'circle' },
        {
            id: 'manufacturer4',
            label: 'manufacturer',
            color: 'purple',
            shape: 'circle'
        },
        { id: 'name5', label: 'name', color: 'purple', shape: 'circle' },
        {
            id: 'vessel_class6',
            label: 'vessel_class',
            color: 'purple',
            shape: 'circle'
        },
        {
            id: 'max_atmosphering_speed7',
            label: 'max_atmosphering_speed',
            color: 'purple',
            shape: 'circle'
        },
        { id: 'crew8', label: 'crew', color: 'purple', shape: 'circle' },
        {
            id: 'passengers9',
            label: 'passengers',
            color: 'purple',
            shape: 'circle'
        },
        {
            id: 'cargo_capacity10',
            label: 'cargo_capacity',
            color: 'purple',
            shape: 'circle'
        },
        {
            id: 'consumables11',
            label: 'consumables',
            color: 'purple',
            shape: 'circle'
        },
        {
            id: 'starship_specs',
            label: 'starship_specs',
            color: 'gray',
            size: 20,
            shape: 'circle'
        },
        {
            id: 'vessel_id0',
            label: 'vessel_id',
            color: 'gray',
            shape: 'circle'
        },
        { id: 'MGLT1', label: 'MGLT', color: 'gray', shape: 'circle' },
        {
            id: 'hyperdrive_rating2',
            label: 'hyperdrive_rating',
            color: 'gray',
            shape: 'circle'
        }
    ],
    edges: [
        { from: 'people', to: 'gender0' },
        { from: 'people', to: 'species_id1' },
        { from: 'people', to: 'homeworld_id2' },
        { from: 'people', to: 'height3' },
        { from: 'people', to: 'mass4' },
        { from: 'people', to: 'hair_color5' },
        { from: 'people', to: 'skin_color6' },
        { from: 'people', to: 'eye_color7' },
        { from: 'people', to: 'name8' },
        { from: 'people', to: 'birth_year9' },
        { from: 'people', to: 'species', physics: { springLength: 200 } },
        { from: 'people', to: 'planets', physics: { springLength: 200 } },
        { from: 'films', to: 'people', physics: { springLength: 200 } },
        { from: 'vessels', to: 'people', physics: { springLength: 200 } },
        { from: 'films', to: 'director0' },
        { from: 'films', to: 'opening_crawl1' },
        { from: 'films', to: 'episode_id2' },
        { from: 'films', to: 'title3' },
        { from: 'films', to: 'release_date4' },
        { from: 'films', to: 'producer5' },
        { from: 'planets', to: 'films', physics: { springLength: 200 } },
        { from: 'people', to: 'films', physics: { springLength: 200 } },
        { from: 'vessels', to: 'films', physics: { springLength: 200 } },
        { from: 'species', to: 'films', physics: { springLength: 200 } },
        { from: 'planets', to: 'orbital_period0' },
        { from: 'planets', to: 'climate1' },
        { from: 'planets', to: 'gravity2' },
        { from: 'planets', to: 'terrain3' },
        { from: 'planets', to: 'surface_water4' },
        { from: 'planets', to: 'population5' },
        { from: 'planets', to: 'name6' },
        { from: 'planets', to: 'rotation_period7' },
        { from: 'planets', to: 'diameter8' },
        { from: 'films', to: 'planets', physics: { springLength: 200 } },
        { from: 'species', to: 'planets', physics: { springLength: 200 } },
        { from: 'people', to: 'planets', physics: { springLength: 200 } },
        { from: 'species', to: 'hair_colors0' },
        { from: 'species', to: 'name1' },
        { from: 'species', to: 'classification2' },
        { from: 'species', to: 'average_height3' },
        { from: 'species', to: 'average_lifespan4' },
        { from: 'species', to: 'skin_colors5' },
        { from: 'species', to: 'eye_colors6' },
        { from: 'species', to: 'language7' },
        { from: 'species', to: 'homeworld_id8' },
        { from: 'species', to: 'planets', physics: { springLength: 200 } },
        { from: 'people', to: 'species', physics: { springLength: 200 } },
        { from: 'films', to: 'species', physics: { springLength: 200 } },
        { from: 'vessels', to: 'cost_in_credits0' },
        { from: 'vessels', to: 'length1' },
        { from: 'vessels', to: 'vessel_type2' },
        { from: 'vessels', to: 'model3' },
        { from: 'vessels', to: 'manufacturer4' },
        { from: 'vessels', to: 'name5' },
        { from: 'vessels', to: 'vessel_class6' },
        { from: 'vessels', to: 'max_atmosphering_speed7' },
        { from: 'vessels', to: 'crew8' },
        { from: 'vessels', to: 'passengers9' },
        { from: 'vessels', to: 'cargo_capacity10' },
        { from: 'vessels', to: 'consumables11' },
        { from: 'films', to: 'vessels', physics: { springLength: 200 } },
        { from: 'people', to: 'vessels', physics: { springLength: 200 } },
        { from: 'starship_specs', to: 'vessels', physics: { springLength: 200 } },
        { from: 'starship_specs', to: 'vessel_id0' },
        { from: 'starship_specs', to: 'MGLT1' },
        { from: 'starship_specs', to: 'hyperdrive_rating2' },
        { from: 'starship_specs', to: 'vessels', physics: { springLength: 200 } }
    ]
};




const options = {
    edges: {
        arrows: {
            to: { enabled: true, scaleFactor: 1 },
            middle: { enabled: false, scaleFactor: 1 },
            from: { enabled: false, scaleFactor: 1 }
        },
        font: {
            color: "black",
            face: "Tahoma",
            size: 10,
            align: "top",
            strokeWidth: 0.3,
            strokeColor: "black"
        },
        shadow: true
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
    physics: true,
    layout: {
        randomSeed: undefined,
        improvedLayout: true,
    }
};

// const events = {
//     select: function (event) {
//         var { nodes, edges } = event;
//         console.log("Selected nodes:");
//         console.log(nodes);
//         console.log("Selected edges:");
//         console.log(edges);
//     }
// };

const VisGraph: React.FC = () => {
    const data = useRecoilValue(dataState)
    console.log(data);

    return (
        <div>
            {/* <Graph graph={graph} options={options} events={events} style={{ height: "640px" }} /> */}
            <Graph graph={graph} options={options} style={{ height: "640px" }} />
        </div>
    );
}

export default VisGraph;



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
//     physics: {
//         forceAtlas2Based: {
//             gravitationalConstant: 0.1,
//             centralGravity: 0,
//             springLength: 100,
//             springConstant: 0.18,
//             avoidOverlap: 10
//         },
//         maxVelocity: 146,
//         solver: 'forceAtlas2Based',
//         timestep: 0.35,
//         stabilization: {
//             enabled: true,
//             iterations: 1000,
//             updateInterval: 25
//         }
//     },
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