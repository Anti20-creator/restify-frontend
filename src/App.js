import './App.css';
import React from 'react'
import HomePage from './views/homepage/HomePage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter
} from "react-router-dom";
import { Provider } from 'react-redux'
import { store } from './store/store'

function Example(){
  const toastId = React.useRef(null);

  const notify = () => {
    toastId.current = toast.info("Registering...", { autoClose: false });
  }

  const update = () => {
    setTimeout(() => {
      toast.update(toastId.current, { render: "Team registered!", type: "success", isLoading: false, autoClose: 2000 });
    }, 100)
  }

  return (
    <div>
      <button onClick={notify}>Notify</button>
      <button onClick={update}>Update</button>
    </div>
  );
}

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className={"wrapper d-flex flex-column h-100"}>
          <HomePage />
          <ToastContainer 
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            draggable
            position={"bottom-center"}
            pauseOnHover />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
