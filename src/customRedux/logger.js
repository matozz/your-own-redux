const logger =
  ({ getState }) =>
  (next) =>
  (action) => {
    console.group(action.type);
    console.info("Dispatching", action);
    let result = next(action);
    console.log("Next state", getState());
    console.groupEnd();
    return result;
  };

export default logger;
