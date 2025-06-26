require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://tree-plant-store:${process.env.Plant_Store_DB}@cluster0.hq0xigy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});



async function run() {
  try {
    await client.connect();

    const database = client.db("PlantsDB");
    PlantsCollection = database.collection("plants");
    SubscribersCollection = database.collection('newsletter');

    console.log("✅ MongoDB connected");

    // POST newsletter subscription
 app.post('/newsletter', async (req, res) => {
  const { name, email } = req.body;

  const result = await subscribedPerson.insertOne({
    name,
    email,
    subscribedAt: new Date(),
  });

  res.send(result);
});

    // GET newsletter subscriber by ID
    // app.get('/newsletter/:id', async (req, res) => {
    //   const id = req.params.id;

    //   try {
    //     const subscriber = await SubscribersCollection.findOne({ _id: new ObjectId(id) });
    //     if (!subscriber) {
    //       return res.status(404).json({ success: false, message: 'Subscriber not found' });
    //     }
    //     res.status(200).json({ success: true, subscriber });
    //   } catch (err) {
    //     res.status(500).json({ success: false, message: 'Invalid ID or server error', error: err.message });
    //   }
    // });

    // GET all newsletter subscribers
    app.get('/newsletter', async (req, res) => {
    
       const subscribers = await SubscribersCollection.find({}).toArray();
       res.send(subscribers)
    
    });

    // PUT update watering status of plant
    app.put('/plants/:id/status', async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;

      if (!['pending', 'successful'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      try {
        const query = { _id: new ObjectId(id) };
        const updateDoc = { $set: { wateringStatus: status } };
        const result = await PlantsCollection.updateOne(query, updateDoc);

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Plant not found' });
        }

        res.json({ success: true, message: 'Watering status updated' });
      } catch (err) {
        res.status(500).json({ error: 'Failed to update watering status', details: err.message });
      }
    });

    // Other plant APIs here (create, get by id, update, delete, etc.) can remain the same but remove duplicate PUT

  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Plant Tree Store server');
});

app.listen(port, () => {
  console.log(`Plant Tree store server listening on port ${port}`);
});
