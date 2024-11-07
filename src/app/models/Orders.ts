
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  status: { type: String, required: true },
  items: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
  }],
  stripeSessionId: { type: String, required: true },
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;


