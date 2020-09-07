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