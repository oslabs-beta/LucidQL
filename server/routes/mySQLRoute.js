const router = require('express').Router();
const mySQLController = require('../SDL-definedSchemas/controllers/mySQLController');
const pgController = require('../SDL-definedSchemas/controllers/pgController');

router.post('/sdl', mySQLController.getTables, pgController.assembleSDLSchema, pgController.compileData, (req, res) => {
  console.log(res.locals.SDLSchema);
  res.status(200).json({ schema: res.locals.SDLSchema, d3Data: res.locals.d3Data });
});

module.exports = router;
