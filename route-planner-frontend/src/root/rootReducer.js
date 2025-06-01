import { createRouterReducer } from "@lagunovsky/redux-react-router";
import { plannerReducer } from "src/modules/planner/handlers/redux";

export const rootReducer = (history) => ({
    router: createRouterReducer(history),
    planner: plannerReducer,
})