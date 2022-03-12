const axios = require('axios')

axios.default.post('https://192.168.31.214:4000/api/appointments/book2', {
    restaurantId: "6220f248299980291adbb1dc",
    tableId: "6220f248299980291adbb1df",
    email: "amtmannkristof@gmail.com",
    date: new Date()
})