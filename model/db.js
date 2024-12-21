// .model/db.js
import mongoose from "mongoose";

const USER_DB = process.env.USER_DB
const PASS    = process.env.PASS
const url = `mongodb://${USER_DB}:${PASS}@${process.env.DB_HOST}:27017/myProject?authSource=admin`; 

//Connecting to mongodb

export default function connectDB() {     
  try {
    mongoose.connect(url);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  const dbConnection = mongoose.connection;
  dbConnection.once("open", (_) => {
    console.log(`Database connected: ${url}`);
  });
     
  dbConnection.on("error", (err) => {
    console.error(`connection error: ${err}`);
  });
  return;
}