if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const axios = require("axios")
const Ticket = require('./Ticket')
const ExpressError = require("../ExpressError")

const router  = express.Router()

//Global Constants
const TICKETS_PER_PAGE = 25
const USERNAME = process.env.ACCNT_USR
const PASSWORD = process.env.ACCNT_PWD
const SUBDOMAIN = process.env.SUBDOMN
const PORT = process.env.PORT

const DNE_ERROR_MSG = "No tickets exist here"
const PAGE_ERROR_MSG = "Invalid page number or API unavailable"
const TICKET_ERROR_MSG = "Ticket not found (invalid id) or API unavailable"
const API_ERROR_MSG = "API unavailable"

/**
 * Route that retrieves and displays a set number of tickets
 * less than or equal to the TICKETS_PER_PAGE constant. 
 * Displays error message when encountered with specific 
 * errors
 */
router.get("/:pageNum", async (req, res, next) => {
    const { pageNum } = req.params
    
    if(parseInt(pageNum) === 0){
        return res.redirect('/tickets/1')
    } 
    
    const ticketResponse = await getTickets(pageNum, TICKETS_PER_PAGE, next)

    if(!ticketResponse){
        return res.end()
    }

    const value =  await getTotalCount(next)

    if(!value || ticketResponse.length === 0){
        next(new ExpressError(404, DNE_ERROR_MSG))
        return res.end()
    }

    const ticketData = convertTickets(ticketResponse)
    
    res.render("../views/tickets", {pageNum, value, TICKETS_PER_PAGE, ticketData, PORT})
    
})

/**
 * Displays the specific ticket information based off
 * the ticket id in the url parameters. Displays error
 * messages when met with specifc errors
 */
router.get('/view/:id', async (req, res, next) => {
    const {id} = req.params

    const result = await getSingleTicket(id, next)

    if(result){
        const {subject, created_at, description} = result

        const singleTicket = new Ticket(id, subject, created_at, description)


        res.render('../views/indivTicket', {singleTicket})
    }

    
})




/**
 * A Wrapper function that returns an axios GET request
 * call based off the url, username, password. Used to
 * simplify creating get requests to API
 * 
 * @param {string} url - Url that axios will call
 * @param {string} username - username for authorization field
 * @param {string} password - password for authorization field
 * @returns - the result of the axios GET request function
 */
const makeRequest = async (url, username, password) => {
    return axios.get(url, {
        auth: {
            username: username,
            password: password
        }
    })
}

/**
 * A function that retrieves the array of ticket data from the request
 * to the Zendesk Ticket API.
 * 
 * @param {number} pageNum - page of tickets requested
 * @param {number} perPage - Amount of tickets to be shown
 * @param {*} next - middleware function used in case of error
 * @returns - when successful, returns an array of objects. Otherwise
 *            returns undefined.
 */
const getTickets = async (pageNum, perPage, next) => {
  
    const url = `https://${SUBDOMAIN}.zendesk.com/api/v2/tickets.json?page=${pageNum}&per_page=${perPage}`


    const ticketResponse = await makeRequest(url, USERNAME, PASSWORD).catch(() => {next(new ExpressError(400, PAGE_ERROR_MSG))})
    
    if(!ticketResponse){
        return ticketResponse
    }

    return ticketResponse.data.tickets
}

/**
 * A function that retireves a specific ticket from a request
 * made to the Zendesk Ticket API.
 * 
 * @param {number} id - the id of the requested ticket 
 * @param {*} next - middleware function used in case of error
 * @returns - returns an object with relevant ticket data. Otherwise
 *            returns undefined
 */
const getSingleTicket = async (id, next) => {
    const url = `https://${SUBDOMAIN}.zendesk.com/api/v2/tickets/${id}.json`

    const result = await makeRequest(url, USERNAME, PASSWORD).catch(() => {next(new ExpressError(404, TICKET_ERROR_MSG))})
   
    if(!result){
        return result
    }

    return result.data.ticket
}

/**
 * Returns the amount of tickets from a request made to the 
 * Zendesk Ticket API
 * @param {*} next - middleware function used in case of error
 * @returns - returns the number of tickets that exist. Otherwise
 *            returns undefined
 */
const getTotalCount = async (next) => {
    const url = `https://${SUBDOMAIN}.zendesk.com/api/v2/tickets/count.json`

    const result =  await makeRequest(url, USERNAME, PASSWORD).catch(() => {next(new ExpressError(400, API_ERROR_MSG))})

    if(!result){
        return result
    }

    return result.data.count.value
}

/**
 * A function that converts an array of objects into
 * instances of Ticket objects.
 * 
 * @param {array} dataSet - array of objects containing relevant data
 * @returns - returns an array of Ticket objects. If input is empty,
 *            returns null
 */
const convertTickets = (dataSet) => {
    let arr = []

    if(dataSet.length === 0){
        return null
    }

    for(let i = 0; i < dataSet.length; i++){
        ticketObj = dataSet[i]
        newTicket = new Ticket(ticketObj.id, ticketObj.subject, ticketObj.created_at, ticketObj.description)
        arr.push(newTicket)
    }

    return arr
    
}


module.exports = router
module.exports.makeRequest = makeRequest
module.exports.getTickets = getTickets
module.exports.getSingleTicket = getSingleTicket
module.exports.getTotalCount = getTotalCount
module.exports.convertTickets = convertTickets
