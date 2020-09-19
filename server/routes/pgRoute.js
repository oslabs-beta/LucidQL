const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const pgController = require('../SDL-definedSchemas/controllers/pgController');
// const pgProgController = require('../programmatically-definedSchemas/controllers-prog/pg-progController');

router.post('/sdl', pgController.getPGTables, pgController.assembleSDLSchema, pgController.compileData, (req, res) => {
  // console.log(res.locals.SDLSchema);
  res.status(200).json({ schema: res.locals.SDLSchema, d3Data: res.locals.d3Data });
});

const dummyServerController = {};

dummyServerController.writeFiles = (req, res, next) => {
  const { db, schema } = req.body;
  // console.log(schema);
  fs.writeFileSync(path.resolve(__dirname, '../dummy_server/schema.js'), schema);
  fs.writeFileSync(path.resolve(__dirname, '../dummy_server/connectToDB.js'), db);
  next();
};

router.post('/writefile', dummyServerController.writeFiles, (req, res) => {
  res.json('got it!');
});
// No need for now
// router.post('/draw', pgController.getPGTables, pgController.compileData, (req, res) => {
//   // console.log(res.locals.SDLSchema);
//   res.status(200).json(res.locals.compiledData);
// });

module.exports = router;
