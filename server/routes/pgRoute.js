const router = require('express').Router();
const pgController = require('../SDL-definedSchemas/controllers/pgController');
// const pgProgController = require('../programmatically-definedSchemas/controllers-prog/pg-progController');

router.post('/sdl', pgController.getPGTables, pgController.assembleSDLSchema, pgController.compileData, (req, res) => {
  // console.log(res.locals.SDLSchema);
  res.status(200).json({ schema: res.locals.SDLSchema, d3Data: res.locals.d3Data });
});

// No need for now
// router.post('/draw', pgController.getPGTables, pgController.compileData, (req, res) => {
//   // console.log(res.locals.SDLSchema);
//   res.status(200).json(res.locals.compiledData);
// });

// router.get('/prog',
//   pgController.getPGTables,
//   pgProgController.generateCustomTypes,
//   pgProgController.assembleCustomTypes,
//   pgProgController.generateQuery,
//   pgProgController.formatQueries,
//   pgProgController.generateMutations,
//   pgProgController.assembleMutations,
//   pgProgController.formatMutations,
//   pgProgController.assembleProgSchema,
//   (req, res) => {
//     // console.log(res.locals.progSchema);
//     res.status(200).json(res.locals.progSchema);
//   });

module.exports = router;
