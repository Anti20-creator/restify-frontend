import './App.css';

import HomePage from './views/homepage/HomePage';
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify';
import {
  BrowserRouter
} from "react-router-dom";
import { Provider } from 'react-redux'
import { store } from './store/store'
import { createSocket } from './communication/socket'

function App() {

  useEffect(() => {
    const socket = createSocket(store)
  }, [])

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className={"wrapper d-flex flex-column h-100"}>
          <HomePage />
          <ToastContainer />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
