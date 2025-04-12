import { db } from '../firebase/config';
import { collection, addDoc, getDocs, doc, getDoc, query, where, updateDoc } from 'firebase/firestore';

class OrderService {
  constructor(userId) {
    this.userId = userId;
    this.ordersCollection = collection(db, 'orders');
  }

  async createOrder(orderData) {
    try {
      const orderDetails = {
        ...orderData,
        userId: this.userId,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      const docRef = await addDoc(this.ordersCollection, orderDetails);
      return { success: true, orderId: docRef.id };
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false, error: error.message };
    }
  }

  async getOrderById(orderId) {
    try {
      const orderDoc = await getDoc(doc(this.ordersCollection, orderId));
      if (orderDoc.exists()) {
        return { id: orderDoc.id, ...orderDoc.data() };
      }
      throw new Error('Order not found');
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  }

  async getUserOrders() {
    try {
      const q = query(this.ordersCollection, where('userId', '==', this.userId));
      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, orders };
    } catch (error) {
      console.error('Error getting user orders:', error);
      return { success: false, error: error.message };
    }
  }

  async updateOrderStatus(orderId, newStatus) {
    try {
      const orderRef = doc(this.ordersCollection, orderId);
      await updateDoc(orderRef, { status: newStatus });
      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, error: error.message };
    }
  }
}

export default OrderService;