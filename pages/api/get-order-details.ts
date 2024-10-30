// pages/api/get-order-details.ts
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { session_id } = req.query;

  if (!session_id || typeof session_id !== "string") {
    return res.status(400).json({ error: "Session ID is required" });
  }

  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items.data.price.product"],
    });

    if (!session) {
      return res.status(404).json({ error: "Order not found" });
    }

    const orderDetails = {
      id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_details?.email,
      payment_status: session.payment_status,
      line_items: session.line_items?.data.map((item) => ({
        id: item.id,
        description: item.description || item.price.product.name,
        quantity: item.quantity,
        amount_total: item.amount_total,
      })),
    };

    res.status(200).json(orderDetails);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ error: "Failed to retrieve order details" });
  }
}





