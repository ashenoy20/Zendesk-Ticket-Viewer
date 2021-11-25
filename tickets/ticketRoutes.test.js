const axios = require('axios')
const supertest = require('supertest')

const app = require('../app')
const ticketFunction = require('../tickets/tickets')
const Ticket = require('./Ticket')
const request = supertest(app)

/**
 * Unit Tests for /tickets/:pageNum route
 */
describe("Testing /tickets/:pageNum", () => {
    describe("When API is available and valid pageNum", () => {
        it("Returns a status of 200", async () => {
            const testPageNum = 1 
            const mockResponse = {
                data: {
                    tickets: [
                        {
                            id: 1,
                            created_on: "test",
                            subject: "test",
                            description: "test"
                        }
                    ]
                }
            }
            const mockCountResponse = {
                data: {
                    count: {
                        value: 1
                    }
                }
            }
            const mockTicketArr = [new Ticket(1,'t','t','t')]

            const mockAxios = jest.spyOn(axios, 'get').mockReturnValueOnce(mockResponse).mockReturnValueOnce(mockCountResponse)
            const mockConvertTickets = jest.spyOn(ticketFunction, 'convertTickets').mockReturnValueOnce(mockTicketArr)

            await request.get(`/tickets/${testPageNum}`)
                   .expect(200)
                   
            mockAxios.mockRestore()
            mockConvertTickets.mockRestore()
        })
    })

    describe("When API is available but no tickets were returned", () => {
        it("Returns a status of 400", async () => {
            const testPageNum = 100
            const mockResponse = {
                data: {
                    tickets: []
                }
            }
            const mockCountResponse = {
                data: {
                    count: {
                        value: 0
                    }
                }
            }
            const mockAxios = jest.spyOn(axios, 'get').mockReturnValueOnce(mockResponse).mockReturnValueOnce(mockCountResponse)
            const mockConvertTickets = jest.spyOn(ticketFunction, 'convertTickets').mockReturnValueOnce(null)

            await request.get(`/tickets/${testPageNum}`)
                   .expect(404)

            mockAxios.mockRestore()
            mockConvertTickets.mockRestore()
        })
    })

    describe("When API is unavailable or invalid pageNum", () => {
        it("Returns a status of 400", async () => {
            const testPageNum = -1 
            const mockAxios = jest.spyOn(axios, 'get').mockImplementation(() => {throw new Error("test error message")})

            await request.get(`/tickets/${testPageNum}`)
                   .expect(400)

            mockAxios.mockRestore()
        })
    })
})

/**
 * Unit Tests for /tickets/view/:id route
 */
describe("Testing /tickets/view/:id", () => {
    describe("When API is available and id is valid", () => {
        it("Returns a status of 200", async () => {
            const testId = 1 
            const mockResponse = {
                data: {
                    ticket: {
                        id: testId,
                        created_on: "test",
                        subject: "test",
                        description: "test"
                    } 
                }
            }

            const mockAxios = jest.spyOn(axios, 'get').mockReturnValueOnce(mockResponse)

            await request.get(`/tickets/view/${testId}`)
                   .expect(200)
            mockAxios.mockRestore()
        })
    })

    describe("When API is unavailable or id is invalid", () => {
        it("Returns a status of 404",  async () => {
            const testId = -1 

            const mockAxios = jest.spyOn(axios, 'get').mockImplementation(() => {throw new Error("test error message")})

            await request.get(`/tickets/view/${testId}`)
                   .expect(404)
            mockAxios.mockRestore()
        })
    })
})

/**
 * Unit Tests for / route
 */
describe("Testing /", () => {
    describe("No matter what state of the API", () => {
        it("Should return status 200 no matter what", async () => {
            await request.get("/")
                   .expect(200)
        })
    })
})

/**
 * Unit Tests for non-existing route
 */
describe("Testing random endpoint not reachable", () => {
    describe("If API is unavailable or available", () => {
        it("Should return status 404", async () => {
            const wrongURL = "/thisPathisWrong"
            await request.get(wrongURL)
                   .expect(404)
        })
    })
})