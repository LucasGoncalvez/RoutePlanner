import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { plannerActions } from '../handlers/redux';

const RoutePlanner = () => {
    const dispatch = useDispatch();

    const { routes } = useSelector(state => state.planner);

    useEffect(() => {
        console.log(routes);
    }, [routes])

    return (
        <>
            <div>RoutePlanner</div>
            <button onClick={() => dispatch(plannerActions.addRoute({ id: 1, name: "Ruta 1" }))}>Cargar ruta</button>
        </>
    )
}

export default RoutePlanner