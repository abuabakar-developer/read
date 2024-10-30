// src/redux/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Book {
    id: string;
    title: string;
    author: string;
    cover_image: string;
    price: number;
    quantity: number;
}

export interface CartState {
    books: Book[];
}

const initialState: CartState = {
    books: [],
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addBook: (state, action: PayloadAction<Book>) => {
            const existingBook = state.books.find(book => book.id === action.payload.id);
            if (existingBook) {
                existingBook.quantity += action.payload.quantity;
            } else {
                state.books.push(action.payload);
            }
        },
        removeBook: (state, action: PayloadAction<{ id: string }>) => {
            state.books = state.books.filter(book => book.id !== action.payload.id);
        },
    },
});

export const { addBook, removeBook } = cartSlice.actions;

export default cartSlice.reducer;



