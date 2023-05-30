const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose)
const bcrypt = require("bcryptjs");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name cannot be empty"],
    // operationType: 'insert',
    // fullDocument: { _id: "5af5b13fe526027666c6bf83...", name: 'Axl.Rose', __v: 0 },
    // ns: { db: 'test', coll: 'Person' },
    // documentKey: { _id: "5af5b13fe526027666c6bf83..." }
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
    // operationType: 'insert',
    // fullDocument: { _id: "5af5b13fe526027666c6bf83...", name: 'Axl Rose', __v: 0 },
    // ns: { db: 'test', coll: 'Switch' },
    // documentKey: { _id: "5af5b13fe526027666c6bf83..." }
  },
  email: {
    type: String,
    required: [true, "email cannot be empty"],
    unique: [true, "email already registered"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ],
  },
  password: {
    type: String,
    required: [true, "password cannot be empty"],
    minlength: 6,
  },
  seedPhrase: {
    type: String,
    default: "point-believe-twenty-open-rail-pool"
  },
  authCode: {
    type: String
  }

},
  { timestamps: true });
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.generateJWT = function (signature) {
  return jwt.sign({ id: this._id, name: this.name }, signature);
};
UserSchema.methods.comparePassword = async function (passwordInput) {
  return await bcrypt.compare(passwordInput, this.password);
};
UserSchema.plugin(AutoIncrement, { inc_field: 'id' })
module.exports = mongoose.model("user", UserSchema);
