import './App.css'
import React, { useEffect } from 'react'
import HomePage from './views/homepage/HomePage'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter } from "react-router-dom"
import { Provider } from 'react-redux'
import { store } from './store/store'
import { useTranslation } from 'react-i18next'
import './localization/translations'
import 'moment/locale/hu'

function App() {

  const { i18n } = useTranslation()
  const languages = ['en', 'hu']

  useEffect(() => {
    const browserLanguage = navigator.language || navigator.userLanguage 
    i18n.changeLanguage(languages.includes(browserLanguage) ? browserLanguage : 'en')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
