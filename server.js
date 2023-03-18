const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database("my_database.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the in-memory SQLite database.");
  }
});

const createTweetsTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS tweets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      retweets INTEGER DEFAULT 0,
      replies INTEGER DEFAULT 0
    );`;

  db.run(query, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Tweets table created.");
    }
  });
};

createTweetsTable();

app.post("/tweets", (req, res) => {
  const { content, timestamp } = req.body;
  const query = `INSERT INTO tweets (content, timestamp) VALUES (?, ?)`;

  db.run(query, [content, timestamp], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: this.lastID }); // Set the status to 201 (Created) and send the JSON response
    }
  });
});


app.get("/tweets", (req, res) => {
  const query = "SELECT * FROM tweets";

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.put("/tweets/:id/like", (req, res) => {
  const id = req.params.id;
  const query = `UPDATE tweets SET likes = likes + 1 WHERE id = ?`;

  db.run(query, id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // Send a JSON response with the updated like count
      const updatedPost = { likes: req.body.likes + 1 };
      res.json(updatedPost);
    }
  });
});


app.put("/tweets/:id/retweet", (req, res) => {
  const id = req.params.id;
  const query = `UPDATE tweets SET retweets = retweets + 1 WHERE id = ?`;

  db.run(query, id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // Send a JSON response with the updated like count
      const updatedPost = { retweets: req.body.retweets + 1 };
      res.json(updatedPost);
    }
  });
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
