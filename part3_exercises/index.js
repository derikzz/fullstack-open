const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('content-length', (req, res) => res.get('Content-Length'))
morgan.token('post-content', (req, res) => {
    const body = req.body
    if (body.name && body.number) {
        return JSON.stringify(body)
    } else {
        return ''
    }
})

app.use(morgan(':method :url :status :content-length - :response-time ms :post-content'))



let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    const newId = Math.round(Math.random() * 100000)
    return String(newId)
}

app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
    console.log('Phonebook loaded')
})

app.get('/api/persons/', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number  
    }

    persons = persons.concat(person)

    response.json(person)
})

app.get('/info/', (request, response) => {
    const now = new Date();
    response.send(
        `<div>Phonebook has info for ${persons.length} people</div>` +
        `<div>${now}</div>`
    )
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})