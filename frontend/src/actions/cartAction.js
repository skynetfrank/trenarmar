import axios from "axios";
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING_ADDRESS, CART_SAVE_PAYMENT_METHOD }
  from "../constants/cartConstants";

export const addToCart = (productoId, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/productos/${productoId}`);
  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      nombre: data.nombre,
      imagen: data.imagen,
      precio: data.precio,
      countInStock: data.countInStock,
      producto: data._id,
      qty,
    }
  })
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (productoId) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: productoId
  });
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });
  localStorage.setItem('shippingAddress', JSON.stringify(data));
}

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });
}