class Ticket {

    constructor(id, subject, type, description){
        this.id = id
        this.subject = subject
        this.type = type
        this.description = description
    }


    getId() {
        return this.id
    }

    getSubject(){
        return this.subject
    }

    getType(){
        return this.type
    }
    
    getDescription() {
        return this.description
    }
}

module.exports = Ticket