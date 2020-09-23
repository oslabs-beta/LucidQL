import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { RecoilRoot } from 'recoil';

// import toJson from 'enzyme-to-json';
import TopNav from '../client/components/nav-bars/TopNav';
import App from '../client/App';
import Modal from '../client/components/link-popup/Modal.tsx';
import Footer from '../client/components/nav-bars/Footer.tsx';
import Form from '../client/components/link-popup/Form.tsx';

configure({ adapter: new Adapter() });

describe('React Unit Test', () => {
  describe('Modal Sample Button Test', () => {
    let wrapper;
    const props = {
      onSubmitSample: jest.fn(),
    };
    beforeAll(() => {
      wrapper = shallow(<Form {...props} />);
    });
    it('Button will invoke a function once Sample Button is clicked', () => {
      wrapper.find('#testenzyme').simulate('click');
      expect(props.onSubmitSample).toHaveBeenCalled();
    });
  });
  describe('mySQL Test', () => {
    let wrapper;
    const props = {
      mySQLButton: jest.fn(),
    };
    beforeAll(() => {
      wrapper = shallow(<Form {...props} />);
    });
    it('Button will bring you to mySQL modal once it is clicked', () => {
      wrapper.find('#testenzyme2').simulate('click');
      expect(props.mySQLButton).toHaveBeenCalled();
    });
  });

  describe('Close Button Test', () => {
    let wrapper;
    //wrapper
    const props = {
      closeModal: jest.fn(),
    };
    beforeAll(() => {
      wrapper = shallow(<Modal {...props} />);
    });
    it('Modal will close once this button is clicked', () => {
      wrapper.find('#closeModal1').simulate('click');
      expect(props.closeModal).toHaveBeenCalled();
    });
  });

  describe('Enter Postgres URI', () => {
    let wrapper;
    const props = {
      showModal: jest.fn(),
    };
    beforeAll(() => {
      wrapper = shallow(<TopNav {...props} />);
    });
    it('Modal to insert postgres URI opens', () => {
      wrapper.find('#postgresURIbutton').simulate('click');
      expect(props.showModal).toHaveBeenCalled();
    });
  });
});
