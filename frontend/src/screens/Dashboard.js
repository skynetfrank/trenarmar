import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsConfig, updateConfig } from '../actions/configActions';
import Sidebar from '../components/Sidebar';
import { CONFIG_UPDATE_RESET } from '../constants/configConstants';

export default function Dashboard(props) {
  const configDetails = useSelector((state) => state.configDetails);
  const { loading, error, config } = configDetails;
  const configUpdate = useSelector((state) => state.configUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate, } = configUpdate;

  const [cambioManual, setCambioManual] = useState('');
  const [tasaIva, setTasaIva] = useState('');
  const [otrosImp, setOtrosImp] = useState('');
  const [mostrarBs, setMostrarBs] = useState(false);
  const [mostrarBcv, setMostrarBcv] = useState(false);
  const [montoEnvio, setMontoEnvio] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: CONFIG_UPDATE_RESET });
      dispatch(detailsConfig());
      props.history.push('/');
    }
    if (!config) {
      dispatch(detailsConfig());
    } else {
      setCambioManual(config.cambioManual);
      setTasaIva(config.tasaIva);
      setOtrosImp(config.otrosImp);
      setMostrarBs(config.mostrarBs);
      setMostrarBcv(config.mostrarBcv);
      setMontoEnvio(config.montoEnvio);
    }
  }, [config, dispatch, props.history, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateConfig({ cambioManual, tasaIva, otrosImp, mostrarBs, mostrarBcv, montoEnvio }));
  };

  return (
    <div className="dashboard">
      <div className="sidebar-container">
        <Sidebar></Sidebar>
      </div>
      <div className="config-div">
        <form className="form" onSubmit={submitHandler}>
          <div className="form-title">
            <h1 className="grueso">Configuracion</h1>
            {loadingUpdate && <LoadingBox></LoadingBox>}
            {errorUpdate && (
              <MessageBox variant="danger">{errorUpdate}</MessageBox>
            )}
          </div>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <div className="div-center">
                <label htmlFor="cambioManual">Cambio$ manual</label>
                <input
                  id="cambioManual"
                  type="text"
                  placeholder="ingrese cambio del dia manual"
                  value={cambioManual || ''}
                  onChange={(e) => setCambioManual(e.target.value)}
                ></input>
              </div>
              <div className="div-center">
                <label htmlFor="tasaIva">Tasa I.V.A.</label>
                <input
                  id="tasaIva"
                  type="text"
                  value={tasaIva || ''}
                  onChange={(e) => setTasaIva(e.target.value)}
                ></input>
              </div>
              <div className="div-center">
                <label htmlFor="montoEnvio">Monto por envio</label>
                <input
                  id="montoEnvio"
                  type="text"
                  value={montoEnvio || ''}
                  onChange={(e) => setMontoEnvio(e.target.value)}
                ></input>
              </div>
              <div style={{ display: "block" }}>

                <input
                  id="mostrarBs"
                  type="checkbox"
                  checked={mostrarBs || ''}
                  onChange={(e) => setMostrarBs(e.target.checked)}
                ></input>
                <label htmlFor="mostrarBs">Mostrar Precios en Bolivares</label>
              </div>
              <div style={{ display: "block" }}>

                <input
                  id="mostrarBcv"
                  type="checkbox"
                  checked={mostrarBcv || ''}
                  onChange={(e) => setMostrarBcv(e.target.checked)}
                ></input>
                <label htmlFor="mostrarBcv">Mostrar Precios al cambio BCV</label>
              </div>

              <div>
                <button type="submit" className="primary">
                  Actualizar
              </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
