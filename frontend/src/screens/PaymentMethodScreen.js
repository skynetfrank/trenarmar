import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../actions/cartAction';
import CheckoutSteps from '../components/CheckoutSteps'

export default function PaymentMethodScreen(props) {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress.address) {
    props.history.push('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('Transferencia');
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    props.history.push('/placeorder');
  }

  const onRadioChange = (e) => {
    setPaymentMethod(e);
  }

  return (
    <div>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <form className="form" onSubmit={submitHandler}>
        <div className="form-title">
          <h1 className="grueso">Metodo de Pago</h1>
        </div>
        <div>
          <div>
            <input type="radio" id="transfer" value="Transferencia" name="paymentMethod" required
              onChange={(e) => onRadioChange(e.target.value)}
            ></input>
            <label htmlFor="transfer">Transferencia Bancaria</label>
          </div>
        </div>
        <div>
          <div>
            <input type="radio" id="transfer" value="Efectivo-Cash" name="paymentMethod" required
              onChange={(e) => onRadioChange(e.target.value)}
            ></input>
            <label htmlFor="transfer">Efectivo (cash$)</label>
          </div>
        </div>
        <div>
          <button className="primary" type="submit">Continuar...</button>
        </div>
      </form>
    </div>
  )
}
