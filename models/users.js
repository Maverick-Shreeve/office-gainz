import pool from '../db'; 

class User {
    // Constructor to create a new User object
    constructor(user) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
    }

    // Method to find a user by email
    static async findByEmail(email) {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length === 0) {
            return null;
        }
        return new User(rows[0]);
    }

    // Method to find a user by ID
    static async findById(id) {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (rows.length === 0) {
            return null;
        }
        return new User(rows[0]);
    }
}

export default User;



