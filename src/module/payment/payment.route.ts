import express from "express";
import Stripe from "stripe";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, email, tutorProfileId, scheduledAt, duration, note } = req.body;

    if (!amount || !email) {
      return res.status(400).json({ error: "Amount and email are required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      metadata: {
        tutorProfileId: tutorProfileId?.toString() || "",
        scheduledAt: scheduledAt || "",
        duration: duration?.toString() || "",
        note: note || "",
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Payment Intent Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export const PaymentRoutes = router;
