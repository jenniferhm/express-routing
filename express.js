const express = require("express");

const app = express();

const ExpressError = require("./expressError");

app.use(express.json());

app.use(express.urlencoded({ extended: true}));





app.use(function(req, res, next) {
  const notFoundError = new ExpressError("Not Found", 404);
  return next(notFoundError);
});

app.use(function(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message;

  return res.status(status).json({
    error: {message, status}
  });
});

app.listen(3000, function() {
  console.log("App on port 3000.");
});