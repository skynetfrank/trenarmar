import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { register } from '../actions/userActions'
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function RegisterScreen(props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirPassword, setConfirmPassword] = useState('');

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, loading, error } = userRegister;
  const redirect = props.location.search ? props.location.search.split("=")[1] : "/";
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirPassword) {
      alert("La clave de confirmacion no coincide!... verifica")
    } else {
      dispatch(register(name, email, password));
    }
  }

  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [props.history, redirect, userInfo]);

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div className="form-title">
          <h1 className="grueso">Crear Cuenta</h1>
        </div>
        {loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        <div>
          <label htmlFor="name">Nombre</label>
          <input
            type="text" id="name"
            required
            placeholder="escribe tu nombre de usuario"
            onChange={e => setName(e.target.value)}>
          </input>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email" id="email"
            required
            placeholder="escribe tu email"
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
          <label htmlFor="confirmPassword">Confirma tu Password</label>
          <input
            type="password" id="confirmPassword"
            placeholder="vuelve a introducir tu clave"
            required
            onChange={e => setConfirmPassword(e.target.value)}>
          </input>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">Registrarse</button>
        </div>
        <div>
          <label />
          <div className="form-registrate">
            Ya tienes una cuenta? {' '}
            <Link to={`/signin?redirect=${redirect}`}>Inicia Sesion!</Link>
          </div>
        </div>

      </form>

    </div>
  )
}
