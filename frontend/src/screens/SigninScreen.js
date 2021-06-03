import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { signin } from '../actions/userActions'
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function SigninScreen(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo, loading, error } = userSignin;
  const redirect = props.location.search ? props.location.search.split("=")[1] : "/";
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signin(email, password));
  }

  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [props.history, redirect, userInfo]);

  return (
    <div>
      <CheckoutSteps step1></CheckoutSteps>
      <form className="form" onSubmit={submitHandler}>
        <div className="form-title">
          <h1 className="grueso">Sesion de Usuario</h1>
        </div>
        {loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email" id="email"
            required
            placeholder="escribe tu email si ya te registraste"
            onChange={e => setEmail(e.target.value)}>
          </input>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password" id="password"
            placeholder="introduce tu clave"
            required
            onChange={e => setPassword(e.target.value)}>
          </input>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">Iniciar Sesion</button>
        </div>
        <div>
          <label />
          <div className="form-registrate">
            No tienes Cuenta? {' '}
            <Link to={`/register?redirect=${redirect}`}>Registrate aqui!</Link>
          </div>
        </div>
      </form>
    </div>
  )
}
