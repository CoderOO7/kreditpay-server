const app =
  process.env.NODE_ENV === "production"
    ? require("./dist/app")
    : require("./src/app");

/**
 * Start backend server app
 */
app.start();
