import { createSlice } from "@reduxjs/toolkit";

const plannerSlice = createSlice({
    name: 'planner',
    initialState: {
        routes: []
    },
    reducers: {
        addRoute: (state, { payload }) => {
            state.routes.push(payload);
        }
    }
})

export const plannerActions = plannerSlice.actions;
export const plannerReducer = plannerSlice.reducer;