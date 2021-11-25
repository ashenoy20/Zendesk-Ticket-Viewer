const express = require('express')
const ejsMate = require('ejs-mate')
const ticketRoute = require("./tickets/tickets")
const ExpressError = require("./ExpressError")
const app = express()


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')

/**
 * Routes leading to endpoints starting with '/tickets'
 */
app.use('/tickets', ticketRoute)


/**
 * Leads to the home endpoint
 */
app.get('/', (req, res) => {
    res.render('../views/home')
})


/**
 * Runs when navigating to an endpoint not covered
 */
app.use('*', (req, res, next) => {
    next(new ExpressError(404,'Web page not found'))
})

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
    const {message, status} = err
    res.status(status).render('../views/error', {message, status})
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`)
})

module.exports = app