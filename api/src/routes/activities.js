const { Router } = require("express");
const { Op } = require("sequelize");
const { Activity, Country } = require("../db");
const router = Router();

// Activity.destroy({
//   where: {},
//   truncate: true
// })
// Activity.sync({ force: true });

// router.get('/', async (req, res) => {
//   const data = {
//     name: 'carnival',
// 		difficulty: 3,
// 		duration: 23,
// 		season: "winter",
//   };
//   const activity = await Activity.create(data);

//   const country = await Country.findOne({ where: { id: 'ARG' } });

//   if(!country) return;

//   // if(!has) country.addActivity(activity);
  
//   console.log((await country.getActivities({where: { name: activity.dataValues.name }})).length);

//   await activity.addCountry(country);

//   console.log((await country.getActivities({where: { name: activity.dataValues.name }})).length);
  
//   res.sendStatus(200);
// });

router.post('/', async (req, res) => {
  const form = req.body;

  if(await Activity.findOne({ where: { name: form.name } })) 
  {
    res.sendStatus(404);
    return;
  }

  const activity = await Activity.create({
    ...form,
    difficulty: parseInt(form.difficulty),
    duration: parseInt(form.duration),
  });

  res.sendStatus(200);

  const countries = await Country.findAll({where: {id: {[Op.in]: form.selected}}});
  
  await activity.addCountries(countries);
});

module.exports = router;
