import UserCollection from '../models/userSchema.js';
import ImageCollection from '../models/imageSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserCollection.find();
    res.json({ success: true, data: users });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserCollection.findById(id);
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.json({ success: false, message: 'Please provide a valid id' });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const addNewUser = async (req, res) => {
  try {
    const user = new UserCollection(req.body);

    // STORING IMAGE IN THE DB
    if (req.files) {
      // si subo foto hogo esto (si no, se sube una imagen por defecto, tal como definí en el userSchema)
      const image = new ImageCollection({
        filename: new Date().getTime() + '_' + req.files.image.name,
        data: req.files.image.data,
        userId: user._id,
        // new Date().getTime() lo añadimos para que el fileName sea siempre específico
        // en 'req.files.image.name' la palabra 'image' hace referencia al nombre de la propiedad en thunder client
      });
      await image.save();
      user.profileImage = `http://localhost:4000/images/${image.filename}`;
    }

    // HASHING PASSWORD
    const hashedPassword = bcrypt.hashSync(user.password, 10); // lo que quiero ocultar y el salt
    user.password = hashedPassword;

    // STORING USER IN DB
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await UserCollection.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ success: true, data: updatedUser });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await UserCollection.findByIdAndRemove(id);
    res.json({ success: true, data: deletedUser });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// AUTHENTICATION
export const loginUser = async (req, res) => {
  // authentication is a process of authorizing user --> para ello damos un token
  // ISSUE TOKEN (CERTIFICATE)
  try {
    const { email, password } = req.body;
    // finding using by email --> verifying email
    const user = await UserCollection.findOne({ email });
    if (user) {
      // verifying password
      const verifyPassword = bcrypt.compareSync(password, user.password); // returns Boolean
      if (verifyPassword) {
        // issue token (certificate) --> creamos el token
        const token = jwt.sign(
          { _id: user._id, email: user.email }, // esto es el PAYLOAD
          process.env.SIGNATURE,
          { expiresIn: '1h', issuer: 'Lili', audience: 'e-store-user' } // este último objeto es opcional
        );
        // devolvemos el token al usuario (el token va en el header)
        res.header('token', token).json({ success: true, data: user });
      } else {
        res.json({ success: false, message: "The password doesn't match" });
      }
    } else {
      res.json({
        success: false,
        message: "The email doesn't exist in our database",
      });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
