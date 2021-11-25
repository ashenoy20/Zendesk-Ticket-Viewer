/**
 * Ticket class stores key data values associated with object data
 * retrieved from Zendesk API
 */
class Ticket {

    constructor(id, subject, date, description){
        this.id = id
        this.subject = subject
        this.date = date
        this.description = description
    }


    getId() {
        return this.id
    }

    getSubject(){
        return this.subject
    }

    getDate(){
        return this.date
    }
    
    getDescription() {
        return this.description
    }
}

module.exports = Ticket