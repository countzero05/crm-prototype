import mongoose from "mongoose";
import crypto from "crypto";
import uniqueValidator from "mongoose-unique-validator";
let Schema = mongoose.Schema;

const validateEmail = email => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

let userSchema = new Schema({
  name: {
    type: String,
    required: "Name is required"
  },
  role: {
    type: String,
    enum: ["Admin", "Manager"],
    required: "Role is required"
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
  },
  password: {
    type: String,
    minlength: [6, "Password should contains more that 5 chcracters"],
    required: "Password is required"
  },
  salt: {
    type: String,
    required: true,
    default: ""
  },
  active: {
    type: Boolean,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  token_created: {
    type: Date,
    required: true,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated: {
    type: Date,
    default: Date.now,
    required: true
  }
});

userSchema.plugin(uniqueValidator, {message: "{PATH} is already in use, but it must be unique"});

userSchema.methods.updateToken = function () {
  let hash, tokenCrypto;
  tokenCrypto = crypto.createHash("sha512");
  tokenCrypto.update(crypto.randomBytes(512));
  hash = tokenCrypto.digest("base64");
  this.token = hash.replace(/[\+\=\/]+/ig, "");
  return this.token_created = new Date();
};

userSchema.methods.generateRecoveryHash = function () {
  let hash, passCrypto;
  passCrypto = crypto.createHash("sha512");
  passCrypto.update(crypto.randomBytes(512));
  hash = passCrypto.digest("base64");
  this.recovery_tm = new Date();
  this.recovery_tm = new Date(this.recovery_tm.getTime() + 86400 * 1000);
  this.recovery_hash = hash.replace(/[\+\=\/]+/ig, "");
  return this;
};

userSchema.methods.generateSalt = function () {
  let saltCrypto;
  saltCrypto = crypto.createHash("sha512");
  saltCrypto.update(crypto.randomBytes(256));
  return this.salt = saltCrypto.digest("base64");
};

userSchema.methods.generatePassword = function () {
  let passCrypto, password;
  passCrypto = crypto.createHash("sha512");
  passCrypto.update(crypto.randomBytes(256));
  password = passCrypto.digest("base64");
  return password.replace(/[\+\=\/]+/ig, "").substr(0, 10);
};

userSchema.methods.comparePasssword = function (password, cb) {
  return crypto.pbkdf2(password, this.salt, 1000, 512, "sha512", (err, new_password) => {
    if (err) {
      throw new Error(err.message);
    }

    let passCrypto = crypto.createHash("sha512");
    passCrypto.update(new_password);
    new_password = passCrypto.digest("base64");
    return typeof cb === "function" ? cb(new_password === this.password) : void 0;
  });
};

userSchema.methods.login = function (password, cb) {
  return this.comparePasssword(password, isMatch => {
    if (isMatch) {
      this.updateToken();
      return this.save(() => {
        return typeof cb === "function" ? cb(true) : void 0;
      });
    } else {
      return typeof cb === "function" ? cb(false) : void 0;
    }
  });
};


userSchema.pre("save", function (next) {
  this.updated = new Date();

  if (this.isModified("password")) {
    this.generateSalt();
    return crypto.pbkdf2(this.password, this.salt, 1000, 512, "sha512", (err, new_password) => {
      if (err) {
        throw new Error(err.message);
      }
      let passCrypto = crypto.createHash("sha512");
      passCrypto.update(new_password);
      this.password = passCrypto.digest("base64");
      this.generateRecoveryHash();
      return next();
    });
  } else {
    return next();
  }
});

userSchema.options.toJSON = {
  transform: function (doc, ret/*, options*/) {
    delete ret.__v;
    delete ret.password;
    delete ret.salt;
    delete ret.token;
    delete ret.token_created;
    delete ret.arr;

    return ret;
  }
};

export default mongoose.model("User", userSchema);
