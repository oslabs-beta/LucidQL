import React from 'react';

const SideBar: React.FC = () => {
  function closeNav() {
    document.querySelector('#mySidebar').style.width = '0';
    document.querySelector('#main').style.marginLeft = '0';
  }
  return (
    <div id="mySidebar" className="sidebar bg-dark">
      <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>
        x
      </a>
      <a href="#">Dashboard</a>
      <a href="http://localhost:3000/playground" target="_blank">
        GraphQL Playground
      </a>
      <a href="#">Clients</a>
      <a href="#">Contact</a>
    </div>
  );
};

export default SideBar;
