import express from "express";
import {User} from "./../../tools/lib/mongoose";
let router = express.Router();

const filter = function (obj, fields) {
  let result = {};
  for (let a in obj) {
    if (obj.hasOwnProperty(a) && fields.indexOf(a) !== -1) {
      result[a] = obj[a];
    }
  }
  return result;
};

const fields = [
  "name",
  "email",
  "password",
  "active",
  "role",
];

/* GET users listing. */
router.get("/", (req, res) => {
  User.find((err, users) => {
    if (err) {
      res.status(500).json({error: err.message});
    }

    res.json(users);
  });
});

router.post("/", (req, res) => {
  let data = filter(req.body.user, fields);
  let user = new User(data);

  user.updateToken();
  user.generateSalt();
  user.generateRecoveryHash();

  user.save((err, user) => {
    if (err) {
      return res.status(500).json({...data, error: err.message});
    }
    res.json(user);
  });
});

router.get("/:user_id", (req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      return res.status(500).json({error: err.message});
    }

    res.json(user);
  });
});

router.put("/:user_id", (req, res) => {
  let data = filter(req.body.user, fields);

  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      return res.status(500).json({...data, error: err.message});
    }

    Object.assign(user, data);

    user.save((err, user) => {
      if (err) {
        return res.status(500).json({...user, error: err.message});
      }

      res.json(user);
    });
  });
});

router.delete("/:user_id", (req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      return res.status(500).json({error: err.message});
    }

    user.remove(err => {
      if (err) {
        return res.status(500).json(Object.assign(user, {error: err.message}));
      }

      res.json(user);
    });
  });
});

export default router;
