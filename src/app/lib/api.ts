// lib/api.ts

import { Book } from "../types";

export const fetchBooksBySearch = async (searchTerm: string): Promise<Book[]> => {
  const res = await fetch(`/api/books?search=${searchTerm}`);
  const data = await res.json();
  return data.items; // Adjust based on your API response structure
};

export const fetchBooksByCategory = async (category: string): Promise<Book[]> => {
  const res = await fetch(`/api/books?category=${category}`);
  const data = await res.json();
  return data.items; // Adjust based on your API response structure
};



