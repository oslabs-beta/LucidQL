import React from 'react';

export const Form = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <h4>Welcome to CanvasQL</h4>
      <p>Please enter a PostgresQL link below.</p>
      <div className="form-group">
        <label htmlFor="link">Link: </label>
        <input className="form-control" id="link" />
      </div>
      <div className="form-group">
        <button className="form-control btn btn-light" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};
export default Form;
