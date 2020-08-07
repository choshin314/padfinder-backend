const express = require('express');
const app = express();

const propertyRoutes = require('./routes/property-routes')

app.use(express.json());
app.use(express.urlencoded());

//cors middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
})

//routes

app.get('/', (req, res, next) => {
    res.send('Hello World')
})

app.use('/api/properties', propertyRoutes);


app.listen(5000);