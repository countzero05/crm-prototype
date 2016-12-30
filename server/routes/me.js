import express  from "express";
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
  "password"
];

/* GET logged in user. */
router.get("/", function (req, res) {
  if (req.user) {
    res.json(req.user);
  } else {
    res.json({});
  }
});

router.put("/", function (req, res) {
  if (!req.user) {
    return res.status(401).json({});
  }

  let {user} = req.body;

  Object.assign(req.user, filter(user, fields));

  req.user.save((err, user) => {
    if (err) {
      return res.status(500).json({...req.user, error: err.message});
    }

    res.json(user);
  });
});

export default router;
