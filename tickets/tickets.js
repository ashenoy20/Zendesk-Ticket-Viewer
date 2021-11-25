if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const axios = require("axios")
const Ticket = require('./Ticket')
const ExpressError = require("../ExpressError")

const router  = express.Router()

const TICKETS_PER_PAGE = 25
const USERNAME = process.env.ACCNT_USR
const PASSWORD = process.env.ACCNT_PWD

const DNE_ERROR_MSG = "No tickets exist here"
const PAGE_ERROR_MSG = "Invalid page number"
const TICKET_ERROR_MSG = "Ticket not found (invalid id)"
const API_ERROR_MSG = "API unavailable"

router.get("/:pageNum", async (req, res, next) => {
    const { pageNum } = req.params
    
    if(parseInt(pageNum) === 0){
        return res.redirect('/tickets/1')
    } 

    const ticketResponse = await getTickets(pageNum, TICKETS_PER_PAGE, next)
    const value =  await getTotalCount(next)

    if(!ticketResponse || !value){
        return res.end()
    }

    const ticketData = convertTickets(ticketResponse)

    if(ticketData === null){
        next(new ExpressError(404, DNE_ERROR_MSG))
        return res.end()
    }

    res.render("../views/tickets", {pageNum, value, TICKETS_PER_PAGE, ticketData})
    

 
})

router.get('/view/:id', async (req, res, next) => {
    const {id} = req.params

    const result = await getSingleTicket(id, next)

    if(result){
        const {subject, created_at, description} = result

        const singleTicket = new Ticket(id, subject, created_at, description)


        res.render('../views/indivTicket', {singleTicket})
    }
    
})





const makeRequest = async (url, username, password) => {
    return axios.get(url, {
        auth: {
            username: username,
            password: password
        }
    })
}

const getTickets = async (pageNum, num, next) => {
  
    const url = `https://zccapply.zendesk.com/api/v2/tickets.json?page=${pageNum}&per_page=${num}`


    const ticketResponse = await makeRequest(url, USERNAME, PASSWORD).catch(() => {next(new ExpressError(400, PAGE_ERROR_MSG))})
    
    if(!ticketResponse){
        return ticketResponse
    }

    return ticketResponse.data.tickets
}

const getSingleTicket = async (id, next) => {
    const url = `https://zccapply.zendesk.com/api/v2/tickets/${id}.json`

    const result = await makeRequest(url, USERNAME, PASSWORD).catch(() => {next(new ExpressError(404, TICKET_ERROR_MSG))})
   
    if(!result){
        return result
    }

    return result.data.ticket
}


const getTotalCount = async (next) => {
    const url = 'https://zccapply.zendesk.com/api/v2/tickets/count.json'

    const result =  await makeRequest(url, USERNAME, PASSWORD).catch(() => {next(new ExpressError(400, API_ERROR_MSG))})

    if(!result){
        return result
    }

    return result.data.count.value
}


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
