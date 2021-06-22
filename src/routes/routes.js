const router = require("express").Router();

const users = require("./users");
const index = require("./index");
const testDB = require("./testDB");
const testAPI = require("./testAPI");

index(router);
users(router);
testDB(router);
testAPI(router);

module.exports = router;
