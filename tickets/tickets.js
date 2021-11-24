if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const axios = require("axios")
const Ticket = require('./Ticket')
const ExpressError = require("../ExpressError")

const router  = express.Router()

const ticketsPerPage = 25

router.get("/:pageNum", async (req, res, next) => {
    const { pageNum } = req.params
    

    if(pageNum === 0){
        pageNum = 1
    } 

    const ticketResponse = await getTickets(pageNum).catch(() => {next(new ExpressError(400, "Invalid page number"))})
    const result =  await getTotalCount().catch(() => {next(new ExpressError(400, "API Unavailable"))})

    if(!ticketResponse || !result){
        return res.end()
    }

    const {tickets} = ticketResponse.data
    const {value} = result.data.count

    const ticketData = convertTickets(tickets)

    if(ticketData === null){
        next(new ExpressError(404, "No tickets exist here"))
        return res.end()
    }

      
    res.render("../views/tickets", {pageNum, value, ticketsPerPage, ticketData})
    

 
})

router.get('/view/:id', async (req, res, next) => {
    const {id} = req.params

    const result = await getSingleTicket(id).catch(() => {next(new ExpressError(404, "Ticket not found"))})

    if(result){
        const {subject, type, description} = result.data

        const singleTicket = new Ticket(id, subject, type, description)


        res.render('../views/indivTicket', {singleTicket})
    }
    
})





const makeRequest = async (url) => {
    return axios({
        method: 'get',
        url: url,
        auth: {
            username: "ashishshenoy9@gmail.com",
            password: process.env.ACCNT_PWD
        }
    })
}

const getTickets = async (pageNum) => {
    const url = `https://zccapply.zendesk.com/api/v2/tickets.json?page=${pageNum}&per_page=${ticketsPerPage}`
    return await makeRequest(url)
}

const getSingleTicket = async (id) => {
    const url = `https://zccapply.zendesk.com/api/v2/tickets/${id}.json`
    return await makeRequest(url)
}


const getTotalCount = async () => {
    const url = 'https://zccapply.zendesk.com/api/v2/tickets/count.json'
    return makeRequest(url)
}


const convertTickets = (dataSet) => {
    let arr = []

    if(dataSet.length === 0){
        return null
    }

    for(let i = 0; i < dataSet.length; i++){
        ticketObj = dataSet[i]
        newTicket = new Ticket(ticketObj.id, ticketObj.subject, ticketObj.type, ticketObj.description)
        arr.push(newTicket)
    }

    return arr
    
}


module.exports = router