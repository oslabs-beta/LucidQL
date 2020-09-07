<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react'
import VisGraph from './components/visGraph'
import { RecoilRoot, atom, useRecoilState, useRecoilValue } from 'recoil'
import LinkContainer from './components/link-popup/LinkContainer'

import "./styles.css";


export const dbLink = atom({
    key: 'dbLink',
    default: ''
})

const App: React.FC = () => {
    const link = useRecoilValue(dbLink);

    useEffect(() => {
        console.log(link);
    }, [link])

    return (
        <div className="graph-div">
            <LinkContainer />
            <VisGraph />
        </div>
    );
}

function Root() {
    return (
        <RecoilRoot>
            <App />
        </RecoilRoot>
    )
}


export default Root;
=======
import React from 'react';
import CodeBox from './components/codebox';
import * as _d3 from 'd3';

class App extends React.PureComponent {
  render() {
    return (
      <div>
        <h1>Hello World!</h1>
        <CodeBox />
      </div>
    );
  }
}

export default App;
>>>>>>> 5f1137bc690226232370516f301370aa572451ba
