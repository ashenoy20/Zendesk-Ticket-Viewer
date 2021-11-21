const express = require('express')
const ejsMate = require('ejs-mate')



const app = express()


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')

const PORT = 8080
app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`)
})