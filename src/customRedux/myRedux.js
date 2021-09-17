export function createStore(reducer, enhancer) {
  // 先处理enhancer
  // 如果enhancer存在并且是函数
  // 我们将createStore作为参数传给他
  // 他应该返回一个新的createStore给我
  // 我再拿这个新的createStore执行，应该得到一个store
  // 直接返回这个store就行
  if (enhancer && typeof enhancer === "function") {
    const newCreateStore = enhancer(createStore);
    const newStore = newCreateStore(reducer);
    return newStore;
  }

  let state;
  let listeners = []; // store all the subscribe listeners

  // run all the listeners callback when dispatching
  function dispatch(action) {
    // use reducer to update the state
    state = reducer(state, action);

    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  // subscribe to the change of the state
  function subscribe(callback) {
    listeners.push(callback);
  }

  // return the state
  function getState() {
    return state;
  }

  const store = {
    subscribe,
    dispatch,
    getState,
  };

  return store;
}

export function combineReducers(reducerMap) {
  const reducerKeys = Object.keys(reducerMap);
  const reducer = (state = {}, action) => {
    let newState = {};

    for (const key of reducerKeys) {
      const currentReducer = reducerMap[key];
      const prevState = state[key];
      // loop all the reducers and try to dispatch the action
      // Note that all the reducers will be triggered, so do not use the same action name across the reducers !!!
      newState[key] = currentReducer(prevState, action);
    }

    return newState;
  };

  return reducer;
}

// export function applyMiddleware(middleware) {
//   // applyMiddleware的返回值应该是一个enhancer
//   // 按照我们前面说的enhancer的参数是createStore
//   function enhancer(createStore) {
//     // enhancer应该返回一个新的createStore
//     function newCreateStore(reducer) {
//       const store = createStore(reducer);

//       // 将middleware拿过来执行下，传入store
//       // 得到第一层函数
//       const func = middleware(store);

//       // 将原始的dispatch函数传给func执行 -> next()
//       // 得到增强版的dispatch
//       const newDispatch = func(store.dispatch);
//       console.log(newDispatch);
//       // 返回的时候用增强版的newDispatch替换原始的dispatch
//       return { ...store, dispatch: newDispatch };
//     }

//     return newCreateStore;
//   }

//   return enhancer;
// }

export function applyMiddleware(...middlewares) {
  // applyMiddleware的返回值应该是一个enhancer
  // 按照我们前面说的enhancer的参数是createStore
  function enhancer(createStore) {
    // enhancer应该返回一个新的createStore
    function newCreateStore(reducer) {
      const store = createStore(reducer);

      // 多个middleware，先解构出dispatch => newDispatch的结构
      const chain = middlewares.map((middleware) => middleware(store));
      const { dispatch } = store;

      // 用compose得到一个组合了所有newDispatch的函数
      const newDispatchGen = compose(...chain);

      // 执行这个函数得到newDispatch
      const newDispatch = newDispatchGen(dispatch);

      return { ...store, dispatch: newDispatch };
    }

    return newCreateStore;
  }

  return enhancer;
}

function compose(...funcs) {
  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}
