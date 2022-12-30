/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Country, conn } = require('../../src/db.js');
const { _country } = require('../data')

const agent = session(app);

describe('Country routes', async () => {
  before(() => 
    conn.authenticate()
      .catch((err) => {
        console.error('Unable to connect to the database:', err);
      })
  );

  beforeEach(() => Country.sync({ force: true })
    .then(() => Country.create(_country)));
    
  describe('GET /countries', () => {
    it('responds with 200', () =>
      agent.get('/countries').expect(200)
    );

    it('responds with the country using an id', () => 
      agent.get('/countries/ARG').then((res) => {
        for (const key of Object.keys(_country)) {
          expect(res.body).to.have.property(key).that.equals(_country[key]);
        }
      })
    );

    it('responds with the country using a name', () =>
      agent.get('/countries?name=Agentina').then((res) => {
        for (const key of Object.keys(_country)) {
          expect(res.body).to.have.property(key).that.equals(_country[key]);
        }
      })
    );

  });
});
