import axios from 'axios'
import axiosRetry from 'axios-retry';

axios.defaults.withCredentials = true

const API = axios.create({
    baseURL: 'https://192.168.31.161:4000',
    header: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    responseType: 'json'
})
axiosRetry(API, { retries: 2 });

/*
async function refreshAccessToken() {
    await API.post('api/users/refresh-token').then(response => {
        console.log('REFRESH TOKEN:', response.data)
    })
}
*/

export default API