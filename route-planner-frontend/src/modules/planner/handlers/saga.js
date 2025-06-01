import { call, put, takeEvery } from 'redux-saga/effects';
import { plannerActions } from './redux';
import { plannerApis } from './apis';

function* getOptimalPathSaga({ payload }) {
    try {
        const data = yield call(plannerApis().calculateOptimalRoute, payload);
        yield put(plannerActions.setOptimalPath(data));
    } catch (error) {
        const errorMessage = error.status === 400 ? error.response.data.error : "Error inesperado al calcular la ruta óptima";
        yield put(plannerActions.setError(errorMessage));
    } finally {
        yield put(plannerActions.setLoading(false));
    }
}

export function* plannerSagas() {
    yield takeEvery(plannerActions.requestOptimalPath.type, getOptimalPathSaga);
}