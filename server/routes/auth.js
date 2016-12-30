import express from "express";
import {User} from "./../../tools/lib/mongoose";

let router = express.Router();

/* GET logged in user. */
router.post("/login", function (req, res) {
  let email = req.body.email;
  let password = req.body.password;

  User.findOne({email: email, active: true}, (err, user) => {
    if (err) {
      return res.json({error: err.message});
    }
    if (user) {
      user.login(password, function (isMatch) {
        if (isMatch) {
          let sess = req.session;

          sess.user_id = user._id;
          res.json(user.toJSON());
        } else {
          res.json({error: "Email or password did not match"});
        }
      })
    } else {
      res.json({error: "Email or password did not match"});
    }
  }).catch(err => {
    console.log(err);
    res.json({error: err.message});
  });

});

router.get("/logout", function (req, res) {
  delete req.session.user_id;
  res.json({});
});

export default router;
