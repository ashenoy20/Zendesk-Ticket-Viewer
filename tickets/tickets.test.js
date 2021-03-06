const axios = require('axios')
const {makeRequest, getTickets, getSingleTicket, getTotalCount, convertTickets} = require('./tickets')
const Ticket = require('./Ticket')

const mockNextFn = (placeholder) => {}

/**
 * Unit Tests for makeRequest()
 */
describe("makeRequest Test", () => {

    describe("when makeRequest is called", () => {
        it("axios returns response ", async () => {
            
            const mockResponse = {data: 'test'}
            const mockAxios = jest.spyOn(axios, 'get').mockReturnValueOnce(mockResponse)
            const mockUrl = 'https://www.test.com'
            const mockUser = 'test'
            const mockPass = 'test'
        
            const result = await makeRequest(mockUrl, mockUser, mockPass)

            expect(axios.get).toHaveBeenCalled()
            expect(result).toEqual(mockResponse)

            mockAxios.mockRestore()
        })
    })

})

/**
 * Unit Tests for getTickets()
 */
describe("getTickets Test", () => {
    describe("When parameters are valid", () => {
        it("Should return an array of objects", async () => {
            const sampleArr = [
                {
                    id: 1,
                    created_on: "today",
                    subject: "test",
                    description: "test"
                },
                {
                    id: 2,
                    created_on: "today",
                    subject: "test",
                    description: "test"
                },
                {
                    id: 3,
                    created_on: "today",
                    subject: "test",
                    description: "test"
                }

            ]
            const mockResponse = {
                data: {
                    tickets: sampleArr
                }
            }
            

            const mockAxios = jest.spyOn(axios, 'get').mockReturnValueOnce(mockResponse)
            
            const mockPageNum = 1
            const mockPerPage = 25

            const result = await getTickets(mockPageNum, mockPerPage, mockNextFn)

            expect(result).toEqual(sampleArr)

            mockAxios.mockRestore()
        })
    })

    describe("When parameters are invalid (invalid page #)", () => {
        it("Should return falsy value", async () => {
            const mockAxios = jest.spyOn(axios, 'get').mockImplementation(() => {throw new Error("Test Error")})

            const mockPageNum = -1
            const mockPerPage = 25

            const result = await getTickets(mockPageNum, mockPerPage, mockNextFn)

            expect(result).toBeFalsy()

            mockAxios.mockRestore()
        })
    })
    

})

/**
 * Unit Tests for getSingleTicket()
 */
describe("getSingleTicket Test", () => {
    describe("When parameters are valid", () => {
        it("Should return a single object", async () => {
            const sampleTicket = {
                    id: 1,
                    created_on: "today",
                    subject: "test",
                    description: "test"
                }
            const mockResponse = {
                data: {
                    ticket: sampleTicket
                }
            }
            

            const mockAxios = jest.spyOn(axios, 'get').mockReturnValueOnce(mockResponse)
            
            const mockId = 1

            const result = await getSingleTicket(mockId, mockNextFn)

            expect(result).toEqual(sampleTicket)

            mockAxios.mockRestore()
        })
    })

    describe("When parameters are invalid (invalid id)", () => {
        it("Should return falsy value", async () => {
            const mockAxios = jest.spyOn(axios, 'get').mockImplementation(() => {throw new Error("Test Error")})

            const mockId = -1

            const result = await getSingleTicket(mockId, mockNextFn)

            expect(result).toBeFalsy()

            mockAxios.mockRestore()
        })
    })
    

})

/**
 * Unit Tests for getTotalCount()
 */
describe("getTotalCount Test", () => {
    describe("When API and credentials are correct", () => {
        it("Should return an integer value", async () => {
           
            const mockResponse = {
                data: {
                    count: {
                        value: 101
                    }
                }
            }
            
            const actualResult = mockResponse.data.count.value

            const mockAxios = jest.spyOn(axios, 'get').mockReturnValueOnce(mockResponse)

            const result = await getTotalCount(mockNextFn)

            expect(typeof result).toEqual(typeof actualResult)
            expect(result).toEqual(actualResult)

            mockAxios.mockRestore()
        })
    })

    describe("When API is unavailable or wrong credentials", () => {
        it("Should return falsy value", async () => {
            const mockAxios = jest.spyOn(axios, 'get').mockImplementation(() => {throw new Error("Test Error")})

            const result = await getTotalCount(mockNextFn)

            expect(result).toBeFalsy()

            mockAxios.mockRestore()
        })
    })
    

})

/**
 * Unit Tests for convertTickets()
 */
describe("convertTickets Test", () => {
    describe("When input is an array with length >= 1", () => {
        it("Should return an array with items of type Ticket", () => {
            const sampleArrResponse = [
                {
                    id: 1,
                    created_on: "today",
                    subject: "test",
                    description: "test"
                },
                {
                    id: 2,
                    created_on: "today",
                    subject: "test",
                    description: "test"
                },
                {
                    id: 3,
                    created_on: "today",
                    subject: "test",
                    description: "test"
                }
            ]

            const result = convertTickets(sampleArrResponse)

            expect(result[0]).toBeInstanceOf(Ticket)
            expect(result.length).toEqual(sampleArrResponse.length)
        })
    })

    describe("When input is an empty array", () => {
        it("Should return null", () => {
            const sampleArrResponse = []

            const result = convertTickets(sampleArrResponse)

            expect(result).toBeNull()
        })
    })
})