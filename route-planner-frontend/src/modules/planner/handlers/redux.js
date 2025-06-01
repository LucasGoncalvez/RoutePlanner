import { createSlice } from "@reduxjs/toolkit";

const plannerSlice = createSlice({
    name: 'planner',
    initialState: {
        origin: null,
        destinations: [],
        optimalPath: [],
        loading: false,
        error: null,
        routeInfo: null, // Nuevo campo para almacenar info de la ruta
        savedRoutes: [], // Nuevo campo para rutas guardadas
    },
    reducers: {
        setOrigin(state, action) {
            state.origin = action.payload;
            state.optimalPath = []; // Resetear ruta al cambiar origen
            state.routeInfo = null;
        },
        addDestination(state, action) {
            state.destinations.push(action.payload);
            state.optimalPath = []; // Resetear ruta al agregar destino
            state.routeInfo = null;
        },
        removeDestination(state, action) {
            state.destinations = state.destinations.filter((_, i) => i !== action.payload);
            state.optimalPath = []; // Resetear ruta al quitar destino
            state.routeInfo = null;
        },
        clearDestinations(state) {
            state.destinations = [];
            state.optimalPath = [];
            state.routeInfo = null;
        },
        requestOptimalPath(state, { payload }) {
            state.loading = true;
            state.error = null;
        },
        setOptimalPath(state, action) {
            state.optimalPath = action.payload.path;
            state.routeInfo = {
                totalDistance: action.payload.total_distance_km,
                totalDuration: action.payload.total_estimated_duration_minutes
            };
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
        // Nuevo reducer para rutas guardadas
        setSavedRoutes(state, action) {
            state.savedRoutes = action.payload;
        },
        // Nuevo reducer para limpiar ruta actual
        clearCurrentRoute(state) {
            state.origin = null;
            state.destinations = [];
            state.optimalPath = [];
            state.routeInfo = null;
        }
    }
})

export const plannerActions = plannerSlice.actions;
export const plannerReducer = plannerSlice.reducer;