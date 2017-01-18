import express from "express";
import {Staff} from "./../../tools/lib/mongoose";
import {mapErrors} from "./helper";
import fse from "fs-extra";
import path from "path";
import mime from "mime";
import fs from "fs";
// import mongoose from "mongoose";
// let Schema = mongoose.Schema;

let router = express.Router();

const _fields = {
  name: String,
  email: val => val ? String(val) : undefined,
  comment: String,
  active: Boolean,
  partner: val => val === null ? null : (val ? String(val) : undefined),
  dateStart: val => val ? new Date(val) : val,
  dateEnd: val => val ? new Date(val) : val,
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
  let query = {};

  if (req.user.role.toLowerCase() === "admin") {
    const partner = req.query.partner || "";

    switch (partner) {
      case "-1":
        query.partner = null;
        break;
      case "":
        break;
      default:
        query.partner = partner;
    }
  } else {
    query.partner = req.user._id;
  }

  Staff.find(query, (err, staffs) => {
    if (err) {
      res.status(400).json(mapErrors({}, err));
    }

    res.json(staffs);
  });
});

router.post("/", (req, res) => {
  let data = filter(req.body.staff);
  let staff = new Staff(data);

  if (req.user.role.toLowerCase() === "manager") {
    staff.partner = req.user._id;
  }

  staff.save((err, staff) => {
    if (err) {
      return res.status(400).json(mapErrors(data, err));
    }

    res.json(staff);
  });
});

router.get("/:staff_id", (req, res) => {
  Staff.findById(req.params.staff_id, (err, staff) => {
    if (err) {
      return res.status(400).json(mapErrors({}, err));
    }

    if (!staff) {
      return res.status(404).json({});
    }

    if (req.user.role.toLowerCase() === "admin" || String(staff.partner) === String(req.user._id)) {
      res.json(staff);
    } else {
      res.status(404).json(null);
    }
  });
});

router.put("/:staff_id", (req, res) => {
  let data = filter(req.body.staff);

  Staff.findById(req.params.staff_id, (err, staff) => {
    if (err) {
      return res.status(400).json(mapErrors(data, err));
    }

    if (!staff) {
      return res.status(404).json({});
    }

    if (req.user.role.toLowerCase() === "manager" && String(req.user._id) !== String(staff.partner)) {
      return res.status(404).json(null);
    }

    Object.assign(staff, data);

    if (req.user.role.toLowerCase() === "manager") {
      staff.partner = req.user._id;
    }

    staff.save((err, staff) => {
      if (err) {
        return res.status(400).json(mapErrors(staff, err));
      }

      res.json(staff);
    });
  });
});

router.put("/upload/:staff_id", (req, res) => {
  Staff.findById(req.params.staff_id, (err, staff) => {
    if (err) {
      return res.status(400).json(mapErrors({}, err));
    }

    if (!staff) {
      return res.status(404).json({});
    }

    if (req.user.role.toLowerCase() === "manager" && String(req.user._id) !== String(staff.partner)) {
      return res.status(404).json(null);
    }

    const fname = `${staff._id}_${req.files.file.name}`;

    fse.move(req.files.file.path, path.join(__dirname, `./../../upload/${fname}`), err => {
      if (err) {
        return res.status(400).json(mapErrors({}, err));
      }

      staff.file = fname;

      staff.save((err, staff) => {
        if (err) {
          return res.status(400).json(mapErrors(staff, err));
        }

        res.json(staff);
      });
    });

  });
});

router.get("/download/:staff_id", function(req, res){

  Staff.findById(req.params.staff_id, (err, staff) => {
    if (err) {
      return res.status(400).json(mapErrors({}, err));
    }

    if (!staff) {
      return res.status(404).json({});
    }

    if (req.user.role.toLowerCase() === "manager" && String(req.user._id) !== String(staff.partner)) {
      return res.status(404).json(null);
    }
    const file = path.join(__dirname, `./../../upload/${staff.file}`);

    const filename = path.basename(file);
    const mimetype = mime.lookup(file);

    res.setHeader("Content-disposition", "attachment; filename=" + filename.replace(/^[a-z\d]+_/, ""));
    res.setHeader("Content-type", mimetype);

    const stream = fs.createReadStream(file);
    stream.pipe(res);
  })
});

router.delete("/:staff_id", (req, res) => {
  Staff.findById(req.params.staff_id, (err, staff) => {
    if (err) {
      return res.status(400).json(mapErrors({}, err));
    }

    if (!staff) {
      return res.status(404).json({});
    }

    if (req.user.role.toLowerCase() === "manager" && String(req.user._id) !== String(staff.partner)) {
      return res.status(404).json(null);
    }

    staff.remove(err => {
      if (err) {
        return res.status(400).json(mapErrors(staff, err));
      }

      res.json(staff);
    });
  });
});

export default router;
