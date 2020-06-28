require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dbConnect = require('./dbConnect');
const getDsaCreationPastMonth = require('./script');
const DataModel = require('./models/data');

// SERVER
const app = express();
app.listen(process.env.PORT, err => {
    if(err) 
        console.log(`Server Connection Error: ${err}`);
    else
        console.log(`Listening on Port ${process.env.PORT}`);
});

// DB
dbConnect();

// APP MIDDLEWARE
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

// APP ROUTES MIDDLEWARE
const getDataRouter = require('./routes/data');

app.use('/api/data',getDataRouter);

const timeInterval = 1000*60*60*2;

setInterval(async () => {
    try {
        const accCreated = await getDsaCreationPastMonth();
        const accCreatedStr = JSON.stringify(accCreated);
        await DataModel.findOneAndReplace({_id:'5ef83a372f8f471fa0605131'}, {data:accCreatedStr});
        console.log('Update Complete')
    }
    catch(err) {
        console.log(err);
    }
}, timeInterval);
