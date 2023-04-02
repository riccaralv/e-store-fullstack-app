/*
// This is your test secret API key.
const stripe = require('stripe')(
  'sk_test_51MrGvOGYK3i1zG18eK5y7FD5vjmK4thr2tKrqe1lBplxdYQ0XHCusU1JuDqzUmkr5aPkUSm9hG2H3JLSGq8QyV9c00hB1PIno3'
);
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:4242';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log('Running on port 4242'));
*/

// This is your test secret API key.
const stripe = require('stripe')(
  'sk_test_51MrGvOGYK3i1zG18eK5y7FD5vjmK4thr2tKrqe1lBplxdYQ0XHCusU1JuDqzUmkr5aPkUSm9hG2H3JLSGq8QyV9c00hB1PIno3'
);
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:4242'; // este es el client (frontend)

app.post('/orders', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    // los productos que el cliente ha elegido. El array tendrá tantos objetos como productos se hayan elegido
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    mode: 'payment',
    // a donde elegimos si la compra ha ido bien
    success_url: `${YOUR_DOMAIN}?success=true`,
    // qué ocurre si algo va mal o el cliente cancela la compra
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.json({ url: session.url }); // 'session.url' es la página donde el cliente metes sus datos de compra
});

app.listen(4242, () => console.log('Running on port 4242'));
