const express = require('express');
const path = require('path');
const pgRouter = require('./routes/pgRoute');
const dummyServerController = require('./routes/dummyServer');
// const mySQLRouter = require('./routes/mySQLRoute');

const app = express();
const PORT = process.env.PORT || 3030;

/* Express logic/handler */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static(path.resolve(__dirname, '../public')));
app.use(express.static(path.resolve(__dirname, '../build')));

app.use('/db/pg', pgRouter);
// app.use('/db/mySQL', mySQLRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'An error occured in unknown middleware',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errObj = { ...defaultErr, ...err };
  console.log(errObj.log);
  res.status(errObj.status).json(errObj.message);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = app;
