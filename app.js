const express = require('express');
const app = express();
const formsRouter = require('./controllers/forms');
const middleware = require('./utils/middleware')

app.use('/v1/api/forms', formsRouter);
app.use(middleware.unknownEndpoint)

module.exports = app;