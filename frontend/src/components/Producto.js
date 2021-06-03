import React from 'react';
import Rating from './Rating';
import { Link } from 'react-router-dom';

function Producto(props) {
  const { producto } = props;

  return (
    <div key={producto._id} className="card producto">
      <Link to={`/product/${producto._id}`}>
        <img className="medium" src={producto.imagen} alt={producto.nombre} />
      </Link>
      <div className="card-body">
        <Link to={`/product/${producto._id}`}>
          <h2>{producto.nombre}</h2>
        </Link>
        <div className="price">
          <Rating rating={producto.rating} numReviews={producto.numReviews}></Rating>
          {'$' + (producto.precio).toFixed(2)}
        </div>
      </div>
    </div>
  )
}

export default Producto
