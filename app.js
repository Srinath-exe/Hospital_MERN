const express = require('express');
const app = express();
require('dotenv').config();
const dbconfig = require('./config/dbconfig');
const userRoute = require('./routes/userRoute');

app.use(express.json());


app.use('/api/user',userRoute); 

const port = process.env.PORT || 5000;


app.listen(port,()=>{
    console.log(`Listensing to port ${port}`);
});



