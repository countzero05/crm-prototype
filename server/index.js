import express from "express";
import webpack from "webpack";
import config from "../webpack.config.dev";
import open from "open";
import compression from "compression";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import users from "./routes/users";
import staff from "./routes/staff";
import me from "./routes/me";
import auth from "./routes/auth";
import mongoose, {User} from "./../tools/lib/mongoose";
import session from "express-session";
import formData from "express-form-data";
const MongoStore = require("connect-mongo")(session);

const production = process.env.NODE_ENV === "production";

/* eslint-disable no-console */

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;
const filePath = path.join(__dirname, production ? "../dist/index.html" : "../src/index.html");

const app = express();

if (production) {
  app.use(compression());
  app.use(express.static("dist"));
} else {
  const compiler = webpack(config);
  app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  app.use(require("webpack-hot-middleware")(compiler));
}

app.use(formData.parse());
app.use(bodyParser({limit: "50mb"}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: "shdsnlkvhgsluhvhhlgnksfdghnslc8ryet8w50675",
  resave: true,
  saveUninitialized: false,
  // cookie: {
  //   httpOnly: true,
  //   maxAge: 3600000,
  //   // expires: new Date(Date.now() + 600000)
  // },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    autoRemove: "native"
  })
}));

app.use(function (/*err, */req, res, next) {
  req.models = mongoose;
  next();
});

(function checkFirstUser() {
  User.find({}, (err, users) => {
    if (err) {
      throw new Error(err.message);
    }

    if (!users.length) {
      let user = new User({
        email: "admin@email.com",
        password: "q1w2e3zaxscd",
        role: "Admin",
        name: "Admin",
        active: true
      });

      user.updateToken();
      user.generateSalt();
      user.generateRecoveryHash();

      user.save((err/*, user*/) => {
        if (err) {
          throw new Error(err.message);
        }
      });
    }
  });
})();

function requireRole(role, methods = []) {
  return function (req, res, next) {
    if (req.user && req.user.active && (["admin", role.toLowerCase()].indexOf(req.user.role.toLowerCase()) !== -1) && (req.user.role.toLowerCase() == "admin" || !methods.length || methods.indexOf(req.method.toLowerCase()) != -1)) {
      next();
    } else {
      if (req.user) {
        res.status(403).json({error: "Permission denied"});
      } else {
        res.status(401).json({error: "User not authorized"});
      }
    }
  }
}

function loadUser(req, res, next) {
  if (req.session.user_id) {
    User.findOne({_id: req.session.user_id, active: true}, (err, user) => {
      if (err) {
        throw new Error(err.message);
      }
      if (!user) {
        next();
      } else {
        req.user = user;
        next();
      }
    }).catch(err => {
      console.log(err);
      next();
    });
  } else {
    next();
  }
}

app.use(loadUser);

app.use("/api/users", requireRole("admin"), users);
app.use("/api/staff", requireRole("manager"), staff);
app.use("/api/me", me);
app.use("/api/auth", auth);

app.get("*", function (req, res) {
  res.sendFile(filePath);
});

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   const err = new Error(`Not Found ${req.url}`);
//   err.status = 404;
//   next(err);
// });

// error handlers

// development error handler
// will print stacktrace
// if (app.get("env") === "development") {
//   app.use(function (err, req, res/*, next*/) {
//     res.status(err.status || 500);
//     res.json({
//       "error": {
//         message: err.message,
//         error: err
//       }
//     });
//   });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function (err, req, res/*, next*/) {
//   res.status(err.status || 500);
//   res.json({
//     "error": {
//       message: err.message,
//       error: {}
//     }
//   });
// });


app.listen(port, host, function (err) {
  if (err) {
    console.log(err);
  } else if (!production) {
    open(`http://${host}:${port}`);
  }
});
