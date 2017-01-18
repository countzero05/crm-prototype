import request from "./proxyRequest";
import {stringify} from "qs";

const _fields = {
  _id: String,
  name: String,
  email: val => val ? String(val) : undefined,
  comment: String,
  active: Boolean,
  partner: val => val ? String(val) : null,
  dateStart: val => val ? new Date(val) : val,
  dateEnd: val => val ? new Date(val) : val,
  file: val => val ? String(val) : val
};

const filter = (obj, fields = _fields) => {
  return Object.keys(fields).reduce((self, key) => {
    if (obj[key] !== undefined) {
      self[key] = fields[key](obj[key])
    }

    return self;
  }, {});
};

export const getAllStaffs = (query) => request.get("/api/staff?" + stringify(query)).then(({data}) => data.map(staff => filter(staff)) || []);

export const getStaffById = id => request.get(`/api/staff/${id}`).then(({data}) => filter(data) || {});

export const saveStaff = staff => {
  let req;

  if (staff._id) {
    req = request.put(`/api/staff/${staff._id}`, {staff: filter(staff)});
  } else {
    req = request.post(`/api/staff`, {staff: filter(staff)});
  }
  req.then(({data}) => data || {});

  return req;
};

export const deleteStaff = id => request.delete(`/api/staff/${id}`).then(({data}) => filter(data) || {});

export const upload = (id, file) => {
  const data = new FormData();
  data.append("file", file);

  return request.put(`/api/staff/upload/${id}`, data);
};
