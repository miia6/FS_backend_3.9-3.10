const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('postData', (req) => {
    return JSON.stringify(req.body)
})

app.use(express.static('dist'))
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))
app.use(cors())

let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/info', (request, response) => {
    const requestTime = new Date()
    const message = `
        <p>Phonebook has info for ${phonebook.length} people</p>
        <p>${requestTime}</p>`
    response.send(message)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonebook.find( person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.find( person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {

    const body = request.body

    if (!body || !body.name || !body.number) {
        return response.status(400).json({error: 'name or number is missing'})
    } 

    const existingPerson = phonebook.find(person => person.name === body.name)
    if (existingPerson) {
        return response.status(400).json({error: 'name must be unique'})
    }

    const newPerson = {
        id: Math.floor(Math.random() * 100),
        name: body.name,
        number: body.number
    }

    phonebook = phonebook.concat(newPerson)

    response.json(phonebook)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

