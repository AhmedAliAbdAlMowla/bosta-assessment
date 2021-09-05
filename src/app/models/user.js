const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
/**
 * @desc     User schema
 */
const userSchema = new mongoose.Schema(
  {
    firstName: {type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true,},
    confirmed: { type: Boolean, default: false, },
  },
 { timestamps: true}
);

//                          userMethods
/**
 * @desc     Create token
 * @returns  Tokent
 */
userSchema.methods.generateAuthToken = function async() {
  return JWT.sign({
      _id: this._id,
      name: this.firstName + " " + this.lastName,
      email:this.email
    },
    process.env.JWT_PRIVIAT_KEY, { expiresIn: "3h" } // 3 hours
  );
};
/**
 * @desc     Hash password automatic before saving
 */
userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
