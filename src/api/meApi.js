import request from "./proxyRequest";

let serializeMe = user => ({
  user: {
    name: user.name,
    email: user.email,
    password: user.password ? user.password : undefined,
  }
});

export const getMe = () => request.get("/api/me").then(({data}) => data);

export const updateMe = user => request.put("/api/me", serializeMe(user)).then(({data}) => data);

export const login = user => request.post("/api/auth/login", user).then(({data}) => data);

export const logout = () => request.get("/api/auth/logout").then(({data}) => data);
