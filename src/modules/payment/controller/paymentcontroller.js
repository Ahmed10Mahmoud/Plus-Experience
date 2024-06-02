import Payment from "../../../../db/model/Payment.js";

export const createPayment = async (req, res) => {
  const { method, amount, currency, cardNumber, cardExpiry, cardCVC, paypalEmail } = req.body;

  try {
    const payment = new Payment({
      method,
      amount,
      currency,
      cardNumber,
      cardExpiry,
      cardCVC,
      paypalEmail,
      user: req.id,
    });

    await payment.save();
    res.status(201).send(payment);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
