import mongoose from "mongoose";
import bcrypt from "bcrypt";

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


export default mongoose.model("Cloud", CloudSchema);