import { db } from '../firebase/config';
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

class CartService {
  constructor(userId) {
    this.userId = userId;
    this.cartRef = doc(db, 'carts', userId);
  }

  async getCart() {
    try {
      const cartDoc = await getDoc(this.cartRef);
      if (cartDoc.exists()) {
        return cartDoc.data().items || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching cart:', error);
      return [];
    }
  }

  async updateCart(items) {
    try {
      await setDoc(this.cartRef, { items }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating cart:', error);
      return false;
    }
  }

  async addItem(item) {
    try {
      const currentCart = await this.getCart();
      const existingItemIndex = currentCart.findIndex(i => i.id === item.id);

      if (existingItemIndex !== -1) {
        currentCart[existingItemIndex].quantity = (currentCart[existingItemIndex].quantity || 1) + 1;
      } else {
        currentCart.push({ ...item, quantity: 1 });
      }

      await this.updateCart(currentCart);
      return true;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return false;
    }
  }

  async removeItem(itemId) {
    try {
      const currentCart = await this.getCart();
      const updatedCart = currentCart.filter(item => item.id !== itemId);
      await this.updateCart(updatedCart);
      return true;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return false;
    }
  }

  async updateItemQuantity(itemId, change) {
    try {
      const currentCart = await this.getCart();
      const itemIndex = currentCart.findIndex(item => item.id === itemId);

      if (itemIndex !== -1) {
        currentCart[itemIndex].quantity = Math.max(1, (currentCart[itemIndex].quantity || 1) + change);
        await this.updateCart(currentCart);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating item quantity:', error);
      return false;
    }
  }

  async clearCart() {
    try {
      await deleteDoc(this.cartRef);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  }
}

export default CartService;