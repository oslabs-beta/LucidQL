import React, { useState, useEffect } from 'react'
import VisGraph from './OtherGraph'
import "./styles.css";
import { RecoilRoot, atom, useRecoilState } from 'recoil'
import "regenerator-runtime/runtime";



const App: React.FC = () => {
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