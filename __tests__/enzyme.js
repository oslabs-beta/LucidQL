import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// import toJson from 'enzyme-to-json';
import App from '../client/App.tsx';
import Modal from '../client/components/link-popup/Modal.tsx';

import Form from '../client/components/link-popup/Form.tsx';

configure({ adapter: new Adapter() });

describe('React Unit Test', () => {
  describe('Button Test', () => {
    let wrapper;
    const props = {
      onSubmitSample: jest.fn(),
      mySQLButton: jest.fn(),
    };
    beforeAll(() => {
      wrapper = shallow(<Form {...props} />);
    });
    it('Button will invoke a function once it is clicked', () => {
      wrapper.find('button').forEach((btn) => {
        btn.simulate('click');
      });
      expect(props.onSubmitSample).toHaveBeenCalled();
      expect(props.mySQLButton).toHaveBeenCalled();
    });
  });
  // checking if modal closes on click
  describe('Modal Closes Test', () => {
    let modalWrapper;
    let stateWrapper;
    const props = {
      closeModal: jest.fn(),
    };
    beforeAll(() => {
      modalWrapper = shallow(<Modal {...props} />);
      stateWrapper = shallow(<App />);
    });
    it('Modal has closed', () => {
      wrapper.find();
    });
  });
});
