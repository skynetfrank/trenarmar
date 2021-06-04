import React, { useEffect, useState } from 'react'
import Producto from '../components/Producto';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useSelector, useDispatch } from 'react-redux';
import { listProducts } from '../actions/productsActions';
import { useParams } from 'react-router';
import Paginator from '../components/Paginator';

function HomeScreen() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList)
  const { loading, error, productos, page, pages } = productList;
  const [busqueda, setBusqueda] = useState('');
  const { pageNumber = 1 } = useParams();

  useEffect(() => {
    if (busqueda === '') {
      dispatch(listProducts({ pageNumber: pageNumber }));
    }
  }, [busqueda, dispatch, pageNumber]);

  const busquedaHandler = (e) => {
    dispatch(listProducts({ pageNumber: pageNumber, nombre: busqueda }));
  }

  return (
    <div>
      {loading ? (<LoadingBox></LoadingBox>) : error ? (<MessageBox variant="danger">{error}</MessageBox>)
        : (
          <>
            <div className="search-div">
              <h1 className="left right">Nuestros Productos</h1>
              <input type="text"
                value={busqueda}
                className="search-input"
                placeholder="buscar producto"
                onChange={(e) => setBusqueda(e.target.value)}
              >
              </input>
              <span>
                <i className="fa fa-search"
                  onClick={() => busquedaHandler(busqueda)}>
                </i>
              </span>
            </div>
            {productos.length === 0 && <MessageBox>Producto No Encontrado!</MessageBox>}
            <div className="row center">
              {productos.map((product) => (
                <Producto key={product._id} producto={product}></Producto>
              ))}
            </ div>
          </>
        )}
      <Paginator page={page} pages={pages} apiurl=''></Paginator>
    </div>
  )
}

export default HomeScreen
