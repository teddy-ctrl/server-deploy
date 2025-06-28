const express = require("express");
   const cors = require("cors");
   const dotenv = require("dotenv");
   dotenv.config();
   const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

   const app = express();

   app.use(cors({ origin: true }));
   app.use(express.json());

   app.get("/", (req, res) => {
     res.status(200).json({
       message: "Success !",
     });
   });

   app.post("/payment/create", async (req, res) => {
     const total = parseInt(req.query.total);

     if (total > 0) {
       try {
         const paymentIntent = await stripe.paymentIntents.create({
           amount: total,
           currency: "usd",
         });
         console.log("Payment Intent Created:", paymentIntent.id);
         res.status(201).json({
           clientSecret: paymentIntent.client_secret,
         });
       } catch (error) {
         console.error("Payment Intent Error:", error.message);
         res.status(500).json({
           message: "Failed to create payment intent",
           error: error.message,
         });
       }
     } else {
       res.status(403).json({
         message: "Total must be greater than 0",
       });
     }
   });

   const PORT = process.env.PORT || 5000;

   app.listen(PORT, (err) => {
     if (err) {
       console.error("Server startup error:", err);
       throw err;
     }
     console.log(`Amazon Server Running on PORT: ${PORT}, http://localhost:${PORT}`);
   });