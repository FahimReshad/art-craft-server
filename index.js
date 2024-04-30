const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// artCraftStore
// EULK8aPGk1LbWPlM

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rpkd5x3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const craftCollection = client.db("craftDB").collection("craft");


    app.get("/craft", async(req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get("/craft/:id", async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await craftCollection.findOne(query);
      res.send(result);
    })



    



    app.post("/craft", async (req, res) => {
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    });

    app.put("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCraft = req.body;
      const coffee = {
        $set: {
          image: updatedCraft.image,
          item: updatedCraft.item,
          subCategoryName: updatedCraft.subCategoryName,
          customization: updatedCraft.customization,
          shortDes: updatedCraft.shortDes,
          price: updatedCraft.price,
          rating: updatedCraft.rating,
          processingTime: updatedCraft.processingTime,
          stockStatus: updatedCraft.stockStatus,
          email: updatedCraft.email,
          userNames: updatedCraft.userNames,
        },
      };
      const result = await craftCollection.updateOne(filter, coffee, options);
      res.send(result)
    });

    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/myProduct/:email", async(req, res) => {
      // console.log(req.params.email);
      const cursor = craftCollection.find({email: req.params.email});
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get("/artCraft/:subCategoryName", async(req, res) => {
      // console.log(req.params.email);
      const cursor = craftCollection.find({subCategoryName: req.params.subCategoryName});
      const result = await cursor.toArray();
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("art & craft running successfully");
});

app.listen(port, () => {
  console.log(`art & craft is running on port: ${port}`);
});
