import axios from "axios";

export const baseURL = "https://dropbox-clone-backend.herokuapp.com";

const API = axios.create({
  baseURL
});

export default API;
