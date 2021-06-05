import React, { useEffect, useState } from 'react';
import Rating from '../components/Rating';
import { useSelector, useDispatch } from 'react-redux';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsProduct } from '../actions/productsActions';

function ProductScreen(props) {
  const productDetails = useSelector(state => state.productDetails);
  const { loading, error, producto } = productDetails;
  const productoId = props.match.params.id
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(detailsProduct(productoId));
  }, [dispatch, productoId]);

  const addToCartHandler = () => {
    props.history.push(`/cart/${productoId}?qty=${qty}`);
  }

  return (
    <div>
      {loading ? (<LoadingBox></LoadingBox>)
        : error ? (<MessageBox variant="danger">{error}</MessageBox>)
          :
          (<div>
            <div className="row top">
              <div className="col-1 top imagen">
                <img className="large" src={producto.imagen} alt={producto.imagen} />
              </div>
              <div className="col-1 top">
                <ul>
                  <li>
                    <h1 id="titulo-nombre">{producto.nombre}</h1>
                  </li>
                  <li>
                    <strong>Precio:</strong> ${producto.precio.toFixed(2)} por {producto.presentacion}
                  </li>
                  <li>
                    <strong>Descripcion:</strong>{producto.descripcion}
                   
                  </li>
                  <li>
                    <div>
                      {producto.countInStock > 0 ?
                        (<span className="success">Disponibles: {producto.countInStock} unidades</span>)
                        : (<span className="error">NO disponible</span>)
                      }
                    </div>
                  </li>
                </ul>
              </div>
              <div className="col-1 top">
                <div className="card card-body small">
                  <ul>
                    <li>
                      <h1 className="grueso">Producto</h1>
                    </li>
                    <li>
                      <div className="row">
                        <div>Precio</div>
                        <div className="price">${producto.precio.toFixed(2)}</div>
                      </div>
                    </li>

                    {
                      producto.countInStock > 0 && (
                        <>
                          <li>
                            <div className="row">
                              <div>Cantidad a Comprar</div>
                              <div>
                                <select value={qty} onChange={e => setQty(e.target.value)}>
                                  {
                                    [...Array(producto.countInStock).keys()].map((x) => (
                                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                                    ))
                                  }
                                </select>
                              </div>
                            </div>
                          </li>
                          <li>
                            <button className="primary block top tall"
                              onClick={addToCartHandler}>Agregar al Carrito
                              <i className="fa fa-cart-plus fa-lg"></i></button>
                          </li>
                        </>
                      )
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
          )}
    </div>
  )
}

export default ProductScreen
