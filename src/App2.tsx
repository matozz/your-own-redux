import React, { useEffect, useState } from "react";
import "./App.css";
// import { useDispatch, useSelector } from "react-redux";
// import { createStore } from "redux";
import {
  createStore,
  combineReducers,
  applyMiddleware,
} from "./customRedux/myRedux";
import logger from "./customRedux/logger";
import thunk from "./customRedux/thunk";

const initMilkState = {
  milk: 0,
};

function milkReducer(state = initMilkState, action: any) {
  switch (action.type) {
    case "PUT_MILK":
      return { ...state, milk: state.milk + 1 };
    case "TAKE_MILK":
      return { ...state, milk: state.milk - 1 };
    default:
      return state;
  }
}

const initRiceState = {
  rice: 0,
};

function riceReducer(state = initRiceState, action: any) {
  switch (action.type) {
    case "PUT_RICE":
      return { ...state, rice: state.rice + 1 };
    case "TAKE_RICE":
      return { ...state, rice: state.rice - 1 };
    case "BIG_RICE":
      return { ...state, rice: state.rice + action.payload };
    default:
      return state;
  }
}

let reducer = combineReducers({
  milkState: milkReducer,
  riceState: riceReducer,
});

let store = createStore(reducer, applyMiddleware(thunk, logger));

function App() {
  const [milk, setMilk] = useState(0);
  const [rice, setRice] = useState(0);

  useEffect(() => {
    store.subscribe(() => setMilk(store.getState().milkState.milk));
  }, []);

  useEffect(() => {
    store.subscribe(() => setRice(store.getState().riceState.rice));
  }, []);

  const handleBigRice = (amount: number) => {
    return (dispatch: any) => {
      dispatch({
        type: "BIG_RICE",
        payload: amount,
      });
    };
  };

  return (
    <div className="app">
      <h1>{milk}</h1>
      <div>
        <button onClick={() => store.dispatch({ type: "PUT_MILK" })}>
          PUT_MILK
        </button>
        <button onClick={() => store.dispatch({ type: "TAKE_MILK" })}>
          TAKE_MILK
        </button>
      </div>
      <h1>{rice}</h1>
      <div>
        <button onClick={() => store.dispatch({ type: "PUT_RICE" })}>
          PUT_RICE
        </button>
        <button onClick={() => store.dispatch({ type: "TAKE_RICE" })}>
          TAKE_RICE
        </button>
        <button onClick={() => store.dispatch(handleBigRice(5000))}>
          A BIG BOWL OF RICE
        </button>
      </div>
    </div>
  );
}

export default App;
