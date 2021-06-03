import {
  CONFIG_DOLARTODAY_FAIL, CONFIG_DOLARTODAY_REQUEST, CONFIG_DOLARTODAY_SUCCESS,
  CONFIG_DOLARBCV_REQUEST, CONFIG_DOLARBCV_SUCCESS, CONFIG_DOLARBCV_FAIL,
  CONFIG_UPDATE_REQUEST, CONFIG_UPDATE_SUCCESS, CONFIG_UPDATE_FAIL, CONFIG_UPDATE_RESET,
  CONFIG_DETAILS_REQUEST, CONFIG_DETAILS_SUCCESS, CONFIG_DETAILS_FAIL, CONFIG_DETAILS_RESET
} from "../constants/configConstants";


export const configDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case CONFIG_DETAILS_REQUEST:
      return { loading: true };
    case CONFIG_DETAILS_SUCCESS:
      return { loading: false, config: action.payload };
    case CONFIG_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case CONFIG_DETAILS_RESET:
      return { loading: true };
    default:
      return state;
  }
};


export const configUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case CONFIG_UPDATE_REQUEST:
      return { loading: true };
    case CONFIG_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case CONFIG_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case CONFIG_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};


export const dolarTodayReducer = (state = {}, action) => {
  switch (action.type) {
    case CONFIG_DOLARTODAY_REQUEST:
      return { loading: true };
    case CONFIG_DOLARTODAY_SUCCESS:
      return { loading: false, dolarToday: action.payload };
    case CONFIG_DOLARTODAY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const dolarBcvReducer = (state = {}, action) => {
  switch (action.type) {
    case CONFIG_DOLARBCV_REQUEST:
      return { loading: true };
    case CONFIG_DOLARBCV_SUCCESS:
      return { loading: false, dolarBcv: action.payload };
    case CONFIG_DOLARBCV_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};