import { all } from "redux-saga/effects";
import { plannerSagas } from "src/modules/planner/handlers/saga";

export function* rootSagas() {
    yield all([
        plannerSagas(),
    ]);
}