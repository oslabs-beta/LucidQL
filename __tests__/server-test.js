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
      it('responds with 400 status and application/json content type', () =>
        request(server)
          .get('/graphql')
          .expect('Content-Type', /application\/json/)
          .expect(400));

      it('responds with 400 status and application/json content type', () =>
        request(server)
          .get(
            '/graphql?query=%7B%0A%20%20people%20%7B%0A%20%20%20%20name%0A%20%20%20%20hair_color%0A%20%20%20%20eye_color%0A%20%20%7D%0A%7D%0A'
          )
          .expect('Content-Type', /application\/json/)
          .expect(200));
    });
  });

  describe('Get request to "/playground" endpoint', () => {
    describe('GET', () => {
      it('responds with 200 status and text/html content type', () =>
        request(server)
          .get('/playground')
          .expect('Content-Type', /text\/html/)
          .expect(200));
    });
  });

  describe('Get request to "/db/pg/sdl" endpoint with no body', () => {
    describe('POST', () => {
      it('responds with 400 status and application/json content type', () =>
        request(server)
          .post('/db/pg/sdl')
          .expect('Content-Type', /application\/json/)
          .expect(500));

      it('responds with 200 status and application/json content type', () =>
        request(server)
          .post('/db/pg/sdl')
          .send({ uri: 'postgres://mxnahgtg:V5_1wi1TPrDLRvmsl0pKczgf9SMQy1j6@lallah.db.elephantsql.com:5432/mxnahgtg' })
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(200));
    });
  });
});
