import React, { useState, useEffect, useRef } from 'react'
import VisGraph from './components/visGraph'
import { RecoilRoot, atom, useRecoilState, useRecoilValue } from 'recoil'
import LinkContainer from './components/link-popup/LinkContainer';
import Sidebar from './components/navbars/sidenav';
import TopNav from './components/navbars/TopNav';

import "./styles.css";


export const state = atom({
    key: 'state',
    default: {
        link: '',
        modal: true
    }
})

const App: React.FC = () => {
    const [data, setData] = useRecoilState(state);

    const showModal = () => {
        setData({ ...data, modal: true });
    }

    useEffect(() => {
        console.log(data);
    }, [data])

    return (
        <>
            <div className='page-content-wrapper'>
                <TopNav showModal={showModal} />
                <div className="graph-div">
                    <LinkContainer />
                    <VisGraph />
                    <div className="code-box"><VisGraph /></div>
                </div>
            </div>
        </>
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