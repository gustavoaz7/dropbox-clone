require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");

const routes = require("./routes");

const app = express();
app.use(cors());
const server = http.Server(app);
const io = socket(server);

io.on("connection", socket => {
  socket.on("connectRoom", box => {
    socket.join(box);
  });
});

mongoose.connect(
  `mongodb+srv://gustavoaz7:${
    process.env.DB_PW
  }@cluster0-ua5zn.mongodb.net/test?retryWrites=true`,
  {
    useNewUrlParser: true
  }
);

app.use((req, res, next) => {
  req.io = io;
  return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/files", express.static(path.resolve(__dirname, "..", "tmp")));

app.use(routes);

server.listen(process.env.PORT || 3030);
