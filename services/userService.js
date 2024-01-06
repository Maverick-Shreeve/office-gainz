const bcrypt = require('bcrypt');
const pool = require('../db');

const createUser = async (name, email, password) => {
  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Insert the new user into the database with the hashed password
  const { rows } = await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
    [name, email, passwordHash]
  );
  return rows[0]; // Returns the newly created user record
};
