import express from 'express';
import {
  addNewOrder,
  deleteOrder,
  getAllOrders,
  getAllUserOrders,
  getSingleOrder,
  openStripeCheckoutPage,
  updateOrder,
} from '../controllers/ordersController.js';
import { auth } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// GET = get all orders --> "/orders/"
router.get('/', auth, isAdmin, getAllOrders);

// POST = redirecting user to stripe checkout page --> "/orders/"
router.post('/', auth, openStripeCheckoutPage);

// POST = add new order --> "/orders/confirm"
router.post('/confirm', auth, addNewOrder);

// GET = get all user's orders --> "/orders/userorders/fasfd345sdfasd"
router.get('/userorders/:id', auth, isAdmin, getAllUserOrders);

// GET = get a single order  --> "/orders/23232354wdfas5a5a5sasdf"
router.get('/:id', auth, isAdmin, getSingleOrder);

// PATCH = update a single order --> "/orders/23232354wdfas5a5a5sasdf"
router.patch('/:id', auth, isAdmin, updateOrder);

// DELETE = delete a single order
router.delete('/:id', auth, isAdmin, deleteOrder);

export default router;
