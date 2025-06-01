import React from 'react'
import './App.css';
import { Provider } from 'react-redux';
import { ReduxRouter } from '@lagunovsky/redux-react-router';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { browserHistory, rootStore } from './root/rootStore';
import AppPage from 'src/modules/app/pages/AppPage';

function App() {
  return (
    <Provider store={rootStore}>
      <ReduxRouter history={browserHistory} store={rootStore}>
        <Routes>
          <Route path={"/*"} element={<AppPage />} />
        </Routes>
      </ReduxRouter>
      <ToastContainer />
    </Provider>
  );
}

export default App;
