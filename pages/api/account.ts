// pages/api/account.ts
import { NextApiRequest, NextApiResponse } from 'next';

const accountHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from headers

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      // Logic to get user data from your database
      const userData = await getUserData(token);
      return res.status(200).json(userData);

    case 'PUT':
      // Logic to update user data in your database
      const updatedUser = await updateUserData(token, req.body);
      return res.status(200).json(updatedUser);

    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
};

const getUserData = async (token: string) => {
  // Your logic to fetch user data from the database using token
  return {
    name: 'John Doe',
    email: 'johndoe@example.com',
  };
};

const updateUserData = async (token: string, data: any) => {
  // Your logic to update user data in the database
  return {
    success: true,
    data: { ...data },
  };
};

export default accountHandler;
