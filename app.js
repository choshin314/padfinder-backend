require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');

const propertyRoutes = require('./routes/property-routes')
const userRoutes = require('./routes/user-routes')

//------------DB-------------------------
const dbUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fvtaz.mongodb.net/padfinder?retryWrites=true&w=majority`
mongoose.connect(dbUri)
    .then(() => console.log('Connected to MongoDB'))

//------------MIDDLEWARE------------------
//parse incoming file uploads and append to req.file
app.use(fileUpload());

//cors middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
})



//body parser stuff
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//--------------ROUTES-----------------------

app.get('/', (req, res, next) => {
    res.send('Hello World')
})

app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes)


app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));