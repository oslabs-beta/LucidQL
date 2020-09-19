import React from 'react';

export const Form = ({ onSubmit, onSubmitSample }) => {
  return (
    <div>
    <form onSubmit={onSubmit}>
      <h4>Welcome to RESTlessQL</h4>
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
     <form>
    <div className = "orCenter">OR</div>
     <div className="form-group">
       <button className="form-control btn btn-light" type="submit" onClick = {(e)=> onSubmitSample(e)}>
         Submit Sample Postgres URI
       </button>
     </div>
   </form>
   </div>
  );
};
export default Form;
