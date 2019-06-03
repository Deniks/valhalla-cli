const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const CloudSchema = new Schema({
    cloudIp: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    files: [],
});


const Cloud = module.exports = mongoose.model('Cloud', CloudSchema);