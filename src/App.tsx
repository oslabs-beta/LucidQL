import React, { useState, useEffect, useRef } from 'react';
// import VisGraph from './components/visGraph';
import { RecoilRoot, atom, useRecoilState, useRecoilValue } from 'recoil';
import LinkContainer from './components/link-popup/LinkContainer';
import TopNav from './components/navbars/TopNav';
import CodeBox from './components/codebox';
import './styles.css';
import SplitPane from 'react-split-pane';
import { ForceGraph } from './forceGraph/ForceGraph';
import Footer from './components/navbars/Footer';
import { handleDownloadFiles } from './UI';

export const state = atom({
  key: 'state',
  default: {
    link: '',
    modal: true,
    schema: '',
    d3Data: {},
  },
});

const App: React.FC = () => {
  const [data, setData] = useRecoilState(state);

  const showModal = () => {
    setData({ ...data, modal: true });
  };

  const nodeHoverTooltip = React.useCallback((node) => {
    return `<div>${node.name}</div>`;
  }, []);

  useEffect(() => {
    console.log('data is: ', data);
  }, [data]);

  return (
    <>
      <div className="page-content-wrapper">
        <TopNav showModal={showModal} />
        <LinkContainer />
        <SplitPane split="vertical" minSize={50} resizerClassName="Resizer" resizerStyle={{ width: '20px' }}>
          <div className="graph-div">
            {!data.modal ? <ForceGraph data={data.d3Data} nodeHoverTooltip={nodeHoverTooltip} /> : null}
          </div>
          <div className="code-box">
            <CodeBox />
          </div>
        </SplitPane>
        <Footer handleDownloadFiles={handleDownloadFiles} />
      </div>
    </>
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
