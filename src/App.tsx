import React from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators, ReducerState } from "./state";

function App() {
  const dispatch = useDispatch();
  const amount = useSelector((state: ReducerState) => state.bank);

  const { depositMoney, withdrawMoney, bankrupt } = bindActionCreators(
    actionCreators,
    dispatch
  );

  return (
    <div className="app">
      <h1>{amount}</h1>
      <div>
        <button onClick={() => depositMoney(100)}>Deposit</button>
        <button onClick={() => withdrawMoney(100)}>Withdraw</button>
        <button onClick={() => bankrupt()}>Bankrupt</button>
      </div>
    </div>
  );
}

export default App;
