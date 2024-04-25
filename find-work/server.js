const mongoose = require('mongoose');
const httpServer = require('./app');
const { DB_HOST, PORT } = process.env;

mongoose.set('strictQuery', true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    httpServer.listen(PORT);
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  });
