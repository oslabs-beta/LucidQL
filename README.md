![Image of Logo](/public/logo-for-github.jpg)

#

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/oslabs-beta/LucidQL/blob/master/LICENSE) ![GitHub package.json version](https://img.shields.io/github/package-json/v/oslabs-beta/LucidQL?color=blue) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/oslabs-beta/LucidQL/issues)

### What is lucidQL?

lucidQL is an open-source tool to assist developers in the migration from a legacy RESTful API to GraphQL. It also serves as a visualizer tool for your GraphQL API. lucidQL allows the user to view the GraphQL schema layout and relationships between data.

<a class="nav-link" href="http://www.lucidql.com/">Check out our app here</a>

### How does lucidQL work?

First choose your desired Postgres database that you want to use to create a graphQL API, and enter the link where prompted, and click submit. lucidQL will immediately start by reading your database, extracting all the tables, and their relationships, and generate a GraphQL schema.

![Image of Entering Link](https://media.giphy.com/media/1N6nX99joOh2zUGkAw/giphy.gif)

A visual representation will display on the left side of the tool, users can analyze their current database and their table relationships.

The lucidQL tool allows the user to simplify their schema by being able to delete any relationships that they no longer require.

- If any tables are undesired in the final product, simply drag a table to the garbage icon, lucidQL will handle the rest.
- The GraphQL schemas will be regenerated accordingly to your changes.
- if you make a mistake, simply click the undo button.

![Image of Dragging to Garbage](https://media.giphy.com/media/9NEeXDUayldkGkok4k/giphy.gif)

The connection file connects your Postgres API to your server. The server file sets up your server and includes playground so that you can query the information from your API as needed. Lastly, your schema file will provide you with queries, mutations, and resolvers based on your pre-existing relational database.

### How to Test Your Schema, Resolvers and Mutations

##### Option A:

Enter your Postgres URI and start testing your GraphQL API right away!

The lucidQL tool comes pre-packaged with a backend, which enables the user to access GraphQL playground and test querying immediately. After entering a Postgres URI. The user will just have to click on "GraphQL PLayground" which can be accessed through the side menu bar.

![Image of GraphQL Playground](https://media.giphy.com/media/Fh1DzzBFmRmZcSPVBO/giphy.gif)

##### Option B:

Download the package by clicking on the "Download" button

1. Download Files
2. Unzip package
3. Open directory
4. Install dependencies `npm install`
5. Run the application `npm start`
6. Once the application is running, enter localhost:3000/playground in your browser to start querying your database
7. Test and Query!

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
