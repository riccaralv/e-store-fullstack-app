/**
 * RECORDATORIO:
 *
 * Middleware es solo una función con tres parámetros: req, res y next.
 *
 * Si nos relacionamos con la DB tenemos que usar 'async'
 */

import jwt from 'jsonwebtoken';
import UserCollection from '../models/userSchema.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.token;
    // VERIFY THIS TOKEN
    const payload = jwt.verify(token, process.env.SIGNATURE); // returns PAYLOAD (viene de 'usersController.js' y la creamos a la vez que el token. Dentro del payload pusimos '_id' e 'email')
    const user = await UserCollection.findById(payload._id);
    // esto nos da la información específica del usuario que buscamos a partir de una de las dos propiedades de payload (id o email)
    // esto te da el usuario específico de la DB
    req.user = user; // creamos una nueva propiedad en el req object
    // el user del igual se corresponde con el user de la línea 17
    // lo que hacemos es añadir la información del usurio (con user) al request object
    next();
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

/**
 * con esta middleware comprobamos si el usuario tiene el token y si es así, con el next(), dejamos que vaya a la ruta protegida para añadir productos, por ejemplo
 *
 * del token, lo que realmente cogemos y utilizamos, es la informacón del usuario --> si tiene token es un usuario valido (ya sea un usario normal o un administrador)
 *
 * AQUÍ SOLO VERIFICAMOS EL TOKEN (que tenga el token no quiere decir que pueda hacer todo lo que puede hacer el administrador)
 */
