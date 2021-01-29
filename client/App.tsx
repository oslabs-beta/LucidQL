import React from 'react';
import { RecoilRoot, atom, useRecoilState } from 'recoil';
import LinkContainer from './components/link-popup/LinkContainer';
import TopNav from './components/nav-bars/TopNav';
import CodeBox from './components/codebox';
import SplitPane from 'react-split-pane';
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
    history: [],
  },
});

const App: React.FC = () => {
  const [data, setData] = useRecoilState(state);

  const showModal = () => {
    setData({ ...data, modal: true });
  };

  const handleUndo = () => {
    if (data.history.length > 0) {
      const newHistory = [...data.history]
      const prevData = newHistory.pop(); // get latest tableObj 
      const prevTable = prevData.table;
      const prevSchema = prevData.schema;
      setData({ ...data, schema: prevSchema, tables: prevTable, history: newHistory });
    }
  }

  const Annotation = () => {
    return (
      <div className="annotation">
        <h6 style={{color: "orange", fontWeight: "bolder"}}> ⟶ Foreign Key To (Postgres)</h6>
        <h6 style={{color: "#767c77", fontWeight: "bolder"}}> ⎯⎯⎯⎯⎯ Able To Query Each Other (GraphQL)</h6>
        <button className="form-control btn btn-light" onClick={()=>handleUndo()} >⎌ UNDO</button>
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
            {!data.modal ? <Annotation /> : null}
            {/* {!data.modal ? <ForceGraph nodeHoverTooltip={nodeHoverTooltip}/> : null}  */}
            {!data.modal ? <ForceGraph /> : null} 
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
