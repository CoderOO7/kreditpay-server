const createError = require("http-errors");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoDB = require("./lib/mongo-db");

/**
 * Load environment variables from .env file
 */
dotenv.config({ path: path.resolve(__dirname, "../.env") });

/**
 * Extract environment variables
 */
const isDevelopment = process.env.NODE_ENV === "development";
const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOST || "0.0.0.0";
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Routers
 */
const routes = require("./routes/routes");

/**
 * Create Express Server
 */
const app = express();

/**
 * Express configuration
 */
app.set("host", HOSTNAME);
app.set("port", PORT);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
if (isDevelopment) {
  app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export const start = async () => {
  console.log("starting server");
  /**
   * Connect to DB
   */
  try {
    await mongoDB.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log(
      "MongoDB connection error. Please make sure MongoDB is running."
    );
  }

  /**
   * Start express server listener
   */
  app.listen(app.get("port"), () => {
    console.log(
      `Server running at http://${app.get("host")}:${app.get("port")}`
    );
  });
};

export const stop = () => {
  /**
   * Close DB Connections
   */
  mongoDB.disconnect();

  /**
   * Stop express server
   */
  app.close(app.get("port"), () => {
    console.log(`Server shutdown on port ${app.get("port")}`);
  });
};
