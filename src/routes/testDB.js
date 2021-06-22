const mongoose = require("mongoose");

// Variable to be sent to Frontend with Database status
let databaseConnectionMsg = {
  connecting: 'Waiting for Database response...',
  connected: 'Database server connected successfully...',
  disconnected: 'Database server is down...',
  disconnecting: 'Database server is shutting down...',
};

module.exports = (router) => {
  router.get("/v1/testDB", function (req, res, next) {
    const dbState = mongoose.connection.readyState;

    if( dbState === mongoose.STATES.connected){
      res.send(databaseConnectionMsg.connected);
    }else if( dbState === mongoose.STATES.connecting){
      res.send(databaseConnectionMsg.connecting);
    }else if( dbState === mongoose.STATES.disconnecting){
      res.send( dbState === databaseConnectionMsg.disconnecting);
    }else if( dbState === monogoose.STATES.uninitialized ||
              dbState === mongoose.STATES.disconnected){
      res.send(databaseConnectionMsg.disconnected);
    }
  });
}
