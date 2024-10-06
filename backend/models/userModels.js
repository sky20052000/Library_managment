require("dotenv").config();
const mongoose = require("mongoose");
const Jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userShcema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: [1, 2], required: true }, //  for 1 => "LIBRARIAN" and for 2=> "MEMBER"
    status: { type: String, enum: ["ACTIVE", "DELETED"], default: "ACTIVE" },
    borrowedBooks: [
      {
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
        borrowDate: { type: Date },
        returnDate: { type: Date },
      },
    ],
    refreshToken:{type:String},
    createdAt: { type: Date },
    updatedAt: { type: Date, default: null },
  },
);

//hash password
userShcema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

///generate access token
userShcema.methods.GenerateAccessToken = async function () {
  return Jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
    },
    process.env.Access_Token,
    { expiresIn: "24h" }
  );
};

///refresh access token
userShcema.methods.GenerateRefreshToken = async function () {
  return Jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    process.env.Refresh_Token,
    { expiresIn: "30d" }
  );
};

//compare password
userShcema.methods.comparePassword = async function (enterPassword) {
  const result =  await bcrypt.compare(enterPassword, this.password);
 return result
};

module.exports = new mongoose.model("User", userShcema);
