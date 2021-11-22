if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const axios = require("axios")
const Ticket = require('./Ticket')
const router  = express.Router()

router.get("/tickets", async (req, res) => {
    console.log("Made it here")
    let ticketData = null
    await getTickets().then((result) => {
        ticketData = convertTickets(result.data.tickets)
        console.log(ticketData)
    }).catch((err) => {
        console.log(err)
    })
})






const getTickets = async () => {
    const url = "https://zccapply.zendesk.com/api/v2/tickets.json"
    return axios({
        method: 'get',
        url: url,
        auth: {
            username: "ashishshenoy9@gmail.com",
            password: process.env.ACCNT_PWD
        }
    })
}

const convertTickets = (dataSet) => {
    let arr = []

    for(let i = 0; i < dataSet; i++){
        ticketObj = dataSet[i]
        newTicket = new Ticket(ticketObj.id, ticketObj.subject, ticketObj.description)
        console.log(newTicket)
    }

    return arr
}

module.exports = router