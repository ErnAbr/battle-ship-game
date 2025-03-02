import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const responseBody = (response) => response.data;

const requests = {
  get: (url) => axios.get(url).then(responseBody),
  post: (url, body) => axios.post(url, body).then(responseBody),
};

const Users = {
  registerUser: (body) => requests.post("users", body),
f
  logoutUser: () => requests.post("users/logout", {}),
};

const GameStats = {
  getStats: () => requests.get("games"),
};

export const api = {
  Users,
  GameStats,
};
