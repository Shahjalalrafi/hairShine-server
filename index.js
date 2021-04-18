const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
 

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fltsf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(cors())
app.use(express.json())

const port = 5050

client.connect(err => {
  const serviceCollection = client.db("hairShine").collection("service");
  const bookCollection = client.db("hairShine").collection("booking");
  const reviewCollection = client.db("hairShine").collection("review");
  
  app.post('/addService', (req, res) => {
    const service = req.body.service
    const price = req.body.price
    const description = req.body.description
    console.log(service, price, description)

    serviceCollection.insertOne({service,description, price })
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/services', (req,res) => {
    serviceCollection.find({})
    .toArray((err,documents) => {
      res.send(documents)
    })
  })

  app.post('/booking', (req, res) => {
    const booking = req.body
    console.log(booking)
    bookCollection.insertOne(booking)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/allBooking', (req, res) => {
    bookCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.post('/addReview', (req, res) => {
    const review = req.body
    console.log(review)
    reviewCollection.insertOne(review)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/reviews', (req, res) => {
    reviewCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})