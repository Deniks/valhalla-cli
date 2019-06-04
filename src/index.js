require('dotenv').config();
const mongoose = require('mongoose');

const assert = require('assert');
const bcrypt = require('bcrypt');
const fs = require('fs');
const CLI = require('clui');
const Progress = CLI.Progress;
const Spinner = CLI.Spinner;



mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI,  { 
  useNewUrlParser: true 
  }
);
let db = mongoose.connection;
db.on('error', (err) => {
  console.log(`An error occured ==> ${err}`);
})
const Cloud = require('./src/models/cloudSchema');

const createCookie = (content) => {
  fs.writeFile('user.json', JSON.stringify(content), (err) => {
    if (err) throw err;
    console.log('User data saved ...');
  })
}
const deleteCookie = (filename) => {
  fs.unlink(filename, (err) => {
    if (err) throw err;
    console.log('Deleted Cookie');
  })
}

module.exports = { createCloud, connectToCloud, getUser, File };
