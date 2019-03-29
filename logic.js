require('dotenv').config();
const mongoose = require('mongoose');
const assert = require('assert');
const bcrypt = require('bcrypt');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI,  { 
  useNewUrlParser: true 
  }
);
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});
db.on('error', (err) => {
  console.log(`An error occured ==> ${err}`);
})
const User = require('./models/userSchema');

const addUser = (user) => {
  const saltRounds = 10;

  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
        console.log(hash);
        user.password = hash;
    });
  });
  User.create(user, (err) => {
    console.log(user)
    assert.equal(null, err);
    console.info('Registred !')
    db.close()
  });

  
};

const loginUser = (user) => {
 
 /* User.findOne({ username: user.username })
    .exec((err, userData) => {
      if (err) {
        return asssert(err);
      } else if (!user) {
        const err = new Error('User not found!');
        err.status = 401;
        return asssert(err);
      }
      bcrypt.compare(user.password, userData.password, (err, result) => {
        if (result === true) {
          console.log('loginned!!!')
          return user;
        } else {
          return null;
        }
      })
    })*/
}
const getUser = (username) => {
  const search = new RegExp(username, 'i');
  User.find({$or: [{username: search}]})
    .exec((err, user) => {
      assert.equal(null, err);
      console.info(`${user.length} matches`);
      db.close()
    })
}

module.exports = { addUser, getUser, loginUser };