import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
// import { type } from 'os';

const userSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ["admin", "mentor", "user"],
      default: "member",
    },
    // organisationId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Organisation",
    //   require: [true, "organisation ID is require"],
    // },
    userName: {
      type: String,
      required: [true, "Name Required!"],
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, "Name Required!"],
    },
    lastName: {
      type: String,
      required: [true, "Name Required!"],
    },
    email: {
      type: String,
      required: [true, "Email Required!"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Phone Required!"],
    },
    password: {
      type: String,
      required: [true, "Password Required!"],
      minLength: [8, "Password Must Contain At Least 8 Characters!"],
      select: false,
    },
    termsAndCondtion: {
      type: Boolean,
    },
    // image: {
    //   public_id: {
    //     type: String,
    //     required: true,
    //   },
    //   url: {
    //     type: String,
    //     required: true,
    //   },
    // },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// userSchema.methods.generateJsonWebToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY);
// };

//Generating Reset Password Token
userSchema.methods.getResetPasswordToken = function () {
  //Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hashing and Adding Reset Password Token To UserSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Setting Reset Password Token Expiry Time
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model("User", userSchema);

// or
// id,name,decription
