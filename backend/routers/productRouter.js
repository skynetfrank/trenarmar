import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Producto from '../models/productModel.js';
import User from '../models/userModel.js';
import { isAdmin, isAuth } from '../utils.js';


const productRouter = express.Router();

productRouter.get('/', expressAsyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const nombre = req.query.nombre || '';
  const nombreFilter = nombre ? { nombre: { $regex: nombre, $options: 'i' } } : {};
  const count = await Producto.countDocuments({ ...nombreFilter, });
  const productos = await Producto.find({ ...nombreFilter, })
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  res.send({ productos, page, pages: Math.ceil(count / pageSize) });
}));


productRouter.get('/seed', expressAsyncHandler(async (req, res) => {
  //await Producto.remove({});
  const createProducts = await Producto.insertMany(data.productos);
  res.send({ createProducts });
}));


productRouter.get('/:id', expressAsyncHandler(async (req, res) => {
  const producto = await Producto.findById(req.params.id);
  if (producto) {
    res.send(producto);
  } else {
    res.status(404).send({ message: 'Producto no encontrado!' });
  }
}));

//api: crea un nuevo producto sin editar con imagen P0 por default
productRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {
  const producto = new Producto({
    nombre: 'Producto-Nuevo-Por-Editar-' + Date.now(),
    imagen: '/images/p0.jpg',
    precio: 0,
    categoria: 'categoria-producto-nuevo',
    marca: 'marca-producto-nuevo',
    countInStock: 0,
    rating: 1,
    numReviews: 0,
    descripcion: 'Describir-Producto-Nuevo-aqui ',
  });
  const createdProduct = await producto.save();
  res.send({ message: 'Producto Creado', producto: createdProduct });
})
);



//Edit Product API
productRouter.put('/:id', isAuth, expressAsyncHandler(async (req, res) => {
  const productId = req.params.id;
  const producto = await Producto.findById(productId);
  if (producto) {
    producto.nombre = req.body.nombre;
    producto.precio = req.body.precio;
    producto.imagen = req.body.imagen;
    producto.categoria = req.body.categoria;
    producto.marca = req.body.marca;
    producto.countInStock = req.body.countInStock;
    producto.descripcion = req.body.descripcion;
    const updatedProduct = await producto.save();
    res.send({ message: 'Producto Actualizado', producto: updatedProduct });
  } else {
    res.status(404).send({ message: 'Producto No Encontrado' });
  }
})
);

//Delete Producto API
productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const producto = await Producto.findById(req.params.id);
  if (producto) {
    const deleteProduct = await Producto.remove(producto);
    console.log("Producto eliminado");
    res.send({ message: 'Product Deleted', producto: deleteProduct });
  } else {
    res.status(404).send({ message: 'Producto No Encontrado' });
  }
})
);

export default productRouter;