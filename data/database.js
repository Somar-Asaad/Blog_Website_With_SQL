const dataBase = require("mysql2/promise");

const pool = dataBase.createPool({
  host: "localhost",
  user: "root",
  database: "blogs",
  password:'NewWlak.,alkhra.,123',
});

module.exports = pool;