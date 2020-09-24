import React from 'react';

export const Form = ({ onSubmit, onSubmitSample, mySQLButton }) => {
  return (
    <div>
      <form onSubmit={onSubmit}>
        <h3>LucidQL</h3>
        <br />
        <h6>Quickly build your GraphQL API from an existing Postgres database.</h6>
        <h6>Dragging to trash can will remove Table or Columns you do not need from your GraphQL schema.</h6>
        <br />
        <p>Please enter a PostgresQL link below.</p>
        <div className="form-group">
          <label htmlFor="link">Link: </label>
          <input className="form-control" id="link" />
        </div>
        <div className="form-group">
          <button className="form-control btn btn-light submit" id="testenzyme3" type="submit">
            Submit
          </button>
          <hr />
          <button
            className="form-control btn btn-light secondary-btn"
            type="button"
            id="testenzyme"
            onClick={(e) => onSubmitSample(e)}
          >
            Use Sample Postgres URI
          </button>
          <p></p>
          <button
            className="form-control btn btn-light secondary-btn mySQL"
            type="button"
            id="testenzyme2"
            onClick={(e) => mySQLButton(e)}
          >
            Use MySQL Database
          </button>
        </div>
      </form>
    </div>
  );
};
export default Form;
