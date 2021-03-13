const mongoose = require('mongoose');

const connectionStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/events';

mongoose.connect( connectionStr, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
})  
.then(() => console.log('MongoDB is connected!! Whoo Hoo!!'))
.catch((err) => console.log('MongoDB connection error :(', err ));


mongoose.connection.on( 'disconnected', (err) => console.log(err) );