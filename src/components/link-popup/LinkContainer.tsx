import React, { useState, useEffect } from 'react';
import { state } from '../../App';
import { useRecoilState } from 'recoil';
import { Modal } from './Modal';
import 'regenerator-runtime/runtime';

const LinkContainer: React.FC = () => {
  const [data, setData] = useRecoilState(state);

  useEffect(() => {
    toggleScrollLock();
  }, [data]);

  const fetchSchema = (link) => {
    fetch('/db/pg/sdl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uri: link }),
    })
      .then((response) => response.json())
      .then((response) => {
        setData({ ...data, modal: false, schema: response });
      });
  };

  const onSubmit = async (event) => {
    event.preventDefault(event);
    if (event.target.link.value.trim() !== '') {
      fetchSchema(event.target.link.value);
      setData({ link: event.target.link.value, modal: false });
    }
    // console.log((event.target.link.value).trim());
  };

  const closeModal = () => {
    setData({ ...data, modal: false });
  };

  const toggleScrollLock = () => {
    document.querySelector('html').classList.toggle('scroll-lock');
  };

  return (
    <React.Fragment>
      {data.modal ? <Modal onSubmit={onSubmit} closeModal={closeModal} /> : null}
    </React.Fragment>
  );
};

export default LinkContainer;
