import express from 'express';
import {
  addNewUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  loginUser,
  updateUser,
} from '../controllers/usersController.js';
import { auth } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { rules } from '../middlewares/validators.js';

const router = express.Router();

// GET request => "/users/" => get all users
router.get('/', auth, isAdmin, getAllUsers);

// POST request => "/users/" => add new user
router.post('/', rules, addNewUser); // --> 'rules' (es una middleware) comprueba si es el usuario válido y una vez hecho permite que pueda añadir un usuario

// POST request => "/users/login" => user authentication
router.post('/login', loginUser); // tiene que ir aquí, antes de las siguientes rutas (especiales)

// verifyToken on refresh page --> tenemos que ponerla encima de 'getSingleUser'
// get "/users/refreshpage"
router.get('/refreshpage', auth, (req, res) => {
  res.json({ success: true, data: req.user });
});

// GET request => "/users/sadfasd89sdah43" => get a single user
router.get('/:id', auth, isAdmin, getSingleUser);

// PATCH request => "/users/sadfasd89sdah43" => update a single user
router.patch('/:id', auth, isAdmin, updateUser);

// DELETE request => "/users/sadfasd89sdah43" => delete a single user
router.delete('/:id', auth, isAdmin, deleteUser);

export default router;
