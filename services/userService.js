const bcrypt = require('bcrypt');
const pool = require('../db');
const User = require('../models/User');

export const createUser = async ({ name, email, password }) => {
  // Check if the user already exists
  const existingUser = await User.findByEmail(email); 
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  let passwordHash = null;
  if (password) {
    // Hash the password 
    const salt = await bcrypt.genSalt(10);
    passwordHash = await bcrypt.hash(password, salt);
  }

  // Insert the new user into the db
  const { rows } = await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
    [name, email, passwordHash]
  );
  return rows[0]; // Returns the newly created user record
};
