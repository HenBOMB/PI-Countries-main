const { Country, Activity, conn } = require('../../src/db.js');
const { expect } = require('chai');
const { _country, _activity } = require('../data')

describe('Country model', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  describe('Validators', () => {
    beforeEach(() => Country.sync({ force: true }));
    beforeEach(() => Activity.sync({ force: true }));

    it('should throw an error if country has any null properties', (done) => {
      Country.create({ })
        .then(() => done(new Error('Invalid country')))
        .catch(() => done());
    });

    it('should not throw an error if country is valid', (done) => {
      Country.create(_country)
        .then(() => done())
        .catch(() => done(new Error('Invalid country')));
    });

    describe('should not throw any errors', () => {
      it('area: str', (done) => {
        Country.create({..._country, area: 'str' })
          .then(() => done(new Error('Area must not be an int')))
          .catch(() => done());
      });
      it('population: str', (done) => {
        Country.create({..._country, population: 'str' })
          .then(() => done(new Error('Population must not be an int')))
          .catch(() => done());
      });
      it('area: -1', (done) => {
        Country.create({..._country, area: -1 })
          .then(() => done(new Error('Area must be greater than 0')))
          .catch(() => done());
      });
      it('area: 1', (done) => {
        Country.create({..._country, area: 1 })
          .then(() => done())
          .catch(() => done(new Error('Area must be greater than 0')));
      });
      it('population: -1', (done) => {
        Country.create({..._country, population: -1 })
          .then(() => done(new Error('Population must be greater than 0')))
          .catch(() => done());
      });
      it('population: 1', (done) => {
        Country.create({..._country, population: 1 })
          .then(() => done())
          .catch(() => done(new Error('Population must be greater than 0')));
      });
    });

    it('should create the Country if all required properties are ok', async () => {
      const c = await Country.create(_country);
      expect(c.toJSON()).haveOwnProperty('id', _country.id);
      expect(c.toJSON()).haveOwnProperty('name', _country.name);
      expect(c.toJSON()).haveOwnProperty('population', null);
    });

    it('activity countries should contain the same country', async () => {
      const activity = await Activity.create(_activity);
      const country = await Country.create(_country);
      await country.addActivity(activity)

      const activities = (await country.getActivities()).map(activity => activity.toJSON());

      expect(activities.length).equal(1)

      for (const key of Object.keys(_activity)) {
        expect(activity.toJSON()).haveOwnProperty(key, activities[0][key]);
      }
    });

    it('activity countries should contain the same country', async () => {
      const activity = await Activity.create(_activity);
      const country = await Country.create(_country);
      await country.addActivity(activity)

      const countries = (await activity.getCountries()).map(country => country.toJSON());

      expect(countries.length).equal(1)

      for (const key of Object.keys(_country)) {
        expect(country.toJSON()).haveOwnProperty(key, countries[0][key]);
      }
    });
  });
});
