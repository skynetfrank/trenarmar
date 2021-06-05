import React, { useEffect } from 'react'
import { addToCart, removeFromCart } from '../actions/cartAction';
import { useDispatch, useSelector } from 'react-redux';
import MessageBox from '../components/MessageBox';
import { Link } from 'react-router-dom';

export default function CartScreen(props) {
  const productoId = props.match.params.id
  const qty = props.location.search ? Number(props.location.search.split('=')[1]) : 1;
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const dispatch = useDispatch();

  useEffect(() => {
    if (productoId) {
      dispatch(addToCart(productoId, qty));
    }
  }, [dispatch, productoId, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    props.history.push('/signin?redirect=shipping');
  };

  return (
    <div className="row top">
      <div className="col-2">
        <h1 className="right">Carrito de Compras</h1>
        {cartItems.length === 0 ? <MessageBox>
          El Carrito esta vacio. <Link to="/">Ir a Productos</Link>
        </MessageBox>
          :
          (<ul>
            {
              cartItems.map((item) => (
                <li className="li-divisorio" key={item.producto}>
                  <div className="row">
                    <div>
                      <img className="small" src={item.imagen} alt={item.nombre}></img>
                    </div>

                    <div className="row col-2 item-responsive">
                      <div className="min-30">
                        <Link to={`/product/${item.producto}`}>{item.nombre}</Link>
                      </div>
                      <div>
                        <select value={item.qty} onChange={e => dispatch(addToCart(item.producto, Number(e.target.value)))}>
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>{x + 1}</option>))
                          }
                        </select>
                      </div>
                      <div>
                        ${item.precio.toFixed(2)}
                      </div>
                      <div>
                        <button type="button" onClick={() => removeFromCartHandler(item.producto)}>
                          Eliminar
                      </button>
                      </div>

                    </div>


                  </div>
                </li>))
            }
          </ul>)
        }
      </div>
      <div className="col-1 responsive">
        <div className="card card-body small">
          <ul>
            <li>
              <h1 className="grueso">Pedido - Resumen</h1>
              <p><strong> Cantidad de articulos: ({cartItems.reduce((a, c) => a + c.qty, 0)})</strong></p>
              <p><strong>Total a Pagar:   ${cartItems.reduce((a, c) => a + c.precio * c.qty, 0).toFixed(2)}</strong></p>

            </li>
            <li>
              <button type="button"
                onClick={checkoutHandler}
                className="primary block tall"
                disabled={cartItems.length === 0}>
                Hacer Pedido
                <i className="fa fa-shopping-bag fa-lg"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
