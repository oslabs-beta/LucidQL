import React from 'react';

export const Form = ({ onSubmit, onSubmitSample, mySQLButton }) => {
  return (
    <div>
      <form onSubmit={onSubmit}>
        <h3>LucidQL</h3>
        <br/>
        <h6>Quickly Build Your GraphQL API from Existing Postgres Database.</h6>
        <h6>Drag to Trash Can will exclude Table/Column You Do Not Need from GraphQL schema.</h6>
        <br/>
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
