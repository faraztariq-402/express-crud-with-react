import express from 'express';
import client from "../mongodb.mjs" // Use .js extension for imports
import { nanoid } from 'nanoid';
import { ObjectId } from 'mongodb';
const db = client.db("crud");
const col = db.collection("posts");
const router = express.Router(); // Use Router instead of let router

// router.get('/post', (req, res) => {
//   res.send("this is post router");
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
router.get("/posts", async (req,res)=>{
const response = col.find({}).sort({_id:-1})
try{
  let results = await response.toArray()
  console.log("result", results)
  res.send(results)
}catch(e){
  console.log("error in retrieving", e)
}
})
export default router;
