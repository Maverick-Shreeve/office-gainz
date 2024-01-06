import { getUserById } from '../../../services/userService';

export default async function handler(req, res) {
  const { id } = req.query;

  // Perform operations based on the HTTP method or other conditions
  // For example, if you're handling a GET request:
  if (req.method === 'GET') {
    try {
      const user = await getUserById(id);
      // If the user doesn't exist, send a 404 response
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // If the user does exist, send a 200 response with the user data
      return res.status(200).json(user);
    } catch (error) {
      // If there's an error, send a 500 response
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  // If the method is not supported (e.g., POST, PUT, DELETE), send a 405 response
  else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
