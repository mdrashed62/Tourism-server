const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lic5ni0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const spotCollection = client.db("addSpotDB").collection('addSpot')
    const countryCollection = client.db("addSpotDB").collection('CountryData')
    // const haiku = database.collection("haiku");

    app.get('/touristSpots', async (req, res) => {
      const cursor = spotCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
  

    app.get('/countryData', async (req, res) => {
      const cursor = countryCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/touristSpots',async (req, res) => {
      const addSpot = req.body;
      // const result = await addSpotCollection.insertOne(addSpot)
      console.log(addSpot)
      const result = await spotCollection.insertOne(addSpot)
      res.send(result)
    })

    app.delete('/touristSpots/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await spotCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/touristSpots/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await spotCollection.findOne(query)
      res.send(result)
    })

    //update
    app.put('/touristSpots/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedSpot = req.body
      const spot = {
        $set: {
          spotName: updatedSpot.spotName, 
          countryName: updatedSpot.countryName, 
          shortDescription: updatedSpot.shortDescription,
          location: updatedSpot.location, 
          averageCost: updatedSpot.averageCost, 
          travelTime: updatedSpot.travelTime,
          photo: updatedSpot.photo, 
          seasonality: updatedSpot.seasonality, 
          visitors: updatedSpot.visitors
        }
      }
      const result = await spotCollection.updateOne(filter, spot, options);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('My tourist server is running')
})


app.listen(port, () => {
    console.log(`My tourist server is running on port: ${port}`)
})