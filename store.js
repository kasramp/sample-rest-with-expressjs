import config from "./config";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function getAllUsers() {
  const result = await pool.query(
    "SELECT id, first_name AS firstName, last_name AS lastName, age FROM users"
  );
  return result[0].length < 1 ? {} : result[0];
}

async function createUser(firstName, lastName, age) {
  const result = await pool.query(
    "INSERT INTO users SET first_name = ?, last_name = ?, age = ?",
    [firstName, lastName, age]
  );
  if (result[0].length < 1) {
    throw new Error(
      `Failed to create a new user ${firstName}, ${lastName}, ${age}`
    );
  }
  return getUserById(result[0].insertId);
}

async function getUserById(id) {
  const result = await pool.query(
    "SELECT id, first_name AS firstName, last_name AS lastName, age FROM users WHERE id = ?",
    [id]
  );
  if (result[0].length < 1) {
    throw new Error(`User with id = ${id} not found`);
  }
  return result[0][0];
}

async function deleteUserById(id) {
  const result = await pool.query("DELETE FROM users WHERE id = ?", [id]);
  if (result[0].affectedRows < 1) {
    throw new Error(`User with id ${id} does not exist`);
  }
  return "";
}

async function updateUser(id, user) {
  const result = await pool.query(
    "UPDATE users SET first_name = ?, last_name = ?, age = ? WHERE id = ?",
    [user.firstName, user.lastName, user.age, id]
  );
  if (result[0].affectedRows < 1) {
    throw new Error(`User with id ${id} does not exist`);
  }
  return getUserById(id);
}

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  deleteUserById,
  updateUser
};
