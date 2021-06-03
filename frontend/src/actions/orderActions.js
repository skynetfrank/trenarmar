import axios from "axios";
import {
  ORDER_CREATE_FAIL, ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS, ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_FAIL, ORDER_DETAILS_SUCCESS, ORDER_MINE_LIST_REQUEST, ORDER_MINE_LIST_FAIL,
  ORDER_MINE_LIST_SUCCESS, ORDER_DELETE_REQUEST, ORDER_DELETE_SUCCESS, ORDER_DELETE_FAIL,
  ORDER_DELIVER_REQUEST, ORDER_DELIVER_SUCCESS, ORDER_DELIVER_FAIL, ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS, ORDER_LIST_FAIL, ORDER_PAYCONFIRM_REQUEST, ORDER_PAYCONFIRM_SUCCESS,
  ORDER_PAYCONFIRM_FAIL, ORDER_PAY_FAIL, ORDER_PAY_REQUEST, ORDER_PAY_SUCCESS
} from "../constants/orderConstants"
import { CART_EMPTY } from '../constants/cartConstants';



export const listOrders = ({ pageNumber = '', filtro = '', orderid = '' }) => async (dispatch, getState) => {
  dispatch({ type: ORDER_LIST_REQUEST });
  const { userSignin: { userInfo } } = getState();
  try {
    const { data } = await axios.get(`/api/orders?user=${filtro}&pageNumber=${pageNumber}&orderid=${orderid}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_LIST_SUCCESS, payload: data });
    console.log("listOrders action data recibida:", data);
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: ORDER_LIST_FAIL, payload: message });
  }
};


export const listOrderMine = ({ pageNumber = '', orderid = '' }) => async (dispatch, getState) => {
  dispatch({
    type: ORDER_MINE_LIST_REQUEST
  })
  const { userSignin: { userInfo }, } = getState();
  try {
    const { data } = await axios.get(`/api/orders/mine?pageNumber=${pageNumber}&orderid=${orderid}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` }
    });
    dispatch({ type: ORDER_MINE_LIST_SUCCESS, payload: data });

  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: ORDER_MINE_LIST_FAIL, payload: message });
  }
};

//getState retorna toda la redux store y se puede destructurar
export const createOrder = (order) => async (dispatch, getState) => {




  console.log("create order action=> order parama:", order);
  dispatch({ type: ORDER_CREATE_REQUEST, payload: order });
  try {
    const { userSignin: { userInfo }, } = getState();
    console.log("userInfo:", userInfo);

    const { data } = await axios.post('/api/orders', order, {
      headers: { Authorization: `Bearer ${userInfo.token}`, },
    });
    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.order });
    dispatch({ type: CART_EMPTY });
    localStorage.removeItem('cartItems');
    console.log("data._id", data);
    var dataEmail = {
      service_id: 'service_ehpi6v9',
      template_id: 'template_b3rdkf5',
      user_id: 'user_rV8QRiqSHPrul084aSGPh',
      template_params: {
        'from_name': userInfo.name,
        'from_email': userInfo.email,
        'message': data.order._id
      }

    };

    axios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: 'https://api.emailjs.com/api/v1.0/email/send',
      data: JSON.stringify(dataEmail),
    }).then(result => console.log("axios ok")).catch(error => console.log("axios Error", error));



  } catch (error) {
    const message = error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
    dispatch({ type: ORDER_CREATE_FAIL, payload: message, });
  }
};


export const detailsOrder = (orderId) => async (dispatch, getState) => {

  dispatch({ type: ORDER_DETAILS_REQUEST, payload: orderId })
  const { userSignin: { userInfo } } = getState();
  try {
    const { data } = await axios.get(`/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` }
    });
    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });

  } catch (error) {
    const message = error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
    dispatch({ type: ORDER_DETAILS_FAIL, payload: message })
  }
};


export const payOrder = (order, paymentResult) => async (dispatch, getState) => {
  dispatch({ type: ORDER_PAY_REQUEST, payload: { order, paymentResult } });
  const {
    userSignin: { userInfo }, } = getState();
  try {
    const { data } = axios.put(`/api/orders/${order._id}/pay`, paymentResult, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: ORDER_PAY_FAIL, payload: message });
  }
};


export const deleteOrder = (orderId) => async (dispatch, getState) => {
  dispatch({ type: ORDER_DELETE_REQUEST, payload: orderId });
  const { userSignin: { userInfo }, } = getState();
  try {
    const { data } = axios.delete(`/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_DELETE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: ORDER_DELETE_FAIL, payload: message });
  }
};

export const deliverOrder = (orderId) => async (dispatch, getState) => {
  dispatch({ type: ORDER_DELIVER_REQUEST, payload: orderId });
  const { userSignin: { userInfo }, } = getState();
  try {
    const { data } = axios.put(`/api/orders/${orderId}/deliver`, {},
      { headers: { Authorization: `Bearer ${userInfo.token}` }, }
    );
    dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: ORDER_DELIVER_FAIL, payload: message });
  }
};

export const payconfirmOrder = (orderId) => async (dispatch, getState) => {
  dispatch({ type: ORDER_PAYCONFIRM_REQUEST, payload: orderId });
  const { userSignin: { userInfo }, } = getState();
  try {
    const { data } = axios.put(`/api/orders/${orderId}/payconfirm`, {},
      { headers: { Authorization: `Bearer ${userInfo.token}` }, }
    );
    dispatch({ type: ORDER_PAYCONFIRM_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: ORDER_PAYCONFIRM_FAIL, payload: message });
  }
};


