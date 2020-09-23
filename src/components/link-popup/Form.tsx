import React from 'react';

export const Form = ({ onSubmit, onSubmitSample }) => {
  return (
    <div>
    <form onSubmit={onSubmit}>
      <h3>Welcome to RESTlessQL</h3>
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
      </div>
    </form>
     <form>
      <hr/>
     <div className="form-group">
       <button className="form-control btn btn-light" type="submit" onClick = {(e)=> onSubmitSample(e)}>
         Use Sample Postgres URI
       </button>
     </div>
   </form>
   </div>
  );
};
export default Form;
