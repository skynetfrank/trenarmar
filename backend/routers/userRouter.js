import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import data from '../data.js';
import User from '../models/userModel.js';
import { generateToken } from '../utils.js';
import { isAuth, isAdmin } from '../utils.js';

const userRouter = express.Router();

userRouter.get('/seed', expressAsyncHandler(async (req, res) => {
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdUsers });
})
);

userRouter.post('/signin', expressAsyncHandler(async (req, res) => {

  const user = await User.findOne({ email: req.body.email });
  console.log("testing");
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
      return;
    }
    res.status(401).send({ message: 'password incorrecta!' })
  } else {
    res.status(401).send({ message: 'email mal escrito o no existe!' })
  }
})
);

userRouter.post('/register', expressAsyncHandler(async (req, res) => {
  const user = new User({
    name: req.body.name,
    apellido: req.body.apellido,
    cedula: req.body.cedula,
    codigo: req.body.codigo,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  console.log("req.body.name", req.body);
  console.log("req.body.apellido", req.body.apellido);
  console.log("req.body.cedula,", req.body.cedula,);
  console.log("req.body.codigo", req.body.codigo);
  console.log("req.body.email", req.body.email);
  console.log("req.body.password", req.body.password);


  console.log("User:", user);
  console.log("password:", req.body.password);
  const createdUser = await user.save();
  res.send({
    _id: createdUser._id,
    name: createdUser.name,
    email: createdUser.email,
    isAdmin: createdUser.isAdmin,
    token: generateToken(createdUser),
  });
})
);

userRouter.get('/:id', expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: 'usuario no encontrado!' });
  }
}));


userRouter.put('/profile', isAuth, expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.apellido = req.body.email || user.apellido;
    user.cedula = req.body.cedula || user.cedula;
    user.codigo = req.body.codigo || user.codigo;


    if (user.isSeller) {
      user.seller.name = req.body.sellerName || user.seller.name;
      user.seller.logo = req.body.sellerLogo || user.seller.logo;
      user.seller.description =
        req.body.sellerDescription || user.seller.description;
    }
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 8);
    }
    const updatedUser = await user.save();
    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      apellido: updatedUser.apellido,
      cedula: updatedUser.cedula,
      codigo: updatedUser.codigo,
      isAdmin: updatedUser.isAdmin,
      isSeller: user.isSeller,
      token: generateToken(updatedUser),
    });
  }
})
);


//build crud-api for users list,delete,update
userRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const users = await User.find({});
  res.send(users);
})
);

userRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.email === 'admin@example.com') {
      res.status(400).send({ message: 'Can Not Delete Admin User' });
      return;
    }
    const deleteUser = await user.remove(user);
    res.send({ message: 'Usuario Eliminado', user: deleteUser });
  } else {
    res.status(404).send({ message: 'Usuario No Encontrado' });
  }
})
);

userRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);
    // user.isAdmin = req.body.isAdmin || user.isAdmin;
    const updatedUser = await user.save();
    res.send({ message: 'Usuario Actualizado', user: updatedUser });
  } else {
    res.status(404).send({ message: 'Usuario No Encontrado' });
  }
})
);

export default userRouter;