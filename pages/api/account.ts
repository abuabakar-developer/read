import { NextApiRequest, NextApiResponse } from 'next';

// Define an interface for the user data
interface UserData {
  name: string;
  email: string;
}

// Define a more specific type for update data
type UpdateData = {
  name?: string;
  email?: string;
};

const accountHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from headers

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      // Fetch user data without passing token since it is unused there
      const userData = await getUserData();
      return res.status(200).json(userData);

    case 'PUT':
      // Update user data without passing token since it is unused there
      const updatedUser = await updateUserData(req.body);
      return res.status(200).json(updatedUser);

    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
};

const getUserData = async (): Promise<UserData> => {
  // Logic to fetch user data from the database
  return {
    name: 'John Doe',
    email: 'johndoe@example.com',
  };
};

const updateUserData = async (data: UpdateData) => {
  // Logic to update user data in the database
  return {
    success: true,
    data: { ...data },
  };
};

export default accountHandler;
