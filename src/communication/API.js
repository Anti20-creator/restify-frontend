import axios from 'axios'

axios.defaults.withCredentials = true

const API = axios.create({
    baseURL: 'https://192.168.31.214:4000',
    header: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    responseType: 'json'
})

API.interceptors.response.use(
    null,

    async error => {
      /* refresh token and retry request once more on 401
         else log user out
      */
      const {config: originalReq, response} = error
      console.log(originalReq.url)
      // originalReq.url !== 'auth/jwt/refresh/' && 
      if (originalReq.url !== 'api/users/refresh-token' && !originalReq.isRetryAttempt && response && response.status === 401) {
        try {
            await refreshAccessToken()
            originalReq.isRetryAttempt = true
            return API.request(originalReq)
        } catch (e) {
            // log user out if fail to refresh (due to expired or missing token) or persistent 401 errors from original requests
            if (e.response && e.response.status === 401) {
                console.log(e)
            }
            // suppress original error to throw the new one to get new information
            throw e
        }
      } else {
        throw error
      }
    }
  )
/*
API.interceptors.response.use(null, (error) => {
    console.log('intercept')
    if (error.config && error.response && error.response.status === 401) {
        return API.post('api/users/refresh-token').then(response => {
            console.log('REFRESH TOKEN:', response.data)
            return API.request(error.config);
        })
    }
  
    return Promise.reject(error);
});*/

async function refreshAccessToken() {
    await API.post('api/users/refresh-token').then(response => {
        console.log('REFRESH TOKEN:', response)
    })
}

export default API