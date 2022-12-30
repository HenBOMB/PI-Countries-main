const { Country, Activity, conn } = require('../../src/db.js');
const { expect } = require('chai');
const { _country, _activity } = require('../data')

describe('Activity model', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  describe('Validators', () => {
    beforeEach(() => Activity.sync({ force: true }));
    beforeEach(() => Country.sync({ force: true }));

    it('should throw an error if difficuly is beyond 1-5 range', (done) => {
      Activity.create({ ..._activity, difficulty: 6 })
        .then(() => done(new Error('Difficuly is not within range')))
        .catch(() => done());
    });

    it('should throw an error if season is invalid', (done) => {
      Activity.create({ ..._activity, season: 'fall' })
        .then(() => done(new Error('Invalid season')))
        .catch(() => done());
    });

    describe('should not throw an error if season is valid', () => {
      it('summer', (done) => {
        Activity.create({ ..._activity, season: 'summer' })
          .then(() => done())
          .catch(() => done(new Error('Invalid season')));
      });
      it('winter', (done) => {
        Activity.create({ ..._activity, season: 'winter' })
          .then(() => done())
          .catch(() => done(new Error('Invalid season')));
      });
      it('autum', (done) => {
        Activity.create({ ..._activity, season: 'autum' })
          .then(() => done())
          .catch(() => done(new Error('Invalid season')));
      });
      it('spring', (done) => {
        Activity.create({ ..._activity, season: 'spring' })
          .then(() => done())
          .catch(() => done(new Error('Invalid season')));
      });
    })

    it('should create the Activity if all required properties are ok', async () => {
      const act = await Activity.create(_activity);
      for (const key of Object.keys(_activity)) {
        expect(act.toJSON()).haveOwnProperty(key, _activity[key]);
      }
    });

    it('country activities should contain the same activity', async () => {
      const activity = await Activity.create(_activity);
      const country = await Country.create(_country);
      await activity.addCountry(country)

      const activities = (await country.getActivities()).map(activity => activity.toJSON());

      expect(activities.length).equal(1)

      for (const key of Object.keys(_activity)) {
        expect(activity.toJSON()).haveOwnProperty(key, activities[0][key]);
      }
    });

    it('activity countries should contain the same activity', async () => {
      const activity = await Activity.create(_activity);
      const country = await Country.create(_country);
      await activity.addCountry(country)

      const countries = (await activity.getCountries()).map(country => country.toJSON());

      expect(countries.length).equal(1)

      for (const key of Object.keys(_country)) {
        expect(country.toJSON()).haveOwnProperty(key, countries[0][key]);
      }
    });

  });
});
