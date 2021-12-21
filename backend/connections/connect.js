require("dotenv").config();
const neo4j = require("neo4j-driver");

console.log(process.env.URI);
const driver = neo4j.driver(
  process.env.URI,
  neo4j.auth.basic("neo4j", process.env.KEY),
  { disableLosslessIntegers: true }
);
const session = driver.session();

module.exports = session;
