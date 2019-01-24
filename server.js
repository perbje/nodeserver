var express = require('express');
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
require('dotenv').config();
var ObjectID = mongodb.ObjectID;
var SETS_COLLECTION = "legosets";
var db;

var app = express();
app.use(bodyParser.json());

mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/lego", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});


// Routes
app.get('/', function(req, res) {
  res.send('Hello PER!');
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/api/sets", function(req, res) {
  db.collection(SETS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get sets.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/sets", function(req, res) {
  var newSet = req.body;
  newSet.createDate = new Date();
  if (!req.body.setid) {
    handleError(res, "Invalid user input", "Must provide a setId.", 400);
  } else {
    db.collection(SETS_COLLECTION).insertOne(newSet, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new set.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});

app.get("/api/sets/:id", function(req, res) {
  db.collection(SETS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get set");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/api/sets/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;
  db.collection(SETS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update set");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.delete("/api/sets/:id", function(req, res) {
  db.collection(SETS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete set");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});
