const express = require('express')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors');
const port = 3000


app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://tree-plant-store:${process.env.Plant_Store_DB}@cluster0.hq0xigy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    const database = client.db("PlantsDB");
    const PlantsCollection = database.collection("plants");


    // Post API 
    app.post('/plants',async(req,res)=>{
        const userProfile  = req.body;
      const result = await PlantsCollection.insertOne(userProfile)
      res.send(result)
    })
// get all  API 

app.get('/plants',async(req,res)=>{
      const result = await PlantsCollection.find().toArray();
      res.send(result)
    })
// Get Specific App
app.get('/plants/:id',async(req,res)=>{
    const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await PlantsCollection.findOne(query)
  res.send(result);
})


// update API 
app.put('/plants/:id', async(req,res)=>{
   const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const {
    image,
    name,
    category,
    description,
    careLevel,
    wateringFrequency,
    lastWatered,
    nextWatering,
    healthStatus,
    userEmail,
    userName,
  } = req.body;
  
    const updateDoc = {
      $set: {
        image,
    name,
    category,
    description,
    careLevel,
    wateringFrequency,
    lastWatered,
    nextWatering,
    healthStatus,
    userEmail,
    userName,
      }
    }
    const result = await PlantsCollection.updateOne(query,updateDoc)
    res.send(result)
    console.log(result)

})

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Plant Tree Store server')
})

app.listen(port, () => {
  console.log(`Plant Tree store server is listening on port ${port}`)
})


