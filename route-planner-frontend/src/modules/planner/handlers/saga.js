import { call, put, takeEvery } from 'redux-saga/effects';
import { plannerActions } from './redux';

// Simula un llamado al backend (podés reemplazar esto por un fetch real)
function fetchOptimalPathApi(data) {
    // Acá podrías usar fetch() o axios
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                path: [data.origin, ...data.destinations, data.origin]
            });
        }, 1000);
    });
}

function* getOptimalPathSaga(action) {
    try {
        const data = action.payload;
        const response = yield call(fetchOptimalPathApi, data);
        yield put(plannerActions.setOptimalPath(response.path));
    } catch (error) {
        yield put(plannerActions.setError("Error al obtener la ruta óptima"));
    }
}

export function* plannerSagas() {
    yield takeEvery(plannerActions.requestOptimalPath.type, getOptimalPathSaga);
}
