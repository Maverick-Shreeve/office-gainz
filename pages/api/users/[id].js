import { getUserById } from '../../../services/userService';

export default async function handler(req, res) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    try {
      const user = await getUserById(id);
      // If  user does not exist, send a 404 
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // If  user exists, send 200 
      return res.status(200).json(user);
    } catch (error) {
      // If there's a error, send 500 
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  // bad method , send 405
  else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
