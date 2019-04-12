const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const routes = require("./routes");

const app = express();

mongoose.connect(
  `mongodb+srv://gustavoaz7:${
    process.env.DB_PW
  }@cluster0-ua5zn.mongodb.net/test?retryWrites=true`,
  {
    useNewUrlParser: true
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.listen(3030);
