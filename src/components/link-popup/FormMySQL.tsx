import React from 'react';

export const FormMySQL = ({ onSubmitMySQL, mySQLButton }) => {
  return (
    <div>
      <form onSubmit={onSubmitMySQL}>
        <h4>Welcome to RESTlessQL</h4>
        <p>Please enter MySQL information below.</p>
        <div className="form-group">
          <label htmlFor="host">Host: </label>
          <input className="form-control" id="host" />
          <label htmlFor="user">Username: </label>
          <input className="form-control" id="user" />
          <label htmlFor="password">Password: </label>
          <input className="form-control" id="password" />
          <label htmlFor="database">Database: </label>
          <input className="form-control" id="database" />
        </div>
        <div className="form-group">
          <button className="form-control btn btn-light" type="submit">
            Submit
          </button>
          <p></p>
          <button className="form-control btn btn-light secondary-btn" type="button" onClick={(e) => mySQLButton(e)}>
            Back to Postgres
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormMySQL;
