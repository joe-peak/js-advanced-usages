## Redux
### 定义
Redux是一种javascript状态管理器，可为应用提供可预测的状态管理
### 三大原则
* 单一状态树
* state只可读
* 只能通过纯函数来执行修改
### Redux数据流程
![](https://img2018.cnblogs.com/blog/1195455/201906/1195455-20190628152442899-801098301.gif)

### 中间件(Middleware)
中间件提供的是位于action被发起之后，到达reducer之前的扩展点

记录日志中间件(示例)
```js
const Logger = store => next => action => {
  console.log('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};
```
崩溃报告中间件(示例)
```js
const CrashLogger = store => next => action => {
  try {
    return next(action);
  } catch(err) {
      console.error('捕获一个异常!', err)
      Raven.captureException(err, {
        extra: {
          action,
          state: store.getState()
        }
      })
      throw err
  }
}
```
promise中间件
```js
const promiseMiddleWare = store => next => action => {
  // check if the `payload` property is a promise, and, if so, wait for it to resolve
  if (action.payload && typeof action.payload.then ===  'function') {
    action.payload.then(res => {
      action.payload = res;
      next(action);
    }, err => {
      action.err = err;
       next(action);
    });
  }
  // no-op if the `payload` property is not a promise
  return next(action);
}
```
```js
ReduxThunk中间件
const Thunk = store => next => action =>  typeof action === 'function' ? action(store.dispatch, store.getState) : next(action);
```

中间件调用函数applyMiddleWare简单实现
```js
const applyMiddleWare = (store, middleWares) => {
  middleWares = middleWares.slice();
  middleWares.reverse();
  let dispatch = store.dispatch;
  middleWares.forEach(middleWare => {
    dispatch = middleWare(store, dispatch);
  });
  return Object.assign({}, store, { dispatch });
}
```
然后是将它们引用到 Redux store 中：
```js
import { createStore, applyMiddleWare, combineReducers } from 'redux';

const todoApp = combineReducers(reducers);
let store = createStore(todoApp, applyMiddleWare());
```

compose方法
```js
const compose = (...funcs) => {
  if (funcs.length === 0) {
    return args => args;
  }

  if (funcs.length === 1) {
    return funcs[0]();
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```
Redux中applyMiddleWare函数的实现
```js
const applyMiddleWare = middlewares => createStore => (...args) => {
  const store = createStore(...args);
  let dispatch = () => {
    throw new Error('Dispatching while constructing your middleware is not allowed. ' +
'Other middleware would not be applied to this dispatch.');
  }
  const middleWareAPI = {
    getState: store.getState,
    dispatch,
  };
  const chains = middlewares.map(middleware => middleware(middleWareAPI));
  dispatch = compose(...chains)(store.dispatch);
  return {
    ...store,
    dispatch,
  }
};
```
一个简单的reducer辅助函数
```js
const createReducer = (state, handles) => (state, action) => {
  if (handles.hasOwnProperty(action.type)) {
    return handles[action.type](state, action);
  }
  return state;
}
```
使用示例
```js
const todo = createReducer([], {
  [ActionTypes.ADD_TODO]: (state, action) => {
    const text = action.text.trim()
    return [...state, text]
  },
  [ActionTypes.REMOVE_TODO]: (state, action) => {
    ...
    ...
    // const text = action.text.trim()
    // return [...state, text]
  },
});
```

