// src/types/rootState.ts
import { CartState } from '../app/redux/cartSlice';
 // Ensure this path is correct
export interface RootState {
  cart: CartState;
  // Add other slices of state as needed
}


