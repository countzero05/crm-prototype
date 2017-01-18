import mongoose from "mongoose";
let Schema = mongoose.Schema;
import uniqueValidator from "mongoose-unique-validator";
import fs from "fs";
import path from "path";

const validateEmail = email => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

let staffSchema = new Schema({
  name: {
    type: String,
    required: "Name is required"
  },
  email: {
    type: String,
    trim: true,
    sparse: true,
    unique: true,
    required: [false, "Email address is required"],
    validate: [validateEmail, "Please fill a valid email address"],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
  },
  active: {
    type: Boolean,
    required: true
  },
  partner: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: "User",
    required: false
  },
  dateStart: {
    type: Date,
    default: null,
    required: false
  },
  dateEnd: {
    type: Date,
    default: null,
    required: false
  },
  comment: {
    type: String,
    required: false
  },
  file: {
    type: String,
    required: false
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

staffSchema.index({email: 1}, {unique: true, sparse: true});

staffSchema.plugin(uniqueValidator, {message: "{PATH} is already in use, but it must be unique"});

staffSchema.pre("save", function (next) {
  this.updated = new Date();

  next();
});

staffSchema.post("remove", function () {
  fs.unlink(path.join(__dirname, `../../../upload/${this.file}`));
});

staffSchema.options.toJSON = {
  transform: function (doc, ret/*, options*/) {
    delete ret.__v;

    return ret;
  }
};

export default mongoose.model("Staff", staffSchema);
