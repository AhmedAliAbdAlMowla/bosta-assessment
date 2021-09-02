const mongoose = require("mongoose");
/**
 * @desc     Mongodb  connect
 */
module.exports = () => {
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    'useCreateIndex': true,
     poolSize:7
  });
  const db = mongoose.connection;
  db.on("error", (error) => console.log(error));
  db.once("open", () => console.log("Connected to Mongodb.."));
};
