import React, { useState, useEffect } from 'react'
import VisGraph from './OtherGraph'
import "./styles.css";
import { RecoilRoot, atom, useRecoilState } from 'recoil'
import "regenerator-runtime/runtime";


export const dataState = atom({
    key: 'dataState',
    default: {}
})


const App: React.FC = () => {
    const [data, setDataState] = useRecoilState(dataState);

    useEffect(() => {
        const getData = async () => {
            const response = await fetch('/db/pg/draw');
            const json = await response.json()
            setDataState(json);
        };

        getData();
    }, [])

    return (
        <div className="graph-div">
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