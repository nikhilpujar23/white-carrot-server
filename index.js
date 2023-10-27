const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// middleware
require("dotenv").config();
app.use(cors());
app.use(express.json());

async function run() {
  const uri = "mongodb+srv://nikhilrpujar:12345@cluster0.xfqchgj.mongodb.net/?retryWrites=true&w=majority";
 var movies;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    // collection Name
    const moviesCollection = client
      .db("WhiteCarrot")
      .collection("movies");

    const favoriteColection = client
      .db("WhiteCarrot")
      .collection("favorite");

    app.get("/all-movies", async (req, res) => {
      const query = {};
      var result = await moviesCollection.find(query).toArray();
      movies=result;
      res.send(result);
     
    });

    app.get('/searchMovies', (req, res) => {
      const searchQuery = req.query.search;
     
    
      const searchResults = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      res.json({ results: searchResults });
    });
    app.post("/insertfav", async (req, res) => {
      const item = req.body;
      const result = await favoriteColection.insertOne(item);
      res.send(result);
    });
    app.get("/fetchfav", async (req, res) => {
      console.log("fetchfav called");
      const query = {  };
      const result = await favoriteColection.find(query).toArray();
      const ids = result.map((item) => item.id);
      res.send(ids);
    });
    app.delete("/deletefav/:id", async (req, res) => {
      const searchid = req.params.id;
      const query = { id: searchid };
    
      const result = await favoriteColection.deleteMany(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.error());

app.get("/", (req, res) => {
  res.send("White Carrot movie server is running!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
