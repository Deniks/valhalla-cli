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
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;

  });

  const search = new RegExp(user.username, 'i');
  User.find({$or: [{username: search}]})
    .exec((err, users) => {
      assert.equal(null, err);
      if (users.length) {
        console.log(`${user.username} is already taken ):`)
        
        db.close()
      }
      else {
        User.create(user, (err) => {
          console.log(user)
          assert.equal(null, err);
          console.info('Welcome to HeavenNOTES')
          db.close()
        });
      }
  })




  
};

const loginUser = (user) => {
 
  User.findOne({ username: user.username })
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
          console.info('password is not correct 0_0')
          return null;
        }
      })
    });
}
const getUser = (username) => {
  const search = new RegExp(username, 'i');
  User.find({$or: [{username: search}]})
    .exec((err, user) => {
      assert.equal(null, err);
      if (user.length) {
        console.log('username is already taken')
        console.info(`${user.length} matches`);
      }
      else {
        console.info('ypou can register')
      }
      db.close()
    })
}

module.exports = { addUser, getUser, loginUser };