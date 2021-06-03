import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { listOrderMine } from '../actions/orderActions';
import { useParams } from 'react-router';
import Paginator from '../components/Paginator';

export default function OrderHistoryScreen(props) {
  const { pageNumber = 1 } = useParams();
  const [busqueda, setBusqueda] = useState('');
  const orderMineList = useSelector((state) => state.orderMineList);
  const { loading, error, orders, page, pages } = orderMineList;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();

  useEffect(() => {
    if (busqueda === '') {
      dispatch(listOrderMine({ pageNumber: pageNumber }))
    }
  }, [busqueda, dispatch, pageNumber]);

  const busquedaHandler = (e) => {
    const filteredOrder = orders.filter((orderItem) => orderItem._id.substring(16) === e);
    dispatch(listOrderMine({ pageNumber: pageNumber, orderid: filteredOrder.length > 0 ? filteredOrder[0]._id : '' }));
  }




  return (
    <div>
      <div className="enFila aside">
        <h1>Mis Ordenes - {userInfo?.name}</h1>
        <h2>{userInfo?.email}</h2>
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
      {loading ? <LoadingBox></LoadingBox> :
        error ? <MessageBox variant="danger" > {error}</MessageBox> :
          (
            <>
              <table className="table" id="orderHistoryTable">
                <thead>
                  <tr>
                    <th>Numero</th>
                    <th>Fecha</th>
                    <th>Total Bs.</th>
                    <th>Pagada?</th>
                    <th>Entregada?</th>
                    <th>Transferencia realizada</th>
                    <th>Banco</th>
                    <th>Referencia</th>
                    <th>Status de la Transferencia</th>

                    <th>Ver</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id.substring(16)}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{order.totalPrice.toFixed(2)}</td>
                      <td>{order.isPaid ? order.paidAt.substring(0, 10) : "NO"}</td>
                      <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : "NO"}</td>
                      <td>{(order.paymentResult?.fechaTransferencia)?.substring(0, 10)}</td>
                      <td>{order.paymentResult?.banco}</td>
                      <td>{order.paymentResult?.referencia}</td>
                      <td>{order.paymentResult?.status}</td>
                      <td>
                        <button type="button"
                          className="small circle"
                          onClick={() => { props.history.push(`/order/${order._id}`) }}>
                          ver
                      </button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Paginator page={page} pages={pages} apiurl='/orderhistory'></ Paginator>
            </>
          )
      }
    </div >
  )
}
