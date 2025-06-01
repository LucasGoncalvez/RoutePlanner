import { call, put, takeEvery } from 'redux-saga/effects';
import { plannerActions } from "./redux";

function* addRouteSaga() {
    try {
        console.log("addRouteSaga");
    } catch (error) {
        console.log(error);
    }
}

export function* plannerSagas() {
    yield takeEvery(plannerActions.addRoute.type, addRouteSaga);
} 