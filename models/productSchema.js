import { Schema, model } from 'mongoose';

// SCHEMA
const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  // images: { type: Array, required: false }, --> sería lo mismo que abajo
  images: { type: [], required: false }, // podríamos haber puesto '[{type: String}]' para ser más restrictivos (en caso de necesitarlo)
});

// MODEL (es una función que usamos para crear una collection)
const ProductCollection = model('products', productSchema);

export default ProductCollection;
