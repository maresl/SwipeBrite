const express = require('express')
const cors = require('cors')
const indexRouter = require('./routes/index')
require('dotenv').config()


const PORT = process.env.PORT || 3000;

require('./config/database')


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use( cors() )

app.use( ( req, res, next ) => {
    console.log(`${req.method} ${req.originalUrl}`)
    next();
  });

app.use('/api/v1/events', indexRouter);

app.listen( PORT, () => console.log( `listing at port ${PORT} \nhttp://localhost:${PORT}/api/v1/events`) );