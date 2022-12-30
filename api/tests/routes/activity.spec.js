/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Activity, conn } = require('../../src/db.js');
const { _activity } = require('../data')

const agent = session(app);

describe('Activity routes', async () => {
  before(() => 
    conn.authenticate()
      .catch((err) => {
        console.error('Unable to connect to the database:', err);
      })
  );

  beforeEach(() => Activity.sync({ force: true })
    .then(() => Activity.create(_activity)));
    
  describe('GET /activities', () => {
    it('responds with 404', () =>
      agent.get('/activities').expect(404)
    );
  });

  describe('POST /activities', () => {
    it('responds with 200', () =>
      agent.post('/activities')
        .send({ ..._activity, name: 'skydiving' })
        .expect(200)
    );

    it('responds with 404 because it already exists', () =>
      setTimeout(() => {
        agent.post('/activities')
          .send({ ..._activity, name: 'skydiving' })
          .expect(404)
      }, 2000)
    );
  });
});
