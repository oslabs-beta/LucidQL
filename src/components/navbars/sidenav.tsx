import { Navbar, NavDropdown, Form, FormControl, Button, Nav } from 'react-bootstrap';
import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div class="bg-light border-right" id="sidebar-wrapper">
      <div class="sidebar-heading">Start Bootstrap </div>
      <div class="list-group list-group-flush">
        <a href="#" class="list-group-item list-group-item-action bg-light">
          Dashboard
        </a>
        <a href="#" class="list-group-item list-group-item-action bg-light">
          Shortcuts
        </a>
        <a href="#" class="list-group-item list-group-item-action bg-light">
          Overview
        </a>
        <a href="#" class="list-group-item list-group-item-action bg-light">
          Events
        </a>
        <a href="#" class="list-group-item list-group-item-action bg-light">
          Profile
        </a>
        <a href="#" class="list-group-item list-group-item-action bg-light">
          Status
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
