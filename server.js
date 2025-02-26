const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

mongoose
  .connect(process.env.URI)
  .then((conn) => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error(` DB error : ${err}`);
    process.exit(1);
  });

const app = require("./app");

const server = app.listen(process.env.PORT, () => {
  console.log("server is running");
});

// HANDLE REJECTION OUT EXPRESS
process.on("unhandledRejection", (err) => {
  console.log(`${err.name} : ${err.message}`);
  console.log("unhandledRejection...shutting down");
  server.close(() => {
    process.exit(1);
  });
});
