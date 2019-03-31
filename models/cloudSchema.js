const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const CloudSchema = new Schema({
    cloudIp: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    insideCloud: {
      type: Boolean,
      default: false,
    }
});


const Cloud = module.exports = mongoose.model('Cloud', CloudSchema);