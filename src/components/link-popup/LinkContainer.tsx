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
        console.log(response);
        setData({ ...data, link: link, modal: false, schema: response.schema, d3Data: response.d3Data });
      });
  };

  const onSubmit = async (event) => {
    event.preventDefault(event);
    if (event.target.link.value.trim() !== '') {
      // setData({ ...data, link: event.target.link.value, modal: false });
      fetchSchema(event.target.link.value);
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
