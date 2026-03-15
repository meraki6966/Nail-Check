import type { Express } from "express";
import { db } from "../db";
import { sql } from "drizzle-orm";

/**
 * Stripe webhook handler to sync membership status
 * 
 * Set up in Stripe Dashboard:
 * 1. Go to Developers → Webhooks
 * 2. Add endpoint: https://nail-check-production.up.railway.app/api/webhooks/stripe
 * 3. Select events: customer.subscription.created, customer.subscription.updated, customer.subscription.deleted
 * 4. Copy webhook signing secret to Railway env: STRIPE_WEBHOOK_SECRET
 */

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

export function registerStripeWebhook(app: Express): void {
  app.post("/api/webhooks/stripe", async (req, res) => {
    try {
      const signature = req.headers["stripe-signature"] as string;

      if (!signature || !STRIPE_WEBHOOK_SECRET) {
        console.error("Stripe webhook: Missing signature or secret");
        return res.status(400).json({ error: "Missing signature or secret" });
      }

      // Verify webhook signature (using Stripe SDK)
      // const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
      // const event = stripe.webhooks.constructEvent(req.rawBody, signature, STRIPE_WEBHOOK_SECRET);

      // For now, parse the event directly (add Stripe SDK verification in production)
      const event = req.body;

      console.log("Stripe webhook received:", event.type);

      // Handle subscription events
      switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated":
          await handleSubscriptionUpdate(event.data.object);
          break;

        case "customer.subscription.deleted":
          await handleSubscriptionCancellation(event.data.object);
          break;

        default:
          console.log("Unhandled event type:", event.type);
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Stripe webhook error:", error);
      res.status(500).json({ error: "Webhook handler failed" });
    }
  });
}

/**
 * Handle subscription creation/update
 */
async function handleSubscriptionUpdate(subscription: any) {
  try {
    const customerId = subscription.customer;
    const subscriptionId = subscription.id;
    const status = subscription.status; // active, past_due, canceled, etc.
    const planId = subscription.items.data[0]?.price?.id || null;

    console.log("Updating subscription:", { customerId, subscriptionId, status, planId });

    // Update user in database
    await db.execute(sql`
      UPDATE users
      SET 
        is_paid_member = ${status === 'active'},
        membership_status = ${status},
        membership_plan = ${planId},
        stripe_customer_id = ${customerId},
        stripe_subscription_id = ${subscriptionId}
      WHERE stripe_customer_id = ${customerId}
    `);

    console.log("Subscription updated successfully");
  } catch (error) {
    console.error("Error updating subscription:", error);
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancellation(subscription: any) {
  try {
    const customerId = subscription.customer;

    console.log("Cancelling subscription for customer:", customerId);

    // Update user in database
    await db.execute(sql`
      UPDATE users
      SET 
        is_paid_member = false,
        membership_status = 'cancelled',
        membership_plan = NULL,
        stripe_subscription_id = NULL
      WHERE stripe_customer_id = ${customerId}
    `);

    console.log("Subscription cancelled successfully");
  } catch (error) {
    console.error("Error cancelling subscription:", error);
  }
}
