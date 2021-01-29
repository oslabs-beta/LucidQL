const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const pgController = require('../SDL-definedSchemas/controllers/pgController');

router.post('/sdl', pgController.getPGTables, pgController.assembleSDLSchema, pgController.compileData, (req, res) => {
  res.status(200).json({ schema: res.locals.SDLSchema, tables: res.locals.tables });
});

const dummyServerController = {};

dummyServerController.writeFiles = (req, res, next) => {
  const { db, schema } = req.body;
  fs.writeFileSync(path.resolve(__dirname, '../dummy_server/schema.js'), schema);
  fs.writeFileSync(path.resolve(__dirname, '../dummy_server/connectToDB.js'), db);
  next();
};

router.post('/writefile', dummyServerController.writeFiles, (req, res) => {
  res.json('got it!');
});


module.exports = router;
