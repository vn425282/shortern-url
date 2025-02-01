const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = "mongodb+srv://xxx:xxx@rakutendrive.1o1j9.mongodb.net/?retryWrites=true&w=majority&appName=RakutenDrive";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// URL Schema
const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
});

const Url = mongoose.model("Urls", urlSchema);

// Routes
// 1. Shorten a URL
app.post("/shorten", async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: "Original URL is required" });
  }

  try {
    // Check if the URL already exists in the database
    let url = await Url.findOne({ originalUrl });
    if (url) {
      return res.json({ shortUrl: url.shortUrl });
    }

    // Generate a short URL
    const shortUrl = shortid.generate();

    // Save to the database
    url = new Url({ originalUrl, shortUrl });
    await url.save();

    res.json({ shortUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 2. Redirect to the Original URL
app.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const url = await Url.findOne({ shortUrl });
    if (url) {
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json({ error: "URL not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/links", async (req, res) => {
    const { page = 1, limit = 10 } = req.body; // Read pagination parameters from the request body
  
    try {
      // Fetch links with pagination
      const links = await Url.find()
        .skip((page - 1) * limit) // Skip the previous pages
        .limit(parseInt(limit)); // Limit the number of results
  
      // Get the total count of links
      const totalLinks = await Url.countDocuments();
  
      res.json({
        links,
        totalPages: Math.ceil(totalLinks / limit),
        currentPage: parseInt(page),
      });
    } catch (err) {
      console.error("Error fetching links:", err);
      res.status(500).json({ error: "Server error" });
    }
});
  
  

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

