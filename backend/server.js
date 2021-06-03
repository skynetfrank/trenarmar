import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productRouter from './routers/productRouter.js';
import userRouter from './routers/userRouter.js';
import orderRouter from './routers/orderRouter.js';
import appconfigRouter from './routers/appconfigRouter.js';
import path from 'path';
import uploadRouter from './routers/uploadRouter.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 5000;
const mongodb_local = 'mongodb://localhost/amazonia';
const mongodb_compose = 'mongodb://mongo/amazonia'
const mongodb_cloud = process.env.MONGODB_URI || 'mongodb://localhost/amazonia';

//process.env.MONGODB_URI || 'mongodb://localhost/amazonia'
mongoose.connect(mongodb_cloud, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => console.log("Conectado a MongoDB"))
  .catch(error => console.log("MongoDB error:", error.message));

//api endpoints 
app.use('/api/appconfig', appconfigRouter);
app.use('/api/uploads', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/productos', productRouter);
app.use('/api/orders', orderRouter);
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

//aqui se establece el directorio absoluto
//desde la raiz hasta el directorio de trabajo
//despues se hace join para acceder a los subdirectorios del servidor 
const __dirname = path.resolve();

//este middleware intercepta todas las solicitudes que tenga el url /uploads
//como por ej: los src=de las imagenes (campo imagen de db) y las envia al
//directorio /loads del servidor. Donde estan las imagenes subidas de los productos nuevos
//los url/api/uploads son interceptado antes y enviados a su uploadRouter ya que 
//este no esta solicitando cargar una imagen al frontend sino subir una imagen al servidor. 
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

//manejador de errores global de todas las api
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
})


app.listen(port, () => {
  console.log(`servidor ok escuchando en http://localhost:${port}`);
});