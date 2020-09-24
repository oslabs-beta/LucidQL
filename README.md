![Image of Logo](https://github.com/oslabs-beta/LucidQL/blob/master/public/logo-for-github.jpg?raw=true)

#

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/oslabs-beta/LucidQL/blob/master/LICENSE) ![GitHub package.json version](https://img.shields.io/github/package-json/v/oslabs-beta/LucidQL?color=blue) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/oslabs-beta/LucidQL/issues)

### What is lucidQL?

lucidQL is an open-source tool to assist developers in the migration from a legacy RESTful API to GraphQL. It also serves as a visualizer tool for your GraphQL API. lucidQL allows the user to view the GraphQL schema layout and relationships between data.

<a class="nav-link" href="http://www.lucidql.com/">Check out our app here</a>

### How does lucidQL work?

First choose your desired Postgres database that you want to use to create a graphQL API, and paste that link into lucidQL and click submit. lucidQL will create a schema and provide you with the required files to setup your back end with GraphQL, which includes a server file, a connection file, and a schema file. lucidQL also allows the user to simplify their schema by being able to delete any relationships that they no longer require.

The connection file connects your Postgres API to your server. The server file sets up your server and includes playground so that you can query the information from your API as needed. Lastly, your schema file will provide you with queries, mutations, and resolvers based on your pre-existing relational database.

### How to Test Your Schema, Resolvers and Mutations

##### Option A:

lucidQL provides access to GraphQL playground to query an existing database. The user will just have to click on "GraphQL PLayground" which is found on the top left side of the page within the Navbar Icon. After clicking this button, the user will be redirected to GraphQL playground.

![Image of GraphQL Playground](https://media.giphy.com/media/HhVpUqlOj2T4Bwme8K/giphy.gif)

##### Option B:

1. Download Files
   - via the download button on the bottom right hand side of the app
2. Unzip package
3. Open directory
4. Install dependencies `npm install`
5. Run the application `npm start`
6. Once the application is running, enter localhost:3000/playground in your browser to start querying your database

### Contributing

We would love for you to test this application out and submit any issues you encounter. Also, feel free to fork to your own repository and submit PRs.

Here are some of the ways you can start contributing!

- Bug Fixes.
- Adding Features (Check Future Features above).
- Submitting or resolving any GitHub Issues.
- Help market our platform.
- Any way that can spread word or improve lucidQL

### Authors

- Martin Chiang
- Stanley Huang
- Darwin Sinchi

### License

MIT
