const request = require('supertest');

const server = 'http://localhost:8081';
const path = require('path');
const fs = require('fs');

describe('Route integration', () => {
  describe('/', () => {
    describe('GET', () => {
      it('responds with 200 status and text/html content type', () =>
        request(server)
          .get('/')
          .expect('Content-Type', /text\/html/)
          .expect(200));
    });
  });
});
