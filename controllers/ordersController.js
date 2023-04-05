import OrderCollection from '../models/orderSchema.js';
import ProductCollection from '../models/productSchema.js';
import { stripe } from '../server.js';

export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderCollection.find()
      // .populate('userId', '-profileImage -password')
      .populate('userId', 'lastName email')
      .populate('products', 'title price');
    /*
    populate hace una query a la user DB y va a coger toda la información sobre ese usuario

    El segundo argumento ('-profileImage -password') especifica que NO queremos ver esa información
    Otra manera sería no añadir el guion ('lastName email')  y eso especificaría lo que SÍ queremos ver
    No se puede seleccionar y deseleccionar a la vez
    */
    res.json({ success: true, data: orders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const openStripeCheckoutPage = async (req, res) => {
  try {
    /**
     * console.log(req.body.products); --> en la 'req' recibimos 'const orders' (userId, products y total): el problema es que con 'products' solo recibimos un array con el id del producto y queremos más información
     */
    const data = [];
    for (const id of req.body.products) {
      data.push(await ProductCollection.findById(id));
    }

    // para el display de los datos
    const line_items = data.map((product) => {
      return {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            images: [product.thumbnail],
            description: product.description,
          },
          unit_amount: product.price * 100,
        },
        quantity: 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items, // los productos que el cliente ha elegido. El array tendrá tantos objetos como productos se hayan elegido
      mode: 'payment',
      /**
       * sustituimos `http://localhost:5173/cart?success=true` y `http://localhost:5173/cart?success=false` por las siguientes direcciones
       */
      success_url: `https://e-store-fullstack-app-ricardo.onrender.com/#/cart?success=true`, // a donde elegimos si la compra ha ido bien
      cancel_url: `https://e-store-fullstack-app-ricardo.onrender.com/#/cart?success=false`, // qué ocurre si algo va mal o el cliente cancela la compra
      // añadimos '?success=true' para ver si todo fue bien o no
    });

    res.json({ success: true, url: session.url }); // 'session.url' es la página donde el cliente metes sus datos de compra
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const addNewOrder = async (req, res) => {
  try {
    const order = new OrderCollection(req.body);
    await order.save();
    res.json({ success: true, data: order });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderCollection.findById(id);
    if (order) {
      res.json({ success: true, data: order });
    } else {
      res.json({ success: false, message: 'Please provide a valid id' });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await OrderCollection.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ success: true, data: updatedOrder });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await OrderCollection.findByIdAndRemove(id);
    res.json({ success: true, data: deletedOrder });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getAllUserOrders = async (req, res, next) => {
  try {
    const { id } = req.params;
    // GET ALL ORDERS BELONGING TO THAT SPECIFIC USER
    const userOrders = await OrderCollection.find({ userId: id }).populate(
      'products'
    );
    // este populate me convierte el id en un objeto con toda la información referida a dicho id
    // el userId que hemos definido en 'orderSchema.js' tiene que coincidir con el id que tomo de params y el resultado es un array
    res.json({ success: true, data: userOrders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
