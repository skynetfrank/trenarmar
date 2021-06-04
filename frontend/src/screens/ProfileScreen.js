import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUserProfile } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';


export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [apellido, setApellido] = useState('');
  const [cedula, setCedula] = useState('');
  const [codigo, setCodigo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerLogo, setSellerLogo] = useState('');
  const [sellerDescription, setSellerDescription] = useState('');

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const {
    success: successUpdate,
    error: errorUpdate,
    loading: loadingUpdate,
  } = userUpdateProfile;
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      dispatch(detailsUser(userInfo._id));
    } else {
      setName(user.name);
      setEmail(user.email);
      setApellido(user.apellido);
      setCedula(user.cedula);
      setCodigo(user.codigo);
      if (user.seller) {
        setSellerName(user.seller.name);
        setSellerLogo(user.seller.logo);
        setSellerDescription(user.seller.description);
      }
    }
  }, [dispatch, userInfo._id, user]);
  const submitHandler = (e) => {
    e.preventDefault();
    // dispatch update profile
    if (password !== confirmPassword) {
      alert('La Clave de confirmacion no coincide');
    } else {
      dispatch(
        updateUserProfile({
          userId: user._id,
          name,
          email,
          apellido,
          cedula,
          codigo,
          password,
          sellerName,
          sellerLogo,
          sellerDescription,
        })
      );
    }
  };
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div className="form-title">
          <h1 className="grueso">Perfil de Usuario</h1>
        </div>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            {loadingUpdate && <LoadingBox></LoadingBox>}
            {errorUpdate && (
              <MessageBox variant="danger">{errorUpdate}</MessageBox>
            )}
            {successUpdate && (
              <MessageBox variant="success">
                Se ha actualizado tu Perfil exitosamente!
              </MessageBox>
            )}
            <div>
              <label htmlFor="codigo">Codigo</label>
              <input
                id="codigoUsuario"
                type="text"
                placeholder="Codigo asignado"
                value={codigo}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
                <div>
                  <label htmlFor="apellido">Apellido</label>
                  <input
                    id="apellido"
                    type="text"
                    placeholder="Introduce tu apellido"
                    value={apellido}
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                </div>
                <div>
                  <label htmlFor="cedula">Cedula</label>
                  <input
                    id="cedula"
                    type="text"
                    placeholder="Introduce tu cedula"
                    value={cedula}
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Introduce tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
           
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Introduce tu clave"
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="confirmPassword">confirma tu Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirma tu clave"
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></input>
            </div>
                        <div>
              <label />
              <button className="primary" type="submit">
                Actualizar
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
