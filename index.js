const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
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
  const adminCollection = client.db("hairShine").collection("admin");
  
  app.post('/addService', (req, res) => {
    const service = req.body.service
    const price = req.body.price
    const description = req.body.description
    const image = req.body.image

    serviceCollection.insertOne({service,description, price ,image})
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
    bookCollection.find({email:req.query.email})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
  
  
  app.get('/bookingList', (req, res) => {
    bookCollection.find()
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


  app.post('/addAdmin', (req, res) => {
    const admin = req.body
    console.log(admin)
    adminCollection.insertOne(admin)
    .then(result => {
      res.send(result.insertedCount > 0)
      console.log(result)
    })
  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email

    adminCollection.find({email: email})
    .toArray((err, admin) => {
      res.send(admin.length > 0)
    })
  })

  app.delete('/serviceDelete/:id', (req, res) => {
    console.log(req.params.id)
    serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })
  

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(process.env.PORT || port, () => console.log('lshkf'))