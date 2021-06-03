import axios from "axios";
import {
  CONFIG_DOLARTODAY_FAIL, CONFIG_DOLARTODAY_REQUEST, CONFIG_DOLARTODAY_SUCCESS, CONFIG_UPDATE_REQUEST, CONFIG_UPDATE_SUCCESS,
  CONFIG_UPDATE_FAIL, CONFIG_DETAILS_REQUEST, CONFIG_DETAILS_SUCCESS, CONFIG_DETAILS_FAIL,
} from "../constants/configConstants";

export const detailsConfig = () => async (dispatch, getState) => {
  dispatch({ type: CONFIG_DETAILS_REQUEST });
  const { userSignin: { userInfo }, } = getState();
  try {
    const { data } = await axios.get('/api/appconfig', {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: CONFIG_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: CONFIG_DETAILS_FAIL, payload: message });
  }
};

export const updateConfig = (config) => async (dispatch, getState) => {
  dispatch({ type: CONFIG_UPDATE_REQUEST, payload: config });
  const { userSignin: { userInfo }, } = getState();
  try {
    const { data } = await axios.put('/api/appconfig/update', config, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: CONFIG_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: CONFIG_UPDATE_FAIL, error: message });
  }
};









/* export const listConfig = () => async (dispatch, getState) => {
  dispatch({ type: CONFIG_LIST_REQUEST });
  const { userSignin: { userInfo }, } = getState();
  try {
    const { data } = await axios.get('/api/appconfig', {
      headers: { Authorization: `Bearer ${userInfo.token}`, },
    });
    console.log("actions config data", data);
    dispatch({ type: CONFIG_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CONFIG_LIST_FAIL, payload: error.message });
  }
} */






































export const fetchDolarToday = () => async (dispatch, getState) => {
  dispatch({ type: CONFIG_DOLARTODAY_REQUEST });
  try {
    const data = {
      USD: {
        dolarToday: 2000000,
      },
      _timestamp: {
        fecha: Date()
      },
    }
    //const { data } = await axios.get('https://s3.amazonaws.com/dolartoday/data.json');
    dispatch({
      type: CONFIG_DOLARTODAY_SUCCESS,
      payload: {
        cambioDia: data.USD.dolarToday,
        fecha: data._timestamp.fecha
      }
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: CONFIG_DOLARTODAY_FAIL, payload: message });
  }
};



























/* export const fetchDolarBcv = () => async (dispatch, getState) => {
  dispatch({ type: CONFIG_DOLARBCV_REQUEST });
  try {
    const { data } = await axios.get('https://s3.amazonaws.com/dolartoday/data.json');
    dispatch({
      type: CONFIG_DOLARBCV_SUCCESS,
      payload: {
        cambioDia: data.USD.dolartoday,
        fecha: data._timestamp.fecha
      }
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: CONFIG_DOLARBCV_FAIL, payload: message });
  }
}; */