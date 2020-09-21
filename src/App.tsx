import React, { useState, useEffect, useRef } from 'react';
import { RecoilRoot, atom, useRecoilState, useRecoilValue } from 'recoil';
import LinkContainer from './components/link-popup/LinkContainer';
import TopNav from './components/nav-bars/TopNav';
import CodeBox from './components/codebox';
import SplitPane from 'react-split-pane';
import TableController from './forceGraph/TableController';
import ForceGraph from './forceGraph/ForceGraph';
import Footer from './components/nav-bars/Footer';
import Sidebar from './components/Sidebar';
import './styles.css';

export const state = atom({
  key: 'state',
  default: {
    link: '',
    modal: true,
    schema: '',
    tables: {},
    tableModified: false,
  },
});

const App: React.FC = () => {
  const [data, setData] = useRecoilState(state);

  const showModal = () => {
    setData({ ...data, modal: true });
  };

  const nodeHoverTooltip = React.useCallback((node) => {
    if (node.primary) return `<p>${node.name}</p>\n<button>Add Column</button><button>Add Relations</button><button>Delete</button>`
    else return `<p>${node.name}</p>\n<button>Delete</button>`
  }, []);

  const annotation = () => {
    return (
      <div style={{ position: 'fixed', top: '10vh', left: '5vw'}}>
        <h5 style={{color: "orange", fontWeight: "bolder"}}> ⟶ Foreign Key To</h5>
        <h5 style={{color: "#C4FB6D", fontWeight: "bolder"}}> ⟶ Referenced By</h5>
      </div>
    )
  }

  return (
    <div id="main">
      <div className="page-content-wrapper">
        <TopNav showModal={showModal} />
        <Sidebar />
        <LinkContainer />
        <SplitPane split="vertical" minSize={50} resizerClassName="Resizer" resizerStyle={{ width: '20px' }}>
        <div className="graph-div">
            {!data.modal ? annotation() : null }
            {!data.modal ? <TableController /> : null }
            {!data.modal ? <ForceGraph nodeHoverTooltip={nodeHoverTooltip} /> : null} 
          </div>
          <div className="code-box">
            <CodeBox />
          </div>
        </SplitPane>
        <Footer />
      </div>
    </div>
  );
};

function Root() {
  return (
    <RecoilRoot>
      <App />
    </RecoilRoot>
  );
}

export default Root;
