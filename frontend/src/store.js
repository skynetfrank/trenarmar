import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { cartReducer } from './reducers/cartReducers';
import { configDetailsReducer, configUpdateReducer, dolarBcvReducer, dolarTodayReducer } from './reducers/configReducers';
import {
  orderCreateReducer, orderDeleteReducer, orderDeliverReducer, orderDetailsReducer,
  orderListReducer, orderMineListReducer, orderPayconfirmReducer, orderPayReducer
}
  from './reducers/orderReducers';
import {
  productCreateReducer, productDeleteReducer, productDetailsReducer, productsListReducer,
  productUpdateReducer
} from './reducers/productsReducer'
import {
  userDeleteReducer, userDetailsReducer, userListReducer, userRegisterReducer,
  userSigninReducer, userUpdateProfileReducer, userUpdateReducer
} from './reducers/userReducers';

const initialState = {
  userSignin: {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
  },
  cart: {
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    paymentMethod: 'Transferencia',
  },
  dolarToday: {
    cambioDia: 2000,
    fecha: Date(),
  },
  dolarBcv: {},
};

const reducer = combineReducers({
  productList: productsListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  userSignin: userSigninReducer,
  userRegister: userRegisterReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderMineList: orderMineListReducer,
  orderDelete: orderDeleteReducer,
  orderDeliver: orderDeliverReducer,
  orderList: orderListReducer,
  orderPayconfirm: orderPayconfirmReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productDelete: productDeleteReducer,
  userUpdate: userUpdateReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  dolarToday: dolarTodayReducer,
  dolarBcv: dolarBcvReducer,
  configDetails: configDetailsReducer,
  configUpdate: configUpdateReducer,
})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));

export default store;