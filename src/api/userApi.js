import request from "./proxyRequest";

let serializeUser = user => ({
  user: {
    name: user.name,
    email: user.email,
    password: user.password ? user.password : undefined,
    role: user.role,
    active: user.active,
  }
});

export const getAllUsers = () => request.get("/api/users").then(({data}) => data || []);

export const getUserById = id => request.get(`/api/users/${id}`).then(({data}) => data || {});

export const saveUser = user => {
  let req;

  if (user._id) {
    req = request.put(`/api/users/${user._id}`, serializeUser(user));
  } else {
    req = request.post(`/api/users`, serializeUser(user));
  }
  req.then(({data}) => data || {});

  return req;
};

export const deleteUser = id => request.delete(`/api/users/${id}`).then(({data}) => data || {});
