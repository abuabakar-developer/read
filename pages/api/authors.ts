// pages/api/authors.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/app/lib/mongodb'; // Import your database connection function
import Author from '@/app/models/Author'; // Import your Author model

interface AuthorType {
    _id: string;
    name: string;
    // Add other author fields as necessary
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await dbConnect(); // Ensure the database connection is established

    const { name } = req.query;

    // Validate the 'name' query parameter
    if (!name || Array.isArray(name)) {
        return res.status(400).json({ message: 'Invalid name parameter' });
    }

    try {
        // Fetch authors from the database
        const authors: AuthorType[] = await Author.find({
            name: new RegExp(name, 'i'), // Case-insensitive regex search
        });

        // If no authors are found, return a 404 status
        if (!authors.length) {
            return res.status(404).json({ message: 'No authors found' });
        }

        // Return the found authors
        res.status(200).json(authors);
    } catch (error) {
        // Return a 500 status for any server error
        console.error('Error fetching authors:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
}
