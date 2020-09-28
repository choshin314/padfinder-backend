require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const cors = require('cors')

const propertyRoutes = require('./routes/property-routes')
const userRoutes = require('./routes/user-routes')

//------------DB-------------------------
const dbUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fvtaz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true  })
    .then(() => console.log('Connected to MongoDB'))

//------------MIDDLEWARE------------------
//parse incoming file uploads and append to req.file
app.use(fileUpload());

//cors middleware
app.use(cors())

//body parser stuff
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//--------------ROUTES-----------------------

app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes)

//------------ERROR HANDLING----------------
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.code || 500);
    res.json({ message: err.message || 'An unknown error occurred!' })
})


app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));