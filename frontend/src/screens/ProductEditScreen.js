import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { detailsProduct, updateProduct } from '../actions/productsActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { PRODUCT_UPDATE_RESET } from '../constants/productsConstants';
import { Link } from 'react-router-dom';

export default function ProductEditScreen(props) {
  const productId = props.match.params.id;
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [categoria, setCategoria] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [marca, setMarca] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen2, setImagen2] = useState('');

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, producto } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate, } = productUpdate;

  const dispatch = useDispatch();

  useEffect(() => {
    if (successUpdate) {
      props.history.push('/productlist');
    }

    if (!producto || producto._id !== productId || successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      dispatch(detailsProduct(productId));
    } else {
      setNombre(producto.nombre);
      setPrecio(producto.precio);
      setImagen(producto.imagen);
      setCategoria(producto.categoria);
      setCountInStock(producto.countInStock);
      setMarca(producto.marca);
      setDescripcion(producto.descripcion);
    }
  }, [producto, dispatch, productId, successUpdate, props.history]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({ _id: productId, nombre, precio, imagen, categoria, marca, countInStock, descripcion, }));
  };
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState('');
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;



  //Cargar una imagen ya sea para un nuevo producto o para editar un producto con imagen ya asignada
  const uploadFileHandler = async (e) => {

    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    setLoadingUpload(true);
    try {
      const { data } = await Axios.post('/api/uploads', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      console.log("ProductEditScreen: /api/uploads =>>: data recibida", data);
      setImagen(data);
      setLoadingUpload(false);
    } catch (error) {
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };



  useEffect(() => {
    setImagen2(producto?.imagen);
    console.log("useEffect==>:   setImagen2(producto?.imagen)");
  }, [producto?.imagen]);


  return (
    <div>
      <div className="div-link">
        <Link to="/productlist">volver a productos (admin)</Link>
      </div>
      <div className="prod-edit-screen-title">
        <h2>Editar Producto: {productId}</h2>
      </div>

      <div className="row top spaceAround">
        <div>
          <h2 className="center">Imagen Actual del Producto</h2>
          <img className="large" src={producto?.imagen} alt={producto?.imagen} />
        </div>
        <form className="form prod-edit-screen" onSubmit={submitHandler}>
          {loadingUpdate && <LoadingBox></LoadingBox>}
          {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <div>
                <label htmlFor="nombre">Nombre Unico (no se admiten duplicados)</label>
                <input
                  id="nombre"
                  type="text"
                  placeholder="ingrese un nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                ></input>
              </div>

              <div className="div-block">
                <label htmlFor="precio">Precio $: </label>
                <input
                  id="precio"
                  type="text"
                  placeholder="use punto como separador decimal"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                ></input>
                <label htmlFor="countInStock">Cantidad: </label>
                <input
                  id="countInStock"
                  type="text"
                  placeholder="ingrese el numero de unidades en existencia"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                ></input>
              </div>









              <div>
                <input
                  id="imagen"
                  type="text"
                  value={imagen}
                  onChange={(e) => setImagen(e.target.value)}

                ></input>
              </div>

              <div>
                <label htmlFor="imageFile">Asociar una imagen con este producto</label>
                <input
                  type="file"
                  id="imageFile"
                  onChange={uploadFileHandler}>
                </input>
                {loadingUpload && <LoadingBox></LoadingBox>}
                {errorUpload && (
                  <MessageBox variant="danger">{errorUpload}</MessageBox>
                )}
              </div>










              <div className="div-block">
                <label htmlFor="category">Categoria: </label>
                <input
                  id="categoria"
                  type="text"
                  placeholder="ingrese una categoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                ></input>
              </div>
              <div className="div-block">
                <label htmlFor="brand">Marca: </label>
                <input
                  id="marca"
                  type="text"
                  placeholder="ingrese una marca si aplica"
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                ></input>
              </div>

              <div>

                <textarea
                  id="descripcion"
                  rows="3"
                  type="text"
                  placeholder="ingrese una breve descripcion del producto"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label></label>
                <button className="primary" type="submit">
                  Actualizar Datos
              </button>
              </div>
            </>
          )}
        </form>
        <div>
          <h2 className="center">Nueva Imagen Selecionada</h2>
          <img className="large" src={imagen === imagen2 ? '/images/p999.jpg' : imagen} alt="nueva-Imagen" />
        </div>
      </div>
    </div>
  );
}
