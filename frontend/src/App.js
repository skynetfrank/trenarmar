import { BrowserRouter, Route, Link } from 'react-router-dom';
import ProductScreen from './screens/ProductScreen';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import { useDispatch, useSelector } from 'react-redux';
import SigninScreen from './screens/SigninScreen';
import { signout } from './actions/userActions';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import Contacto from './Contacto';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import PrivateRoute from './components/PrivateRoute';
import ProductListScreen from './screens/ProductListScreen';
import AdminRoute from './components/AdminRoute';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import Dashboard from './screens/Dashboard';


function App() {
  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();

  const signoutHandler = () => {
    dispatch(signout());
  }

  const gotoRedes = (e) => {
    switch (e.target.id) {
      case "twitter":
        window.open('https://twitter.com/dolartoday', '_blank');
        break
      case "facebook":
        window.open('https://www.facebook.com/trenarmar2014/', '_blank');
        break
      case "instagram":
        window.open('https://www.instagram.com/trenarmar2014/', '_blank');
        break
      default:
        console.log("default break!!");
        break;
    }
  }

  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div className="div-brand">
            <img src="images/logo2.png" alt="logo" id="logo" />
            <Link className="brand" to="/">TRENARMAR 2014</Link>
          </div>
          <div className="header-menu">
            <Link to="/"><i className="fa fa-cubes"></i><span className="span-hide"> Productos</span></Link>
            <Link to="/cart"><i className="fa fa-shopping-cart"></i> <span className="carrito-hide">Carrito{cartItems.length > 0
              && (<span className="badge">{cartItems.length}</span>)}</span></Link>
            {
              userInfo ? (
                <div className="dropdown">
                  <Link to="#"><i className="fa fa-user"></i>{' '}{userInfo.name}<i className="fa fa-caret-down"></i></Link>
                  <ul className="dropdown-content">
                    <li>
                      <Link to="/profile">Mi Perfil</Link>
                    </li>
                    <li>
                      <Link to="/orderhistory">Mis Ordenes</Link>
                    </li>
                    <li>
                      <Link to="/" onClick={signoutHandler}>cerrar sesion</Link>
                    </li>
                  </ul>
                </div>)
                :
                (<Link to="/signin"><i className="fa fa-user"></i><span className="span-hide"> Mi cuenta</span></Link>)
            }
            {userInfo && userInfo.isAdmin && (
              <Link to="/dashboard"><i className="fa fa-cogs"></i><span className="span-hide"> Admin</span></Link>
            )}
           
          </div>
        </header>
        <main>
          <Route path="/cart/:id?" component={CartScreen}></Route>
          <Route path="/contacto" component={Contacto}></Route>
          <Route path="/product/:id" component={ProductScreen} exact></Route>
          <Route path="/product/:id/edit" component={ProductEditScreen} exact></Route>
          <Route path="/signin" component={SigninScreen}></Route>
          <Route path="/register" component={RegisterScreen}></Route>
          <Route path="/shipping" component={ShippingAddressScreen}></Route>
          <Route path="/payment" component={PaymentMethodScreen}></Route>
          <Route path="/placeorder" component={PlaceOrderScreen}></Route>
          <Route path="/order/:id" component={OrderScreen}></Route>
          <Route path="/orderhistory" component={OrderHistoryScreen} exact></Route>
          <Route path="/orderhistory/pageNumber/:pageNumber" component={OrderHistoryScreen} exact></Route>
          <AdminRoute path="/productlist" component={ProductListScreen} exact></AdminRoute>
          <AdminRoute path="/productlist/pageNumber/:pageNumber" component={ProductListScreen} exact></AdminRoute>
          <PrivateRoute path="/profile" component={ProfileScreen}></PrivateRoute>
          <AdminRoute path="/orderlist" component={OrderListScreen} exact></AdminRoute>
          <AdminRoute path="/orderlist/pageNumber/:pageNumber" component={OrderListScreen} exact></AdminRoute>
          <AdminRoute path="/userlist" component={UserListScreen}></AdminRoute>
          <AdminRoute path="/user/:id/edit" component={UserEditScreen}></AdminRoute>
          <AdminRoute path="/dashboard" component={Dashboard}></AdminRoute>
          <AdminRoute path="/config" component={Dashboard}></AdminRoute>
          <Route path="/pageNumber/:pageNumber" component={HomeScreen} exact></Route>
          <Route path="/" component={HomeScreen} exact></Route>
        </main>
        <footer className="row center">
          <div className="redes-container">
            <div className="redes__div">
              <input className="redes_input" type="text" name="" placeholder="@trenarmar2014" readOnly></input>
              <img className="rs-icon" onClick={(e) => gotoRedes(e)} id="instagram" src="/info/instagram.png" alt=""></img>
            </div>
            <div className="redes__div">
              <input className="redes_input" type="text" name="" placeholder="+58 424-1608030" readOnly></input>
              <span className="rs-icon"><img id="wassap2" src="/info/wassap.png" alt=""></img></span>
            </div>
            <div className="redes__div">
              <input className="redes_input" type="text" name="" placeholder="trenarmar2014" readOnly></input>
              <span className="rs-icon"><img onClick={(e) => gotoRedes(e)} id="facebook" src="/info/facebook.png" alt=""></img></span>
            </div>
            <div className="redes__div">
              <input className="redes_input" type="text" name="" placeholder="+58 0424-1608030" readOnly></input>
              <span className="rs-icon"><img id="twiter" src="/info/phone.png" alt=""></img></span>
            </div>
            <div className="redes__div">
              <input className="redes_input" type="text" name="" placeholder="contactanos" readOnly></input>
              <span className="rs-icon"><Link to="/Contacto"><img onClick={(e) => gotoRedes(e)} id="contactanos" src="/info/mail-icon.png" alt=""></img></Link></span>
            </div>
          </div>

        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
