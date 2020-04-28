import mongoose from "mongoose"

export function setup(db_name:string) {
  const mongodb_uri = `mongodb://localhost/${db_name}`

  // Mongoose setup
  mongoose.connect(mongodb_uri, {
    // About this option: https://mongoosejs.com/docs/deprecations.html
    useNewUrlParser: true
  });
  mongoose.connection.on('error', (err) => {
    console.error("start-mongoose/setup", err);
    console.log("start-mongoose/setup", '✗ MongoDB connection error. Please make sure MongoDB is running.');
    process.exit();
  });
}

export function setupTestDB(db_name:string) {
  const mongodb_uri = `mongodb://localhost/${db_name}`

  // Mongoose setup
  mongoose.connect(mongodb_uri, {
    // About this option: https://mongoosejs.com/docs/deprecations.html
    useNewUrlParser: true
  });
  mongoose.connection.on('error', (err) => {
    console.error("/setupstart-mongooseTestDB", err);
    console.log("/setupstart-mongooseTestDB", '✗ MongoDB connection error. Please make sure MongoDB is running.');
    process.exit();
  });
}