import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import { plannerRoutes } from 'src/modules/planner/handlers/routes'

const routes = [
    ...plannerRoutes,
]

const RootRoutes = () => {
    return (
        <Routes>
            {/* Redirección desde raíz. */}
            <Route path="/" element={<Navigate to="/route-planner" replace />} />

            {routes.map((route, idx) => (
                <Route key={idx} {...route} />
            ))}
        </Routes>
    );
};

export default RootRoutes;