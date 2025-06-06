//Allow the user to pay based on the provided payment intent
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { payment_method_id, payment_intent_id, customer_id, client_secret } =
      body;

    if (!payment_method_id || !payment_intent_id || !customer_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    const paymentMethod = await stripe.paymentMethods.attach(//create a new payment method
      payment_method_id,
      { customer: customer_id },
    );

    const result = await stripe.paymentIntents.confirm(payment_intent_id, {//result of the payment
      payment_method: paymentMethod.id,
    });

    return new Response(//send it to the frontend
      JSON.stringify({
        success: true,
        message: "Payment successful",
        result: result,
      }),
    );
  } catch (error) {
    console.error("Error paying:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,//server error
    });
  }
}