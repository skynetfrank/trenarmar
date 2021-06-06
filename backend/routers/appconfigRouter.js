import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import data from '../data.js';
import Config from '../models/configModel.js';
import { generateToken } from '../utils.js';
import { isAuth, isAdmin } from '../utils.js';

const appconfigRouter = express.Router();

//build crud-api for config list,delete,update
appconfigRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  console.log("config router is working");
  const configuracion = await Config.findOne();
  res.send(configuracion);
})
);

appconfigRouter.get('/seed', expressAsyncHandler(async (req, res) => {
  //await config.remove({});
  console.log("SEED DISPARADA: error de configuracion");
  const createdConfig = await Config.create(data.config);
  res.send({ createdConfig });
})
);

appconfigRouter.put('/update', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const config = await Config.findOne();

  if (config) {
    config.cambioManual = req.body.cambioManual || config.cambioManual;
    config.tasaIva = req.body.tasaIva || config.tasaIva;
    config.otrosImp = req.body.otrosImp || config.otrosImp;
    config.montoEnvio = req.body.montoEnvio || config.montoEnvio;
    config.mostrarBs = req.body.mostrarBs;
    config.mostrarBcv = req.body.mostrarBcv;

    const updatedConfig = await config.save();
    res.send({ message: 'Configuracion Actualizada', config: updatedConfig });
  } else {
    res.status(404).send({ message: 'Configuracion No Encontrada' });
  }
})
);






export default appconfigRouter;