import express from 'express'; // también se podría haber desestructurado
import {
  addNewProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from '../controllers/productsController.js';
import { auth } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router(); // nos permite crear una ruta en un archivo independiente y exportarla. Aquí no podríamos hacer 'app.get()'. Lo que nos devuelve 'router', que es un objeto con distintos métodos

// GET = get all products
router.get('/', getAllProducts); // si recibimos una GET request a '/products/' ejecutamos la función (que es el controller o request handler)

// GET = get a single product
router.get('/:id', getSingleProduct);

// POST = add new product
router.post('/', auth, isAdmin, addNewProduct);

// PATCH = update a single product
router.patch('/:id', auth, isAdmin, updateProduct);

// DELETE = delete a single product
router.delete('/:id', auth, isAdmin, deleteProduct);

export default router;
