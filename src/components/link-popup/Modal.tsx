import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from './Form';
import FocusTrap from 'focus-trap-react';

export const Modal: React.FC = ({ onSubmit, closeModal, onSubmitSample }) => {
  return ReactDOM.createPortal(
    <FocusTrap>
      <aside tag="aside" role="dialog" tabIndex="-1" aria-modal="true" className="modal-cover">
        <div className="modal-area">
          <button
            aria-label="Close Modal"
            aria-labelledby="close-modal"
            className="_modal-close"
            onClick={closeModal}
          >
            <svg className="_modal-close-icon" viewBox="0 0 40 40">
              <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
            </svg>
          </button>
          <div className="modal-body">
            <Form onSubmit={onSubmit} onSubmitSample ={onSubmitSample} />
          </div>
        </div>
      </aside>
    </FocusTrap>,
    document.body
  );
};

export default Modal;
