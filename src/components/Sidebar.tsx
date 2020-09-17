import React from 'react';
import { useRecoilValue } from 'recoil';
import { state } from '../App';
import { writeToDummyServer } from './nav-bars/Footer';

const SideBar: React.FC = () => {
  const data = useRecoilValue(state);
  const closeNav = () => {
    document.querySelector('#mySidebar').style.width = '0';
    document.querySelector('#main').style.marginLeft = '0';
  };

  return (
    <div id="mySidebar" className="sidebar bg-dark">
      <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>
        x
      </a>
      <a href="#">Dashboard</a>
      <a href="http://localhost:3000/playground" target="_blank" onClick={() => writeToDummyServer(data.schema, data.link)}>
        GraphQL Playground
      </a>
      <a href="#">Build API from Scratch</a>
    </div>
  );
};

export default SideBar;
