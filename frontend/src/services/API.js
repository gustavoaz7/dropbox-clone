import axios from "axios";

const API = axios.create({
  baseURL: "https://dropbox-clone-backend.herokuapp.com"
});

export default API;
