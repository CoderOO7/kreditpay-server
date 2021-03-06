const router = require("express").Router();

const users = require("./users");
const loans = require("./loans");
const index = require("./index");
const testDB = require("./testDB");
const testAPI = require("./testAPI");
const contactUs = require("./contactUs");

index(router);
users(router);
loans(router);
testDB(router);
testAPI(router);
contactUs(router);

module.exports = router;
