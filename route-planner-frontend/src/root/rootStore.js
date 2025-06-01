import { createRouterMiddleware } from "@lagunovsky/redux-react-router";
import { configureStore } from "@reduxjs/toolkit";
import { createBrowserHistory } from "history";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "src/root/rootReducer";
import { rootSagas } from "src/root/rootSagas";


export const browserHistory = createBrowserHistory();

const routerMiddleware = createRouterMiddleware(browserHistory);
let sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: rootReducer(browserHistory),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: false,
            serializableCheck: false,
        }).concat(routerMiddleware, sagaMiddleware),
});

sagaMiddleware.run(rootSagas);

export const rootStore = store;