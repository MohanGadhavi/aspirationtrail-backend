import mongoose from 'mongoose';

const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: 'AspirationTrail',
    })
    .then(() => {
      console.log(`connected to database`);
    })
    .catch((err) => {
      console.log('some error occured while connecting database', err);
    });
};

export default dbConnection;
