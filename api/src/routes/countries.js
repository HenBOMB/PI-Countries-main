const request = require('request');
const { Router } = require("express");
const { Country } = require("../db");
const { Op } = require('sequelize');
const router = Router();

function initCountries() {
    return new Promise(async resolve => {
        const all = await Country.findAll();

        if(all.length > 2) {
            // console.log(all.length);
            return resolve();
        }

        request({url: 'https://restcountries.com/v3/all', json: true}, async (err, res, json) => {
            // console.log('destroying...');

            await Country.destroy({
                where: {},
            });

            // console.log('creating...');

            await Country.bulkCreate(json.map(c => {
                return {
                    id: c.cca3 || c.cioc || c.tld,
                    name: c.name.common,
                    image: c.flags.png || c.flags[0],
                    continent: c.continents[0],
                    capital: (c.capital && c.capital[0]) || 'none',
                    subregion: c.subregion,
                    area: c.area,
                    population: c.population
                }
            }));

            // console.log('done');

            resolve();
        });
    })
} 

initCountries()

// ? /countries?name=Argentina
router.get('/', async (req, res) => {
    const { name } = req.query;

    if(name)
    {
        res.send(await Country.findOne({
            where: { 
                name: {
                    [Op.regexp]: name
                } 
            } 
        }));
        return;
    }
    
    res.send(await Country.findAll());
})

// ? /countries/ARG
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const country = await Country.findOne({ where: { id: id } });

    if(!country) return res.sendStatus(404);

    country.dataValues.activities = (await country.getActivities()).map(activity => activity.dataValues);

    res.send(country.dataValues);
})

module.exports = router;
