import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: String,
    required: function () { return this.method === 'visa'; },
  },
  cardExpiry: {
    type: String,
    required: function () { return this.method === 'visa'; },
  },
  cardCVC: {
    type: String,
    required: function () { return this.method === 'visa'; },
  },
  paypalEmail: {
    type: String,
    required: function () { return this.method === 'paypal'; },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
