const express = require("express");
require("./db/connection");
const app = express();
const router = require("./routes/router");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const PORT = 9000;


app.get("/",(req,res)=>{
    res.status(200).send("server started")
});

app.use(express.json());
app.use(cookieParser);
app.use(cors())
app.use(router);

app.listen(PORT,()=>{
    console.log(`server started at port no:${PORT}`)
});