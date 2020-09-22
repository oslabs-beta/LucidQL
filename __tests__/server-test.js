const request = require('supertest');

const server = 'http://localhost:8081';
const path = require('path');
const fs = require('fs');

// ?query=%7B%0A%20%20people%20%7B%0A%20%20%20%20name%0A%20%20%20%20hair_color%0A%20%20%20%20eye_color%0A%20%20%7D%0A%7D%0A

describe('Route integration', () => {
  describe('Get request to "/" endpoint', () => {
    describe('GET', () => {
      it('responds with 200 status and text/html content type', () =>
        request(server)
          .get('/')
          .expect('Content-Type', /text\/html/)
          .expect(200));
    });
  });

  describe('Get request to "/graphql" endpoint', () => {
    describe('GET', () => {
      it('responds with 200 status and application/json content type', () =>
        request(server)
          .get('/graphql')
          .expect('Content-Type', /application\/json/)
          .expect(400));
      // For this test, you'll need to inspect the body of the response and
      // ensure it contains the markets list. Check the markets.dev.json file
      // in the dev database to get an idea of what shape you're expecting.
      // it('markets from "DB" json are in body of response', () => {
      //   const table = JSON.parse(fs.readFileSync(marketFile));
      //   return request(server)
      //     .get('/markets')
      //     .expect(200)
      //     .then(response => {
      //       // console.log(JSON.stringify(response.body), 'here is table --->>>>', JSON.stringify(table));
      //       expect(response.body).toEqual(table);
      //       // assert(response.body, table); // <--------------- legacy shit
      //     });
      // });
    }); // describe get
  });
});
