import supabase from '../utils/supabaseClient';

class User {
    // constructor to create a new User object
    constructor(user) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.password = user.password; 
    }

    static async findByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single(); // gets a single record

        if (error) {
            console.error('Error fetching user by email:', error);
            return null;
        }

        if (data) {
            return new User(data);
        } else {
            return null;
        }
    }

    static async findById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single(); 

        if (error) {
            console.error('Error fetching user by ID:', error);
            return null;
        }

        if (data) {
            return new User(data);
        } else {
            return null;
        }
    }
}

export default User;
