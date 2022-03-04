const express = require('express');
const bodyParser = require('body-parser');
// const log = require("loglevel");
const HttpError = require("./utils/HttpError");
const router = require("./routes");
const {errorHandler} = require("./utils/utils");
const helper = require("./utils/utils");

const app = express();

/*
 * Check request
 */
app.use(helper.handlerWrapper(async (req, _res, next) => {
  if(req.method === "POST" || req.method === "PATCH"  || req.method === "PUT" ){
    if(req.headers['content-type'] !== "application/json"){
    throw new HttpError(415, "Invalid content type. API only supports application/json");
    }
  }
  next();
}));

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

app.use('/', router);

// Global error handler
app.use(errorHandler);

const {version} = require('../package.json')

app.get('*',function (req, res) {
  res.status(200).send(version)
});


module.exports = app; 
