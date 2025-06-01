import { createSlice } from "@reduxjs/toolkit";

const plannerSlice = createSlice({
    name: 'planner',
    initialState: {
        origin: null,
        destinations: [],
        optimalPath: [],
        loading: false,
        error: null,
    },
    reducers: {
        setOrigin(state, action) {
            state.origin = action.payload;
        },
        addDestination(state, action) {
            state.destinations.push(action.payload);
        },
        removeDestination(state, action) {
            state.destinations = state.destinations.filter((_, i) => i !== action.payload);
        },
        clearDestinations(state) {
            state.destinations = [];
        },
        requestOptimalPath(state) {
            state.loading = true;
            state.error = null;
        },
        setOptimalPath(state, action) {
            state.optimalPath = action.payload;
            state.loading = false;
        },
        setError(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
    }
})

export const plannerActions = plannerSlice.actions;
export const plannerReducer = plannerSlice.reducer;