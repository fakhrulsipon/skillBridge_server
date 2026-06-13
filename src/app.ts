import express from "express";
import cors from "cors";
import Stripe from "stripe";

import router from "./routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";

const app = express();

app.use(cors());

// -------------------------------------------------------------------------
// 🚨 STRIPE WEBHOOK (Must be BEFORE express.json())
// -------------------------------------------------------------------------
// ✅ সঠিক ও নিরাপদ কোড
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"]!;
    let event: any;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error(`❌ Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // পেমেন্ট সফল হলে এই ব্লকটি রান হবে
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as any;
      
      // ডাটাবেজ আপডেটের ঝামেলাযুক্ত কোডটি সরিয়ে শুধু একটি কনসোল লগ রাখা হলো
      console.log(`💰 Stripe Payment Intent ${paymentIntent.id} succeeded via Webhook!`);
    }

    res.json({ received: true });
  }
);

// -------------------------------------------------------------------------
// গ্লোবাল মিডলওয়্যার এবং বাকি রাউটস (Webhook এর নিচে থাকবে)
// -------------------------------------------------------------------------
app.use(express.json());

app.use("/api", router);

// Error Handling Middlewares
app.use(globalErrorHandler);
app.use(notFound);

export default app;