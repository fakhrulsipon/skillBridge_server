import dotenv from "dotenv";
dotenv.config();
import express from "express";
import config from "./config";
import app from "./app";
import { prisma } from "./lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27" as any,
});

async function main() {
  try {
    await prisma.$connect();

    // Create Payment Intent for Tutor Booking
    app.post("/api/create-payment-intent", express.json(), async (req, res) => {
      try {
        const { amount, email, tutorProfileId, scheduledAt, duration, note } = req.body;

        if (!amount || !email) {
          return res.status(400).json({ error: "Amount and email are required" });
        }

        // Stripe Payment Intent তৈরি করা হচ্ছে
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // ডলার থেকে সেন্টস-এ কনভার্ট ($20 = 2000 cents)
          currency: "usd",
          automatic_payment_methods: { enabled: true },
          receipt_email: email,
          metadata: {
            tutorProfileId: tutorProfileId?.toString(),
            scheduledAt,
            duration: duration?.toString(),
            note,
          },
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
      } catch (error: any) {
        console.error("❌ Payment Intent Error:", error.message);
        res.status(500).json({ error: error.message });
      }
    });

    // SERVER START
    app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();