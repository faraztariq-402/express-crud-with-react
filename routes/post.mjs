import express from 'express';
import client from "../mongodb.mjs" // Use .js extension for imports
import { nanoid } from 'nanoid';
import { ObjectId } from 'mongodb';
import 'dotenv/config';
import OpenAI from 'openai';
const db = client.db("crud");
const col = db.collection("posts");
const router = express.Router(); // Use Router instead of let router
console.log(process.env.OPENAI_API_KEY)


const initializeOpenAIClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


router.get("/search", async (req, res) => {

  try {
    const response = await openaiClient.embeddings.create({
      model: "text-embedding-ada-002",
      input: req.query.q,
    });
    const vector = response?.data[0]?.embedding
    console.log("vector: ", vector);
    // [ 0.0023063174, -0.009358601, 0.01578391, ... , 0.01678391, ]

    // Query for similar documents.
    const documents = await col.aggregate([
      {
        "$search": {
          "index": "default",
          "knnBeta": {
            "vector": vector,
            "path": "embedding",
            "k": 10 // number of documents
          },
          "scoreDetails": true

        }
      },
      {
        "$project": {
          "embedding": 0,
          "score": { "$meta": "searchScore" },
          "scoreDetails": { "$meta": "searchScoreDetails" }
        }
      }
    ]).toArray();
    console.log("scoreDetails", documents[1])
    documents.map(eachMatch => {
      console.log(`score ${eachMatch?.score?.toFixed(3)} => ${JSON.stringify(eachMatch)}\n\n`);
    })
    console.log(`${documents.length} records found `);

    res.send(documents);

  } catch (e) {
    console.log("error getting data mongodb: ", e);
    res.status(500).send('server error, please try later');
  }

})
router.get('/post', (req, res) => {
  res.send("this is post router");
});

// router.get("/search", async (req, res) => {
//   const queryText = req.query.q;

//   try {
//       // Initialize the OpenAI client
//       const openaiClient = initializeOpenAIClient();

//       // Create an embedding for the query text
//       const response = await openaiClient.embeddings.create({
//           model: "text-embedding-ada-002",
//           input: queryText,
//       });

//       // Extract the vector from the response
//       const vector = response?.data[0]?.embedding;

//       // Perform a search using the vector
//       const documents = await col
//           .aggregate([
//               {
//                   $search: {
//                       index: "default",
//                       knnBeta: {
//                           vector: vector,
//                           path: "embedding",
//                           k: 10,
//                       },
//                       scoreDetails: true,
//                   },
//               },
//           ])
//           .toArray();

//       res.send(documents);
//   } catch (error) {
//       console.error(error);
//       res.status(500).send('Error during search');
//   }
// });

router.post('/post', async (req, res) => {
  try {
    const insertData = await col.insertOne({
      id: nanoid(),
      title: req.body.title,
      text: req.body.text,
    });
    console.log("insertedData", insertData)
    res.send("Post created");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating post"); // Handle errors with a status code
  }
});
router.get("/posts", async (req, res) => {
  const response = col.find({}).sort({ _id: -1 })
  try {
    let results = await response.toArray()
    console.log("result", results)
    res.send(results)
  } catch (e) {
    console.log("error in retrieving", e)
  }
})
export default router;
