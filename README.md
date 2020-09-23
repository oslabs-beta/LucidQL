# lucidQL
 <h4 className="text">
          A developer tool that generates GraphQL from an established relational database and allows the user to view and simplify these relations.
 </h4>
 <h2>What is lucidQL?</h2>
  <h4>lucidQL is an open-source tool to assist developers in the migration from a legacy RESTful API to GraphQL. It also serves as a visualizer tool. lucidQL allows the user to view the GraphQL schema layout and relationships between data, which is rendered using D3.
  </h4>
  <h2>
<a class="nav-link" href="http://www.lucidql.com/">
                Check out our website here
      </a>
  </h2>
 <h2>How does lucidQL work?</h2>
 <h4>First select an existing Postgres URI that you want to use to create a graphQL schema and paste that link into lucidQL and send it. lucidQL will create a schema and provide you with the required files to setup your back end with GraphQL, which includes a server file, a connection file, and a schema file. lucidQL also allows the user to simplify their schema by being able to delete any relationships they no longer require by dragging a relationship into the garbage container. The user can also undo a deletion. </h4>
 <h4>The connection file connects your Postgres API to your server. The server file sets up your server and includes playground so that you can query the information from your API as needed. Lastly, your schema file will provide you with queries, mutations, and resolvers based on your Postgres URI.</h4>
 
  <h2 className="howto">
              How to Test Your Schema, Resolvers and Mutations
            </h2>
                    <h3 className="optionA">Option A:</h3>
    <h4 className="text">
            lucidQL also provides access to playgound to query an existing
            database. The user will just have to click on "GraphQL PLayground"
            which is found on the top left side of the page within the Navbar
            Icon. After clicking this button, the user will be redirected to
            playground.
    </h4>
     <img
          src="https://media.giphy.com/media/HhVpUqlOj2T4Bwme8K/giphy.gif"
          alt="readmeDemo"
        ></img>
         <h3 className="optionB">Option B:</h3>
          <h4 className="text">Download Files</h4>
          <h4 className="text">Unzip package</h4>
          <h4 className="text">Open directory</h4>
          <h4 className="text">Install dependencies with "npm install" </h4>
          <h4 className="text">Run the application with "npm start"</h4>
          <h4 className="text">
            After the application is running, enter localhost:3000/playground in
            your browser and you can start querying your database
          </h4>
    <h2>Contributing</h2>
         <h4>If you run into any bugs or have any suggestions for improvements, please feel free to open a github issue. Please include the following information in your github issue:</h4>
     <h4>Steps to Reproduce the issue</h4>
     <h5>1</h5>
     <h5>2</h5>
      <h5>3</h5>
     <h4>Expected Behavior:</h4>
     <h4>Actual Behavior:</h4>
     <h4>Reproduces How Often:</h4>
     <h4>Version X.x</h4>
     <h4>Additional Information:</h4>
     <h2>Authors</h2>
     <h3>Martin Chiang</h3>
      <h3>Stanley Huang</h3>
       <h3>Darwin Sinchi</h3>

     
          
 
