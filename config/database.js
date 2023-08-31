const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

dotenv.config();

const env = {
  "dev": {
    host: "127.0.0.1",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "nodebird"
  },
  "test": {
    host: "127.0.0.1",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "nodebird"
  },
  "production": {
    host: "127.0.0.1",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "nodebird"
  },
};

const db = mysql.createPool(env[process.env.NODE_ENV]);


module.exports = db;