import express from "express";
import cors from "cors";
import Stripe from "stripe";
import { prisma } from "./lib/prisma";

import router from "./routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";

const app = express();

app.use(cors());

// 🚨 STRIPE WEBHOOK (Must be BEFORE express.json())

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27" as any,
});

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

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as any;

      try {
        await prisma.order.update({
          where: { stripePaymentId: paymentIntent.id },
          data: { status: "succeeded" },
        });
        console.log(`💰 Payment for ${paymentIntent.id} succeeded and DB updated!`);
      } catch (dbError) {
        console.error("❌ Database update failed on webhook:", dbError);
      }
    }

    res.json({ received: true });
  }
);


app.use(express.json());

app.use("/api", router);

// Error Handling Middlewares
app.use(globalErrorHandler);
app.use(notFound);

export default app;