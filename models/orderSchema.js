import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    total: { type: Number, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'products' }],
  },
  { timestamps: true }
);

const OrderCollection = model('orders', orderSchema);

export default OrderCollection;

/**
 * { type: Schema.Types.ObjectId, ref: 'users', required: true }
 *
 * Creamos una 'one to many relation' para que cuando hagamos el request de una orden nos dé información sobre qué usuario (según el userId) y qué productos (según id). Decimos que tanto 'userId' como 'products' no son del tipo 'String', sino que son un tipo especial de 'String'.
 *
 * La 'ref' hace referencia a qué collection apunta. Usamos el mismo nombre que hemos usado en el esquema (el de la collection).
 *
 * Lo que hacemos es decirle que vaya a la colección (users o products) y que coja toda la información relativa (a ese user y a lo/s producto/s que se piden)
 */
