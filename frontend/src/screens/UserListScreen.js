import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, listUsers } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_DETAILS_RESET } from '../constants/userConstants';
import { Link } from 'react-router-dom';

export default function UserListScreen(props) {
  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userDelete = useSelector((state) => state.userDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = userDelete;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listUsers());
    dispatch({
      type: USER_DETAILS_RESET,
    });
  }, [dispatch, successDelete]);
  const deleteHandler = (user) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteUser(user._id));
    }
  };
  return (
    <div>
      <h1 className="left">Usuarios</h1>
      <div className="div-link">
        <Link to="/dashboard">...regresar</Link>
      </div>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {successDelete && (
        <MessageBox variant="success">Usuario eliminado exitosamente</MessageBox>
      )}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table" id="userListTable">
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Cedula</th>
              <th>Email registrado</th>
              <th>Es Vendedor?</th>
              <th>Es Admin?</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.codigo}</td>
                <td>{user.name}</td>
                <td>{user.apellido}</td>
                <td>{user.cedula}</td>
                <td>{user.email}</td>
                <td>{user.isSeller ? 'SI' : 'NO'}</td>
                <td>{user.isAdmin ? 'SI' : 'NO'}</td>

                <td>
                  <button
                    type="button"
                    className="small success"
                    onClick={() => props.history.push(`/user/${user._id}/edit`)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="small danger"
                    onClick={() => deleteHandler(user)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
