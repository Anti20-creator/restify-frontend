import './App.css';

import HomePage from './views/homepage/HomePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter
} from "react-router-dom";
import { Provider } from 'react-redux'
import { store } from './store/store'

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className={"wrapper d-flex flex-column h-100"}>
          <HomePage />
          <ToastContainer 
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
