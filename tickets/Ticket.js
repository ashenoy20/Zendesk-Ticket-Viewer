class Ticket {

    constructor(id, subject, description){
        this.id = id
        this.subject = subject
        this.description = description
    }


    getId() {
        return this.id
    }

    getSubject(){
        return this.subject
    }

    getDescription() {
        return this.description
    }
}

module.exports = Ticket