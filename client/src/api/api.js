import axios from "axios";

axios.defaults.baseURL = "http://localhost:3005/api/";
axios.defaults.withCredentials = true;

const responseBody = (response) => response.data;

const requests = {
  get: (url) => axios.get(url).then(responseBody),
  post: (url, body) => axios.post(url, body).then(responseBody),
};

const Users = {
  registerUser: (body) => requests.post("users", body),
  loginUser: (body) => requests.post("users/login", body),
  logoutUser: () => requests.post("users/logout", {}),
};

export const api = {
  Users,
};
