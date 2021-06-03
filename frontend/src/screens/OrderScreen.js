import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { PayPalButton } from 'react-paypal-button-v2';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { payconfirmOrder, deliverOrder, detailsOrder, payOrder } from '../actions/orderActions';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_PAY_RESET } from '../constants/orderConstants';

export default function OrderScreen(props) {
  const orderId = props.match.params.id;
  const [sdkReady, setSdkReady] = useState(false);
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, error: errorPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    
  } = orderDeliver;

  const orderPayconfirm = useSelector((state) => state.orderPayconfirm);
  const { loading: loadingPayconfirm, error: errorPayconfirm, 
  } = orderPayconfirm;

  const dataBancos = ["Banco.....", "Efectivo-Cash", "Banesco", "Venezuela", "Mercantil",
    "Provincial", "Banco del Caribe", "Banco BNC", "Banco BOD", "Banco del Tesoro", "Vzlano de Credito"]

  const [referencia, setReferencia] = useState('');
  const [banco, setBanco] = useState('');
  const [fechaTransfer, setFechaTransfer] = useState(Date());
  const dispatch = useDispatch();

  useEffect(() => {

    const addPayPalScript = async () => {
      const { data } = await axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };//eof addPayPalScript

    if (!order || successPay || (order && order?._id !== orderId)) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch(detailsOrder(orderId))
    } else {
      if (!order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
      }
    }
    return () => {

    }
  }, [dispatch, order, orderId, successPay]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(order, paymentResult));
  };

  const procesarPago = () => {

    const paymentResult = {
      id: " ",
      status: 'POR_CONFIRMAR',
      update_time: " ",
      email_address: order.user.email,
      banco: banco,
      referencia: referencia,
      fechaTransferencia: fechaTransfer,
    }
    dispatch(payOrder(order, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order._id));
    window.location.reload();
    window.location.reload();
  };

  const payconfirmHandler = () => {
    dispatch(payconfirmOrder(order._id));
    window.location.reload();
  };

  return loading ? (<LoadingBox></LoadingBox>)
    : error ? (<MessageBox variant="danger">{error}</MessageBox>)
      : (<div >
        {order.paymentResult.status === 'POR_CONFIRMAR' &&
          (<CheckoutSteps step1 step2 step3 step4 pagado={order.paymentResult.status === 'CONFIRMADO' ? 1 : 0}></CheckoutSteps>)
        }
        <div className="row top">
          <div className="col-2">
            <h1 className="left">Orden: {(order._id).substring(16)}</h1>
            <ul>
              <li>
                <div className="card-max card-body">
                  <strong>Direccion de envio</strong>
                  <p>
                    <strong>Nombre: </strong>{order.shippingAddress.fullName} <br />
                    <strong>Direccion: </strong>{order.shippingAddress.address}, <br />
                    {order.shippingAddress.city},{order.shippingAddress.country}, Apartado Postal:
                  {order.shippingAddress.postalCode}.
                </p>
                  {order.isDelivered ? <MessageBox variant="success">Entregado en fecha: {order.deliveredAt.substring(0, 10)}</MessageBox>
                    : <MessageBox variant="danger">Pedido Pendiente por Entregar</MessageBox>
                  }
                </div>
              </li>

              <li>
                <div className="card-max card-body">
                  <strong>Metodo de Pago</strong>
                  <div className="enFila left">
                    <strong> {order.paymentMethod} :</strong>
                    {order.isPaid && order.paymentResult.status === 'CONFIRMADO' ?
                      <MessageBox variant="success">Pagado - Transferencia Confirmada OK!</MessageBox>
                      : order.isPaid && order.paymentResult.status === 'POR_CONFIRMAR' ?
                        <MessageBox variant="success">Pagado ok (Transferencia por Confirmar)</MessageBox>
                        : <MessageBox variant="danger">Pendiente de Pago</MessageBox>
                    }
                  </div>
                  {!order.isPaid && order.paymentMethod !== "Efectivo-Cash" &&
                    (<div className="enFila w-500">
                      <div>
                        <input
                          id="referencia"
                          type="text"
                          placeholder="numero de referencia"
                          value={referencia}
                          onChange={(e) => setReferencia(e.target.value)}
                        ></input>
                      </div>
                      <div>
                        <select value={banco} id="selectBancos" placeholder="ingrese banco" onChange={(e) => setBanco(e.target.value)}>
                          {
                            dataBancos.map((x, inx) => (
                              <option key={inx} value={x}>{x}</option>
                            ))
                          }
                        </select>
                      </div>
                      <div>
                        <input
                          id="fechaTransfer"
                          type="date"
                          value={fechaTransfer}
                          onChange={(e) => setFechaTransfer(e.target.value)}
                        ></input>
                      </div>
                      <button className="primary" onClick={procesarPago}>pagar</button>
                    </div>)
                  }
                </div>
              </li>

              <li>
                <div className="card-max">
                  <strong>Articulos de este Pedido</strong>
                  <ul>
                    {
                      order.orderItems.map((item) => (
                        <li key={item.producto}>
                          <div className="row">
                            <div className="orderscreen_detalle">
                              <img className="small" src={item.imagen} alt={item.nombre}></img>
                              {' '}
                              <Link to={`/product/${item.producto}`}>{item.nombre}</Link>
                              {' '} {item.qty} x $ {item.precio} = ${(item.qty * item.precio).toFixed(2)}
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
            <div className="card card-body">
              <ul>
                <li>
                  <h1 className="grueso">Resumen Final</h1>
                </li>
                <li>
                  <div className="row">
                    <div> Articulos ({order.orderItems.reduce((a, c) => a + c.qty, 0)})</div>
                    <div>${order.itemsPrice.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="row">
                    <div>Envio</div>
                    <div>${order.shippingPrice.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="row">
                    <div>Impuestos</div>
                    <div>${order.taxPrice.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="row">
                    <div><strong>Total Global</strong></div>
                    <div><strong>${order.totalPrice.toFixed(2)}</strong></div>
                  </div>
                </li>
                {!order.isPaid && (
                  <li>
                    {!sdkReady ? (<LoadingBox></LoadingBox>) :
                      (
                        <>
                          {errorPay && (<MessageBox variant="danger">{errorPay}</MessageBox>)}
                          {loadingPay && (<LoadingBox></LoadingBox>)}
                          <PayPalButton
                            amount={order.totalPrice}
                            onSuccess={successPaymentHandler}>
                          </PayPalButton>
                        </>
                      )}
                  </li>

                )}
                <li>

                </li>
                {userInfo?.isAdmin && order.isPaid && !order.isDelivered && order.paymentResult.status === 'CONFIRMADO' && (
                  <li>
                    {loadingDeliver && <LoadingBox></LoadingBox>}
                    {errorDeliver && (
                      <MessageBox variant="danger">{errorDeliver}</MessageBox>
                    )}
                    <button
                      type="button"
                      className="primary block"
                      onClick={deliverHandler}
                    >
                      Marcar Pedido Entregado
                  </button>
                  </li>
                )}
                {userInfo?.isAdmin && order.isPaid && order.paymentResult.status !== 'CONFIRMADO' && (
                  <li>
                    {loadingPayconfirm && <LoadingBox></LoadingBox>}
                    {errorPayconfirm && (
                      <MessageBox variant="danger">{errorPayconfirm}</MessageBox>
                    )}
                    <button
                      type="button"
                      className="primary block"
                      onClick={payconfirmHandler}
                    >
                      Marcar Transferencia Confirmada
                  </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div >
      )
}
