var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var CONTACTS_COLLECTION = "contacts";
var MONGODB_URI = "<here is your connection-string>";

var app = express();
app.use(bodyParser.json());

// create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

/**
 * We want to use our database connection pool
 * as often as possible to best manage our available
 * resources.
 * We initialize the db variable in the global scope
 * so that the connection can be used by all the route handlers.
 */
var db;

const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true });

// connect to the database before starting the application server
client.connect(function(err, client) {
  console.log("Connection start to the db...");

  if(err){
    console.log(err);
    process.exit(1);
  }

 /**
  * Save database object from the callback for reuse
  */
  db = client.db();
  console.log("Database connection ready");

  /**
   * We initialize the app only after the database connection is ready.
   * This ensures that the application won’t crash or error out
   * by trying database operations before the connection is established.
   */
  var server = app.listen(process.env.PORT || 8080, function(){
    var port = server.address().port;
    console.log("App now running on port: ", port);
  })
});





// Generic error handler used by all endpoints
function handleError(res, reason, message, code){
  console.log("ERROR: ", reason);
  res.status(code || 500).json({"error": message})
}

  // THE API-ENDPOINTS

  /**
   * "/api/contacts"
   * GET: find all contacts
   * POST: creates a new contact
   */
app.get("/api/contacts", function(req,res){

    db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err, docs){
      if(err){
        handleError(res, err.message, "Failed to get contacts");
      } else {
        res.status(200).json(docs);
      }
    })

})

app.post("/api/contacts", function(req, res){
    var newContact = req.body;
    newContact.createDate = new Date();

    if(!req.body.name){
      handleError(res, "Invalid user input", "Must provide a name", 400);
    } else {
      db.collection(CONTACTS_COLLECTION).insertOne(newContact, function(err, doc){
        if(err){
          handleError(res, err.message, "Failed to create new contact");
        } else {
          res.status(201).json(doc.ops[0]);
        }
      })
    }
})

/**
  * "/api/contacts/:id"
  * GET: find contact by id
  * PUT: update contact by id
  * DELETE: deletes contact by id
*/
app.get("/api/contacts/:id", function(req, res){
  db.collection(CONTACTS_COLLECTION).findOne({_id: new ObjectID(req.params.id) },
  function(err, doc){
    if(err){
      handleError(res, err.message, "Failed to get contact");
    } else {
      res.status(200).json(doc);
    }
  })

})

app.put("/api/contacts/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;
  var newValue = { $set: updateDoc };

  db.collection(CONTACTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, newValue, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update contact");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.delete("/api/contacts/:id", function(req, res){
  db.collection(CONTACTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)},
  function(err, doc){
    if(err){
      handleError(res, err.message, "Failed to delete contact");
    } else {
      res.status(200).json(req.params.id);
    }
  })
})
