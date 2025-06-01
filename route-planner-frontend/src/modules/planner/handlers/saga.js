import { call, put, takeEvery } from 'redux-saga/effects';
import { plannerActions } from './redux';
import { plannerApis } from './apis';

function* getOptimalPathSaga(action) {
    try {
        const { origin, destinations, mode = 'driving-car' } = action.payload;
        
        // Preparar datos para el backend
        const requestData = {
            origin: {
                lat: origin.lat,
                lng: origin.lng
            },
            destinations: destinations.map(dest => ({
                lat: dest.lat,
                lng: dest.lng,
                ...(dest.name && { name: dest.name }) // Incluir nombre si existe
            })),
            mode
        };

        // Llamar al endpoint del backend
        const response = yield call(plannerApis().calculateOptimalRoute, requestData);
        
        // Construir el path completo (origen + destinos ordenados)
        const fullPath = [
            { ...origin, order: 0 }, 
            ...response.data.ordered_destinations.map((dest, index) => ({
                ...dest,
                order: index + 1
            }))
        ];

        yield put(plannerActions.setOptimalPath({
            path: fullPath,
            ...response.data
        }));
        
    } catch (error) {
        const errorMessage = error.response?.data?.error || "Error al calcular la ruta óptima";
        yield put(plannerActions.setError(errorMessage));
    }
}

// Nueva saga para obtener rutas guardadas
function* getSavedRoutesSaga() {
    try {
        const response = yield call(plannerApis().getRoutes);
        yield put(plannerActions.setSavedRoutes(response.data));
    } catch (error) {
        yield put(plannerActions.setError("Error al obtener rutas guardadas"));
    }
}

// Nueva saga para guardar rutas
function* saveRouteSaga(action) {
    try {
        const { origin, destinations, optimalPath, routeInfo } = action.payload;
        const routeData = {
            name: `Ruta ${new Date().toLocaleString()}`,
            origin,
            destinations,
            optimal_path: optimalPath,
            total_distance: routeInfo.totalDistance,
            total_duration: routeInfo.totalDuration
        };
        
        yield call(plannerApis().saveCalculatedRoute, routeData);
        yield call(getSavedRoutesSaga); // Actualizar lista de rutas
    } catch (error) {
        yield put(plannerActions.setError("Error al guardar la ruta"));
    }
}

export function* plannerSagas() {
    yield takeEvery(plannerActions.requestOptimalPath.type, getOptimalPathSaga);
    // Puedes agregar más sagas aquí según necesites
}