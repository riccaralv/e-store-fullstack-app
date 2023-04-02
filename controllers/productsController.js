import ProductCollection from '../models/productSchema.js';

// SIEMPRE QUE INTERACTUAMOS CON LA DB SE TRATA DE UN ASYNC PROCESS, por eso añadimos 'async' (junto a try-catch)

export const getAllProducts = async (req, res) => {
  // request handler / controller
  try {
    const products = await ProductCollection.find();
    res.json({ success: true, data: products }); // mandamos respuesta al client
  } catch (err) {
    res.json({ success: false, message: err.message }); // Naqvi siempre aconseja usar el mismo formato para la response (ya sea este o cualquier otro, pero siempre el mismo)
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // const product = await ProductCollection.findOne({ _id: id });
    // const product = await ProductCollection.findOne({ title: "iPhone 14" });
    const product = await ProductCollection.findById(id); // solo recibe 'id' y no un objeto como findOne()
    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.json({ success: false, message: 'Please provide a valid id' });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const addNewProduct = async (req, res) => {
  try {
    // const product = ProductCollection.create(req.body);
    const product = new ProductCollection(req.body); // creamos una instancia (por eso usaremos save())
    await product.save(); // guardamos en la DB
    res.json({ success: true, data: product });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await ProductCollection.findByIdAndUpdate(
      id,
      req.body, // lo que quiero actualizar. Tiene que ser un objeto
      { new: true } // para que actualice la DB y me devuelva el producto actualizado en thunder client
    );
    res.json({ success: true, data: updatedProduct });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await ProductCollection.findByIdAndRemove(id);
    res.json({ success: true, data: deletedProduct });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
