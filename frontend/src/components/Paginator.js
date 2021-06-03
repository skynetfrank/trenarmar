import React from 'react'
import { Link } from 'react-router-dom'

export default function Paginator(props) {
  const { page, pages, apiurl } = props;
  return (
    <div>
      <div className="row center pagination">
        {[...Array(pages).keys()].map((x) => (
          <Link className={x + 1 === page ? 'active' : ''}
            key={x + 1}
            to={`${apiurl}/pageNumber/${x + 1}`}>
            {x + 1}
          </Link>
        ))}
      </div>
    </div>
  )
}
