import express from "express";
import {Staff} from "./../../tools/lib/mongoose";
// import mongoose from "mongoose";
// let Schema = mongoose.Schema;

let router = express.Router();

const _fields = {
  name: String,
  email: String,
  comment: String,
  active: Boolean,
  partner: val => val ? String(val) : null,
  dateStart: val => new Date(val),
  dateEnd: val => new Date(val),
};

const filter = (obj, fields = _fields) => {
  return Object.keys(fields).reduce((self, key) => {
    if (obj[key] !== undefined) {
      self[key] = fields[key](obj[key])
    }

    return self;
  }, {})
};

/* GET staffs listing. */
router.get("/", (req, res) => {
  const partner = req.query.partner || "";
  let query = {};

  switch (partner) {
    case "-1":
      query.partner = null;
      break;
    case "":
      break;
    default:
      query.partner = partner;
  }

  Staff.find(query, (err, staffs) => {
    if (err) {
      res.status(500).json({error: err.message});
    }

    res.json(staffs);
  });
});

router.post("/", (req, res) => {
  let data = filter(req.body.staff);
  let staff = new Staff(data);

  staff.save((err, staff) => {
    if (err) {
      return res.status(500).json({...data, error: err.message});
    }

    res.json(staff);
  });
});

router.get("/:staff_id", (req, res) => {
  Staff.findById(req.params.staff_id, (err, staff) => {
    if (err) {
      return res.status(500).json({error: err.message});
    }

    res.json(staff);
  });
});

router.put("/:staff_id", (req, res) => {
  let data = filter(req.body.staff);

  Staff.findById(req.params.staff_id, (err, staff) => {
    if (err) {
      return res.status(500).json({...data, error: err.message});
    }

    Object.assign(staff, data);

    staff.save((err, staff) => {
      if (err) {
        return res.status(500).json({...staff, error: err.message});
      }

      res.json(staff);
    });
  });
});

router.delete("/:staff_id", (req, res) => {
  Staff.findById(req.params.staff_id, (err, staff) => {
    if (err) {
      return res.status(500).json({error: err.message});
    }

    staff.remove(err => {
      if (err) {
        return res.status(500).json(Object.assign(staff, {error: err.message}));
      }

      res.json(staff);
    });
  });
});

export default router;
