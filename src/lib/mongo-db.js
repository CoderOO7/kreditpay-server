const mongoose = require("mongoose");

/**
 * Set mongoose default options
 */
const defMongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

export const connect = (uri, mongooseOptions = {}) => {
  return new Promise(function (resolve, reject) {
    const _mongooseOptions = { ...defMongooseOptions, ...mongooseOptions };
    mongoose.connect(uri, _mongooseOptions);

    //db reference
    const db = mongoose.connection;

    db.then((response) => {
      resolve("success");
    }).catch((error) => {
      reject(error);
    });
  });
};

export const disconnect = () => {
  mongoose.disconnect();
};

export const getDatabase = async () => {
  const db = mongoose.connection;
  if (!db) {
    await connect();
    db = mongoose.connection;
  }
  return db;
};
