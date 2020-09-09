import Graph from 'react-graph-vis';
import React, { Component, useEffect, useState } from 'react';
import { atom, selector, useRecoilValue, useRecoilState } from 'recoil';
import createGraph from '../UI';
import { state } from '../App';
import { useRecoilStateLoadable } from 'recoil';

const options = {
  edges: {
    arrows: {
      to: { enabled: true, scaleFactor: 1 },
      middle: { enabled: false, scaleFactor: 1 },
      from: { enabled: false, scaleFactor: 1 },
    },
    color: {
      // color: 'black',
    },
    smooth: false,
  },
  nodes: {
    borderWidth: 1,
    borderWidthSelected: 2,
    shape: 'circle',
    color: {
      border: 'black',
    },
    font: {
      color: 'white',
      size: 10,
      face: 'Tahoma',
      background: 'none',
      strokeWidth: 0,
      strokeColor: '#ffffff',
    },
    shadow: true,
  },
  physics: {
    maxVelocity: 146,
    solver: 'forceAtlas2Based',
    timestep: 0.35,
    stabilization: {
      enabled: true,
      iterations: 100,
      updateInterval: 10,
    },
  },
  layout: {
    randomSeed: undefined,
    improvedLayout: true,
  },
};

const style = {
  display: 'flex',
  width: '100rem',
  height: '70rem',
};

const VisGraph: React.FC = () => {
  const [fetched, setFetched] = useState(false);
  const [graph, setGraph] = useState({});
  const [data, setData] = useRecoilState(state);

  const getData = () => {
    fetch('/db/pg/draw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ uri: data.link }),
    })
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        setGraph(createGraph(response));
        setFetched(true);
      });
  };

  useEffect(() => {
    // console.log(graph);
    getData();
  }, [data]);

  if (fetched) {
    return (
      <div>
        <Graph className="graph" graph={graph} options={options} style={style} />
      </div>
    );
  } else if (!fetched) {
    return (
      <div className="empty-graph">
        <p>Please enter URI to display GraphQL endpoints...</p>
      </div>
    );
  }
};

export default VisGraph;
