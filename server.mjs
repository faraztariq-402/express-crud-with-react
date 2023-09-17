import express from "express";
import path from 'path'
import cors from "cors";
const __dirname = path.resolve()

import postRouter from "./routes/post.mjs";
const app = express()
app.use(express.json())
app.use(cors())
app.use('/api/v1',postRouter )
app.get('/', (req,res)=>{
res.send("this is profile")
})
app.use(express.static(path.join(__dirname, 'public')))
const PORT = process.env.PORT || 5001;
app.listen(PORT, ()=>{
    console.log(`example server listening on PORT ${PORT}`)
})
// import express from 'express';
// import cors from 'cors';
// import path from 'path';
// import postRouter from "./routes/post.mjs";
// const __dirname = path.resolve();






// const app = express();
// app.use(express.json()); // body parser
// app.use(cors())


// app.use("/api/v1", postRouter) // Secure api




// //     /static/vscode_windows.exe
// app.use("/static", express.static(path.join(__dirname, 'static')))

// app.use(express.static(path.join(__dirname, 'public')))

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//     console.log(`Example server listening on port ${PORT}`)
// })