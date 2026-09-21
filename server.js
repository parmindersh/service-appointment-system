require("dotenv").config();
const app = require("./app");
const connectDb = require("./src/config/db");

const port = process.env.port || 3000;

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`listening to ${port}`);
  });
});
