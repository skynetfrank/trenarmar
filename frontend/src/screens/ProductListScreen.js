import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { createProduct, deleteProduct, listProducts, }
  from '../actions/productsActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Paginator from '../components/Paginator';
import {
  PRODUCT_CREATE_RESET, PRODUCT_DELETE_RESET,
} from '../constants/productsConstants';

export default function ProductListScreen(props) {
  const { pageNumber = 1 } = useParams();
  const productList = useSelector((state) => state.productList);
  const { loading, error, productos, page, pages } = productList;
  const productCreate = useSelector((state) => state.productCreate);

  const { loading: loadingCreate, error: errorCreate, success: successCreate,
    product: createdProduct, } = productCreate;

  const productDelete = useSelector((state) => state.productDelete);

  const { loading: loadingDelete, error: errorDelete, success: successDelete, } = productDelete;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();

  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      //ojo: si un producto fue creado con exito, aqui se manda PRoductEditScreen
      //para que los datos por defectos asignados en el servidor sean modificados 
      //con datos reales y se le asocie una nueva imagen real que refleje el producto 
      //y sustituya a la imagen por defecto P0 asignada en el servidor.
      props.history.push(`/product/${createdProduct._id}/edit`);
    }
    if (successDelete) {
      dispatch({ type: PRODUCT_DELETE_RESET });
    }

    dispatch(
      listProducts({ pageNumber: pageNumber })
    );
  }, [createdProduct, dispatch, props.history, successCreate, successDelete, userInfo._id, pageNumber,]);

  const deleteHandler = (product) => {
    if (window.confirm('Esta seguro que desea Eliminar este producto?')) {
      dispatch(deleteProduct(product._id));
    }
  };

  const createHandler = () => {
    dispatch(createProduct());
  };

  return (
    <div>
      <div className="row alternative">
        <h1 className="left">Administrar Productos</h1>
        <button type="button" className="primary" onClick={createHandler}>
          Agregar Nuevo Producto
        </button>
      </div>
      <div className="div-link">
        <Link to="/dashboard">...volver al Dashboard</Link>
      </div>

      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}

      {loadingCreate && <LoadingBox></LoadingBox>}
      {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID-Producto</th>
                <th>Nombre del Producto (unico)</th>
                <th>Precio Bs.</th>
                <th>-- Categoria --</th>
                <th>Marca</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((product) => (
                <tr key={product._id}>
                  <td className="td-id">{product._id.substr(-8)}</td>
                  <td>{product.nombre}</td>
                  <td>{product.precio.toFixed(2)}</td>
                  <td>{product.categoria}</td>
                  <td>{product.marca}</td>
                  <td>
                    <button type="button" className="small success"
                      onClick={() => props.history.push(`/product/${product._id}/edit`)}>
                      Modificar
                    </button>
                    <button type="button" className="small danger"
                      onClick={() => deleteHandler(product)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Paginator page={page} pages={pages} apiurl='/productlist'></ Paginator>
        </>
      )}
    </div>
  );
}
