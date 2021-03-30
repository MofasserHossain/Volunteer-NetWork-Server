const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// . mongoDB

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yedps.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// . get data
app.get('/', (req, res) => {
  res.send('DB connection is Working !!!');
});

client.connect((err) => {
  console.log('error', err);
  const eventCollection = client.db('VolunteerEvent').collection('events');
  console.log('connection Successful');

  // . add products
  app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    console.log(newEvent);
    eventCollection.insertOne(newEvent).then((result) => {
      console.log('inserted', result);
      res.send(result.insertedCount > 0);
    });
  });

  // . read product

  app.get('/allEvents', (req, res) => {
    eventCollection.find().toArray((err, items) => {
      console.log(items);
      res.send(items);
    });
  });
});

// .
app.listen(port, () => console.log('listening on port ' + port));
