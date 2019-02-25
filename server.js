var express = require('express');
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');
var mongodb = require("mongodb");
require('dotenv').config();
var ObjectID = mongodb.ObjectID;
var SETS_COLLECTION = "legosets";
var db;
var cors = require('cors');
var app = express();
var urlencodedParser = bodyParser.urlencoded({extended: false});
var hash = require('hash.js');
var mongoose = require('mongoose');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/lego", {useNewUrlParser: true}, function (err, client) {
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
app.get('/', function (req, res) {
    res.send('Pers lego-api');
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

app.get("/api/sets", verifyToken, function (req, res) {
    db.collection(SETS_COLLECTION).find({}).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get sets.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.post("/api/sets", function (req, res) {
    var newSet = req.body;
    newSet.createDate = new Date();
    if (!req.body.setid) {
        handleError(res, "Invalid user input", "Must provide a set Id ('setid').", 400);
    } else {
        db.collection(SETS_COLLECTION).insertOne(newSet, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to create new set.");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    }
});

app.get("/api/sets/:id", function (req, res) {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        db.collection(SETS_COLLECTION).findOne({
            _id: new ObjectID(req.params.id)
        }, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to get set");
            } else {
                res.status(200).json(doc);
            }
        });
    } else {
        handleError(res, "Invalid user input", "Must provide a set valid Id.", 400);
    }
});

app.put("/api/sets/:id", function (req, res) {
    var updateDoc = req.body;
    delete updateDoc._id;
    db.collection(SETS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to update set");
        } else {
            updateDoc._id = req.params.id;
            res.status(200).json(updateDoc);
        }
    });
});

app.delete("/api/sets/:id", function (req, res) {
    db.collection(SETS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function (err, result) {
        if (err) {
            handleError(res, err.message, "Failed to delete set");
        } else {
            res.status(200).json(req.params.id);
        }
    });
});

function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) res.status(403).send({auth: false, message: 'No token provided.'});
    jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
        if (err) res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
        req.userId = decoded.id;
        next();
    });
}

app.post('/login', urlencodedParser, function (req, res) {
    var secret = hash.sha256().update(req.body.secret).digest('hex');
    if (secret === process.env.LOGIN_SECRET) {
        var token = jwt.sign({
                iss: "www.kasselars.com",
                sub: "mylegosets",
                name: "PCB",
                admin: true
            }, process.env.TOKEN_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            }
        );
        res.status(200).send({auth: true, token: token});
    } else {
        res.status(401).send({auth: false, message: 'Failed to log in'});
    }
});

// Route not found (404)
app.use(function(req, res, next) {
    return res.status(404).send({ message: 'Route'+req.url+' Not found.' });
});

// 500 - Any server error
app.use(function(err, req, res, next) {
    return res.status(500).send({ error: err });
});