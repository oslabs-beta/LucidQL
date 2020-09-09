import React, { useState, useEffect, useRef } from 'react';
import VisGraph from './components/visGraph';
import { RecoilRoot, atom, useRecoilState, useRecoilValue } from 'recoil';
import LinkContainer from './components/link-popup/LinkContainer';
import TopNav from './components/navbars/TopNav';
import CodeBox from './components/codebox';
import './styles.css';
import SplitPane from 'react-split-pane';

export const state = atom({
  key: 'state',
  default: {
    link: '',
    modal: true,
    schema: '',
    visGraph: {},
  },
});

const App: React.FC = () => {
  const [data, setData] = useRecoilState(state);

  const showModal = () => {
    setData({ ...data, modal: true });
  };

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  return (
    <>
      <div className="page-content-wrapper">
        <TopNav showModal={showModal} />
        <LinkContainer />
        <SplitPane split="vertical" minSize={50}>
          <div className="graph-div">
            <VisGraph />
          </div>
          <div className="code-box">
            <CodeBox />
          </div>
        </SplitPane>
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
