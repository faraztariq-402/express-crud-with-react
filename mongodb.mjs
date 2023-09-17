import { MongoClient } from 'mongodb';
const uri = "mongodb+srv://saylani123:saylani12123@cluster0.sjjp9iv.mongodb.net/?retryWrites=true&w=majority";
const  client = new MongoClient(uri)

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    console.log("You have successfully connected to MongoDB!");
  } catch(e) {
console.log("error", e)
    // Ensures that the client will close when you finish/error
    await client.close();
    process.exit(1)
  }
}
run().catch(console.dir);

process.on("SIGINT", async ()=>{
    console.log("app is terminating")
    await client.close()
    process.exit(0)
})

export default client

