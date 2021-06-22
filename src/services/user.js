const userModel = require('../models/User');

module.exports.create = async(user)=>{
  if(!user)
    throw new Error('User is not valid');

  await userModel.create(user);
}
