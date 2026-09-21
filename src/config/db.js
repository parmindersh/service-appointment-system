const mongoose = require("mongoose");

async function connectdb() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connection successful");
  } catch (err) {
    console.error(err);
    process.exit(1); //it'll stop server if db fail
  }
}
module.exports = connectdb;
