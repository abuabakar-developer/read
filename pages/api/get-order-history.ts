
// pages/api/get-order-history.ts
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { customer_id } = req.query;

    // Retrieve checkout sessions, filtered by customer ID if available
    const sessions = await stripe.checkout.sessions.list({
      customer: customer_id as string,
      expand: ["data.line_items"],
      limit: 10,
    });

    // Format the response to include items and created_at date
    const orders = sessions.data.map((session) => ({
      id: session.id,
      created_at: session.created,  // Stripe's session `created` timestamp
      items: session.line_items?.data.map((item) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
      })) || [],
    }));

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error retrieving order history:", error);
    res.status(500).json({ error: "Unable to retrieve order history." });
  }
}



