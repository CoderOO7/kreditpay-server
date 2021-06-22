const mongoose = require('mongoose');
const {getDatabase} = require('../lib/mongo-memory-db');
const collectionName = 'users';


export const insertUser = async(user) => {
  try{
    const db = await getDatabase();
    const insertId = await db.collection(collectionName).insertOne(user);
    return insertId;
  }catch(err){
    console.error(err);
  }
}

export const getUsers = async() => {
  try{
    const db = await getDatabase();
    return await db.collection(collectionName).find({}).toArray();
  }catch(err){
    console.error(err);
  }
}

export const updateUser = async(id,user) => {
  try{
    const db = await getDatabase();
    return await db.collection(collectionName).updateOne(
      {_id: mongoose.Types.ObjectId(id)},
      {
        $set: {
          ...user,
        }
      }
    );
  }catch(err){
    console.error(err);
  }
}

export const deleteUser = async(id) => {
  try{
    const db = await getDatabase();
    return await db.collection(collectionName).deleteOne({
      _id: mongoose.Types.ObjectId(id)
    });
  }catch(err){
    console.error(err);
  }
}
