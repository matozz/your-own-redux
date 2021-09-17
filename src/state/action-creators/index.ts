import { ActionType } from "../action-types";
import { Dispatch } from "redux";
import { Action } from "../actions";

// Create custom action-creators
export const depositMoney = (amount: number) => {
  return (dispatch: Dispatch<Action>) => {
    // fetch("https://api.github.com/emojis") // 数据从github的公共开放接口获取
    //   .then((res) => res.json())
    //   .then((emojis) => console.log(emojis));
    dispatch({
      type: ActionType.DEPOSIT,
      payload: amount,
    });
  };
};

export const withdrawMoney = (amount: number) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.WITHDRAW,
      payload: amount,
    });
  };
};

export const bankrupt = () => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.BANKRUPT,
    });
  };
};
