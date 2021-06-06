import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartAction';
import CheckoutSteps from '../components/CheckoutSteps'

export default function ShippingAddressScreen(props) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  if (!userInfo) {
    props.history.push('/signin');
  }

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [fullName, setFullName] = useState(shippingAddress.fullName);
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [country, setCountry] = useState(shippingAddress.country);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const dispatch = useDispatch();


  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddress({ fullName, address, city, postalCode, country }))
    props.history.push('/payment');
  }

  return (
    <>

   
      <div>
        <CheckoutSteps step1 step2></CheckoutSteps>
        <div className="div-clientes">
          <select id="select-clientes" name="">
          <option value="terquimca">Terquimca</option>
            <option value="terquimca">Cliente2</option>
          </select>
        </div>
        <form className="form" onSubmit={submitHandler}>
          <div className="form-title">
            <h1 className="grueso">Direccion de Envio</h1>
          </div>
          <div>
            <label htmlFor="fullName">Nombre Completo</label>
            <input type="text"
              id="fullName"
              placeholder="Ingrese su nombre completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required>
            </input>
          </div>
          <div>
            <label htmlFor="address">Direccion de Entrega</label>
            <input type="text"
              id="address"
              placeholder="Ingrese su direccion"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required>
            </input>
          </div>
          <div>
            <label htmlFor="city">Ciudad</label>
            <input type="text"
              id="city"
              placeholder="Ingrese la ciudad"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required>
            </input>
          </div>
          <div>
            <label htmlFor="postalCode">Codigo Postal</label>
            <input type="text"
              id="postalCode"
              placeholder="Ingrese un codigo postal"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required>
            </input>
          </div>
          <div>
            <label htmlFor="country">Pais</label>
            <input type="text"
              id="country"
              placeholder="Ingrese el pais"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required>
            </input>
          </div>
          <div>
            <label />
            <button className="primary" type="submit">Continuar...</button>
          </div>
        </form>
      </div>
    </>)
}
