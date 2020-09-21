import React from 'react';

export const Form = ({ onSubmit, onSubmitSample, mySQLButton }) => {
  return (
    <div>
      <form onSubmit={onSubmit}>
        <h4>Welcome to LucidQL</h4>
        <p>Please enter a PostgresQL link below.</p>
        <div className="form-group">
          <label htmlFor="link">Link: </label>
          <input className="form-control" id="link" />
        </div>
        <div className="form-group">
          <button className="form-control btn btn-light" type="submit">
            Submit
          </button>
          <hr />
          <button className="form-control btn btn-light secondary-btn" type="button" onClick={(e) => onSubmitSample(e)}>
            Use Sample Postgres URI
          </button>
          <p></p>
          <button className="form-control btn btn-light secondary-btn" type="button" onClick={(e) => mySQLButton(e)}>
            Use MySQL Database
          </button>
        </div>
      </form>
    </div>
  );
};
export default Form;
