var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

// Log the MongoDB credentials for debugging purposes (remove or hide in production)
console.log(`MongoDB Username: ${username}`);
console.log(`MongoDB Password: ${password}`);

mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.dydkquk.mongodb.net/moneytrackerDB`,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("Connected to Database"))
.catch(err => console.error("Error in connecting to the Database:", err));

// Define the schema for the data
const entrySchema = new mongoose.Schema({
  category: String,
  amount: Number,
  info: String,
  date: Date
});

// Model for the schema
const Entry = mongoose.model("Entry", entrySchema);

app.post("/add", async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const { category_select, amount_input, info, date_input } = req.body;

    if (!category_select || !amount_input || !info || !date_input) {
      console.error("Missing required fields");
      return res.status(400).send("Missing required fields");
    }

    const entryData = new Entry({
      category: category_select,
      amount: parseFloat(amount_input),  // Ensure amount is a number
      info: info,
      date: new Date(date_input)
    });

    await entryData.save();
    console.log("Record Inserted Successfully");
    res.status(201).send("Record Inserted Successfully");
  } catch (err) {
    console.error("Error inserting record:", err);
    res.status(500).send("Error inserting record: " + err.message);
  }
});

app.get("/", (req, res) => {
  res.set({
    "Allow-access-Allow-Origin": '*'
  });
  return res.redirect('index.html');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
