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

  const fetchSchemaPG = (link) => {
    fetch('/db/pg/sdl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uri: link }),
    })
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        setData({ ...data, link: link, modal: false, schema: response.schema, tables: response.tables });
      });
  };

  const onSubmit = async (event) => {
    event.preventDefault(event);
    if (event.target.link.value.trim() !== '') {
      fetchSchemaPG(event.target.link.value);
    }
  };

  const fetchSchemaMySQL = (host, user, password, database) => {
    fetch('/db/mySQL/sdl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ host, user, password, database }),
    })
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        setData({ link: '', modal: false, schema: response.schema, d3Data: response.d3Data });
      });
  };

  const onSubmitMySQL = async (event) => {
    event.preventDefault(event);
    const { host, user, password, database } = event.target;
    // if (event.target.link.value.trim() !== '') {
    //   fetchSchemaPG(event.target.link.value);
    // }
    fetchSchemaMySQL(host.value, user.value, password.value, database.value);
  };

  const onSubmitSample = async (event) => {
    event.preventDefault(event);
    fetch('/db/pg/sdl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uri: 'postgres://ordddiou:g5OjOyAIFxf-tsLk1uwu4ZOfbJfiCFbh@ruby.db.elephantsql.com:5432/ordddiou',
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        setData({
          ...data,
          link: 'postgres://ordddiou:g5OjOyAIFxf-tsLk1uwu4ZOfbJfiCFbh@ruby.db.elephantsql.com:5432/ordddiou',
          modal: false,
          schema: response.schema,
          tables: response.tables,
        });
      });
  };

  const closeModal = () => {
    setData({ ...data, modal: false });
  };

  const toggleScrollLock = () => {
    document.querySelector('html').classList.toggle('scroll-lock');
  };

  return (
    <React.Fragment>
      {data.modal ? (
        <Modal onSubmit={onSubmit} onSubmitMySQL={onSubmitMySQL} onSubmitSample={onSubmitSample} closeModal={closeModal} />
      ) : null}
    </React.Fragment>
  );
};

export default LinkContainer;
