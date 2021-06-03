import React from 'react'

export default function CheckoutSteps(props) {
  return (
    <div className="row checkout-steps">

      <div className={props.step1 ? "active" : ''}>
        <span className="badge steps">1</span>
              Inicia Sesion
       <i className={props.step2 ? "fa fa-check" : ''}></i>
      </div>

      <div className={props.step2 ? "active" : ''}>
        <span className="badge steps">2</span>
              Pedido
       <i className={props.step3 ? "fa fa-check" : ''}></i>
      </div>

      <div className={props.step3 ? "active" : ''}>
       <span className="badge steps">3</span>
             Comprar
       <i className={props.step4 ? "fa fa-check" : ''}></i>
      </div>

      <div className={props.step4 ? "active" : ''}>
        <span className="badge steps">4</span>
          Pagar
       <i className={props.pagado===1 ? "fa fa-check" : ''}></i>
      </div>
    </div>
  )
}
