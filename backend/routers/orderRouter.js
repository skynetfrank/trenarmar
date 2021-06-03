import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Producto from '../models/productModel.js';
import { isAdmin, isAuth, mailgun, payOrderEmailTemplate, } from '../utils.js';


const orderRouter = express.Router();

orderRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const orderid = req.query.orderid || '';
  const orderidFilter = orderid ? { _id: orderid } : {};
  const user = req.query.user || '';
  const userFilter = user ? { user } : {};
  const count = await Order.countDocuments({
    ...userFilter,
    ...orderidFilter,
  });
  const orders = await Order.find({
    ...userFilter,
    ...orderidFilter,
  }).populate(
    'user',
    'name'
  )
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  res.send({ orders, page, pages: Math.ceil(count / pageSize) });
})
);

orderRouter.get('/mine', isAuth, expressAsyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const orderid = req.query.orderid || '';
  const orderidFilter = orderid ? { _id: orderid } : {};
  const count = await Order.countDocuments({
    user: req.user._id,
    ...orderidFilter,
  });

  const orders = await Order.find({
    user: req.user._id,
    ...orderidFilter,

  })
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.send({ orders, page, pages: Math.ceil(count / pageSize) });
}));


orderRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {

  if (req.body.orderItems.length === 0) {
    res.status(400).send({ message: "El carrito esta vacio!" });
  } else {
    const order = new Order({
      orderItems: req.body.orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      paymentResult: {
        status: 'POR_CONFIRMAR',
      },
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });
    const createdOrder = await order.save();
    //actualizacion del stock de producto (inventario)
    req.body.orderItems.map(async (item) => {
      const cantidad = item.qty;
      const producto = await Producto.findById(item.producto);
      if (producto) {
        producto.countInStock = producto.countInStock - cantidad;
        const updatedProduct = await producto.save();
        console.log('Stock Actualizado a la baja!', updatedProduct);
      } else {
        console.log('Inventario-update: Producto No Encontrado!');
      }
    })
    res.status(201).send({ message: "La Orden ha sido Creada!", order: createdOrder });
  }
}));

orderRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    const deleteOrder = await order.remove();
    res.send({ message: 'Orden Eliminada!', order: deleteOrder });
  } else {
    res.status(404).send({ message: 'Orden No Encontrada' });
  }

  //actualizacion del stock de producto (inventario)
  //por cancelacion de orden antes de pagarla
  order.orderItems.map(async (item) => {
    const cantidad = item.qty;
    const producto = await Producto.findById(item.producto);
    if (producto) {
      producto.countInStock = producto.countInStock + cantidad;
      const updatedProduct = await producto.save();
      console.log('Stock Actualizado a la alta (cancelacion de orden)', updatedProduct);
    } else {
      console.log('Inventario-update: Producto No Encontrado!');
    }
  })
})
);

orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    res.send(order);
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
})
);


orderRouter.put('/:id/pay', isAuth, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'email name'
  );
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
      banco: req.body.banco,
      referencia: req.body.referencia,
      fechaTransferencia: req.body.fechaTransferencia,
    };
    const updatedOrder = await order.save();
    mailgun()
      .messages()
      .send(
        {
          from: 'Amazonia <sandboxf5075cc5962a46739be3edc551bb6fea.mailgun.org>',
          to: `${order.user.name} <${order.user.email}>`,
          subject: `Nueva orden ${order._id}`,
          html: payOrderEmailTemplate(order),
        },
        (error, body) => {
          if (error) {
            console.log(error);
          } else {
            console.log(body);
          }
        }
      );
    res.send({ message: 'Orden Pagada!', order: updatedOrder });
  } else {
    res.status(404).send({ message: 'Orden No encontrada!' });
  }
})
);



orderRouter.put('/:id/deliver', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.send({ message: 'Orden Entregada OK!', order: updatedOrder });
  } else {
    res.status(404).send({ message: 'Orden No Encontrada' });
  }
})
);

orderRouter.put('/:id/payconfirm', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.paymentResult.status = 'CONFIRMADO';
    const updatedOrder = await order.save();
    res.send({ message: 'Transferencia Bancaria Confirmada OK!', order: updatedOrder });
  } else {
    res.status(404).send({ message: 'Orden No Encontrada' });
  }
})
);

export default orderRouter;











