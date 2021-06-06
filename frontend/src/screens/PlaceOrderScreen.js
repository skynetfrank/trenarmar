import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';
import CheckoutSteps from '../components/CheckoutSteps'
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';

export default function PlaceOrderScreen(props) {
  const cart = useSelector((state) => state.cart);
  if (!cart.paymentMethod) {
    props.history.push('/payment');
  }

  const orderCreate = useSelector(state => state.orderCreate);
  const { loading, success, error, order } = orderCreate;

  //una pequeña funcion para formatear numeros a dos decimales
  const toPrice = (num) => Number(num.toFixed(2));
  cart.itemsPrice = toPrice(cart.cartItems.reduce((a, c) => a + c.qty * c.precio, 0));
  cart.shippingPrice = cart.itemsPrice > 0 ? toPrice(0) : toPrice(10);
  cart.taxPrice = toPrice(cart.itemsPrice * 0);
  cart.totalPrice = toPrice(cart.itemsPrice + cart.shippingPrice)
  const dispatch = useDispatch();

  const placeOrderHandler = () => {
    dispatch(createOrder({ ...cart, orderItems: cart.cartItems }))
  };

  useEffect(() => {
    if (success) {
      props.history.push(`/order/${order._id}`)
      dispatch({
        type: ORDER_CREATE_RESET,
      });
    }

  }, [dispatch, order, props.history, success]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card-max card-body">
                <strong>Procesar Pedido</strong>
                <p>
                  <strong>Nombre: </strong>{cart.shippingAddress.fullName} <br />
                  <strong>Direccion: </strong>{cart.shippingAddress.address},
                  {cart.shippingAddress.city},{cart.shippingAddress.postalCode},
                  {cart.shippingAddress.country}
                </p>
                <p>
                  <strong>Metodo de Pago: </strong>{cart.paymentMethod}
                </p>

              </div>
            </li>

            <li>
              <div className="card-max card-body">
                <strong>Articulos de este Pedido</strong>
                <ul>
                  {
                    cart.cartItems.map((item) => (
                      <li className="placeOrderLi" key={item.producto}>
                        <div className="row">
                          <div>
                            <img className="small" src={item.imagen} alt={item.nombre}></img>
                          </div>
                          <div className="min-30">
                            <Link to={`/product/${item.producto}`}>{item.nombre}</Link>
                          </div>
                          <div className="itemsporprecio">
                            {item.qty} x $ {(item.precio).toFixed(2)} = ${(item.qty * item.precio).toFixed(2)}
                          </div>
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </li>
          </ul>

        </div>



        <div className="col-1">
          <div className="card card-body small">
            <ul>
              <li>
                <h1 className="grueso">Resumen</h1>
              </li>
              <li>
                <div className="row">
                  <div>Articulos</div>
                  <div>${cart.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Envio</div>
                  <div>${cart.shippingPrice.toFixed(2)}</div>
                </div>
              </li>

              <li>
                <div className="row">
                  <div><strong>Total Global</strong></div>
                  <div><strong>${cart.totalPrice.toFixed(2)}</strong></div>
                </div>
              </li>
              <li>
                <button type="button"
                  className="primary block"
                  onClick={placeOrderHandler}
                  disabled={cart.cartItems.length === 0}>
                  Envia tu Orden de Compra!
              </button>
              </li>
              {loading && <LoadingBox></LoadingBox>}
              {error && <MessageBox variant="danger">{error}</MessageBox>}
            </ul>
          </div>
        </div>


      </div>
    </div>
  )
}
