const express = require("express");
const morgan = require("morgan");

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

// Initialize app
const app = express();

// Logger
app.use(morgan("dev"));

// Body parser
app.use(
  express.json({
    limit: "10kb"
  })
);

// Routes

// Error handlers
app.all("*", (req, res, next) => {
  // If requested route doesnt exist return this
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler); // Express global error handler

module.exports = app;
