import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

// Initialize Stripe with your secret key
// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});


// Define the shape of a cart item
interface CartItem {
  name: string;
  image: string;
  price: number; // Assuming this is in dollars
  quantity: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { cartItems }: { cartItems: CartItem[] } = req.body; // Define the expected shape of the request body

      // Create a checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: cartItems.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: Math.round(item.price * 100), // Convert price to cents
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        // Include session_id in success_url
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      // Respond with the session ID to the client
      res.status(200).json({ id: session.id });
    } catch (err: unknown) {
      // Use 'unknown' for error type to avoid 'any'
      const errorMessage = err instanceof Error ? err.message : 'Failed to create checkout session';
      res.status(500).json({ error: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

