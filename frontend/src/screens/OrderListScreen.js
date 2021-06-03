import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { deleteOrder, listOrders } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELETE_RESET } from '../constants/orderConstants';
import Paginator from '../components/Paginator';
import { Link } from 'react-router-dom';

export default function OrderListScreen(props) {
  const { pageNumber = 1 } = useParams();
  const [busqueda, setBusqueda] = useState('');
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders, page, pages } = orderList;
  const orderDelete = useSelector((state) => state.orderDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = orderDelete;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const [filtro, setFiltro] = useState('')
  const dispatch = useDispatch();

  const filterHandler = (user) => {
    setFiltro(user);
  }



  useEffect(() => {
    dispatch({ type: ORDER_DELETE_RESET });
    dispatch(listOrders({ pageNumber: pageNumber, filtro: filtro }));
  }, [dispatch, filtro, pageNumber, successDelete]);

  const deleteHandler = (order) => {
    if (order.paymentResult.status === 'CONFIRMADO' || order.isDelivered) {
      alert('El pago de esta orden ya ha sido confirmado! No se puede Eliminar. Verifique!!')
      return
    }
    if (window.confirm('Esta seguro que desea Eliminar esta Orden?')) {
      dispatch(deleteOrder(order._id));
    }
  };

  const busquedaHandler = (e) => {
    console.log("e:", e);
    const filteredOrder = orders.filter((orderItem) => orderItem._id.substring(16) === e);
    console.log("filteredOrder:", filteredOrder);
    dispatch(listOrders({ pageNumber: pageNumber, orderid: filteredOrder.length > 0 ? filteredOrder[0]._id : '' }));
  }

  return (
    <div>
      <div className="enFila aside">
        <h2>Ordenes de Compra - Administrador: {userInfo?.name} </h2>
        <h2>{userInfo.email}</h2>
      </div>
      <div className="search-div">
        <input type="text"
          value={busqueda}
          className="search-input"
          placeholder="buscar orden (id)"
          onChange={(e) => setBusqueda(e.target.value)}
        >
        </input>
        <span>
          <i className="fa fa-search"
            onClick={() => busquedaHandler(busqueda)}>
          </i>
        </span>
      </div>
      <div className="div-link">
        <Link to="/dashboard">...volver al Dashboard</Link>
      </div>

      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {loading ? (<LoadingBox></LoadingBox>)
        : error ? (<MessageBox variant="danger">{error}</MessageBox>)
          : (
            <>
              <table className="table" id="orderListTable">
                <thead>
                  <tr>
                    <th>ID-Orden</th>
                    <th>Usuario</th>
                    <th>Fecha</th>
                    <th>Total Bs.</th>
                    <th>Pagada?</th>
                    <th>Entregada?</th>
                    <th>Transferencia en Fecha</th>
                    <th>Banco</th>
                    <th>Referencia</th>
                    <th>Status Transferencia</th>
                    <th>accion</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id.substring(16)}</td>
                      <td onClick={() => filterHandler(order.user._id)}>{order.user?.name}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{order.totalPrice.toFixed(2)}</td>
                      <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                      <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}</td>
                      <td>{(order.paymentResult?.fechaTransferencia)?.substring(0, 10)}</td>
                      <td>{order.paymentResult?.banco}</td>
                      <td>{order.paymentResult?.referencia}</td>
                      <td>{order.paymentResult?.status}</td>
                      <td>
                        <button
                          type="button"
                          className="small success circle"
                          onClick={() => {
                            props.history.push(`/order/${order._id}`);
                          }}
                        >
                          ver
                  </button>
                        {order.paymentResult?.status === 'POR_CONFIRMAR' &&
                          <button
                            type="button"
                            className="small danger circle"
                            onClick={() => deleteHandler(order)}
                          >
                            X
                  </button>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Paginator page={page} pages={pages} apiurl='/orderlist'></ Paginator>
            </>
          )}
    </div>
  );
}
