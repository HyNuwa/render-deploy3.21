require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose')

app.use(express.json()); 
app.use(cors())
app.use(morgan('tiny'));
app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})
/*app.get('/info', (request, response) => {
  const todayDate = new Date(Date.now());
  const maxPerson = persons.length
  response.send(`the phonebook has info for ${maxPerson} people ${todayDate}`);
})
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const selectedPerson = persons.find(person => person.id === id)
  response.json(selectedPerson)
})
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)  
  response.status(204).end()
})
const generateId=()=>{
  const maxId = persons.length > 0 ? Math.max(...persons.map(n => n.id)) : 0
  const randomId = Math.floor(Math.random(maxId+1)*100)
  return randomId;
}*/
/*app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }else if(!body.number){
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }
  if(persons.find(person=>person.name===body.name)){
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }
  const person = {
    id: generateId(),
    name: body.name || false,
    number: body.number,
  }
  persons = persons.concat(person);
  console.log(person);
  response.json(person);
})*/
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})