import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Kit } from '../types/database.types';

interface CartItem {
  kit: Kit;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (kit: Kit, quantity?: number) => void;
  removeItem: (kitId: string) => void;
  updateQuantity: (kitId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (kit: Kit, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find((item) => item.kit.id === kit.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.kit.id === kit.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { kit, quantity }] });
        }
      },

      removeItem: (kitId: string) => {
        set({
          items: get().items.filter((item) => item.kit.id !== kitId),
        });
      },

      updateQuantity: (kitId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(kitId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.kit.id === kitId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.kit.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);