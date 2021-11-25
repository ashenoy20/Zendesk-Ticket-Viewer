const express = require('express')
const ejsMate = require('ejs-mate')
const ticketRoute = require("./tickets/tickets")
const ExpressError = require("./ExpressError")
const app = express()


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')


app.use('/tickets', ticketRoute)

app.get('/', (req, res) => {
    res.render('../views/home')
})

app.use('*', (req, res, next) => {
    next(new ExpressError(404,'Web page not found'))
})

app.use((err, req, res, next) => {
    const {message, status} = err
    res.status(status).render('../views/error', {message, status})
})

const PORT = 8080
app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`)
})