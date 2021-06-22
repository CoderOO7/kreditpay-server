const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

export const connect = async () => {
    const uri = await mongod.getUri();

    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }

    await mongoose.connect(uri,mongooseOptions);
}




/**
 * Drop database, close the connection and stop mongod.
 */
export const disconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
}

/**
* Remove all the data for all db collections.
*/
export const clear = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
  }
}


export const getDatabase = async () => {
    let db = mongoose.connection.db;
    if(!db){
      await connect();
      db = mongoose.connection.db;
    }
    return db;
}
