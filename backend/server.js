require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT;

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected :))");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.log("MongoDB connection error :(", error);
  }
})();
