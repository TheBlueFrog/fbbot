
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

var insertConsumer = function(db, name, what, callback) {
    var collection = db.collection('consumers');
    collection.insertOne( {
      "name" : name,
      "what" : what,
      "when" : new Date()
    }, function(err, result) {
       if (err == null) { //assert.equal(err, null);
            console.log("Inserted " + name + " into the consumer collection.");
       } else {
            console.log(err);
       }

        callback();
    });
};

var insertSupplier = function(db, name, what, callback) {
    var collection = db.collection('suppliers');
    collection.insertOne( {
      "name" : name,
      "what" : what,
      "when" : new Date()
    }, function(err, result) {
       if (err == null) { //assert.equal(err, null);
            console.log("Inserted " + name + " into the supplier collection.");
       } else {
            console.log(err);
       }

        callback();
    });
};

var findConsumers = function(db, what, callback) {
    console.log("start findConsumers look for " + what);// + MongoClient);

    var collection = db.collection('consumers');
    console.log("collection " + collection);

    // probably much simpler way to get just the right records
    // but I'm learning here...
    var cursor = collection.find();
    console.log("cursor " + cursor);

    var consumers = "";

    cursor.each(function(err, doc) {

        //if (err == null) { //assert.equal(err, null);
        //    console.log("no error");
        if (doc != null) {
            if (doc.what == what) {
                console.log(doc.name + " wants " + what);
                consumers = consumers + ", " + doc.name;
            } else {
                console.log(doc.name + " doesn't want " + what);
            }
        } else {
            // no more data
            callback(consumers);
        }
    });
};

var findSuppliers = function(db, what, callback) {
    console.log("start findSuppliers look for " + what);

    var collection = db.collection('suppliers');
//    console.log("collection " + collection);

    // probably much simpler way to get just the right records
    // but I'm learning here...
    var cursor = collection.find();
    console.log("cursor " + cursor);

    var suppliers = "";

    cursor.each(function(err, doc) {
        //if (err == null) { //assert.equal(err, null);
        //    console.log("no error");
        if (doc != null) {
            if (doc.what == what) {
                console.log(doc.name + " has " + what);
                suppliers = suppliers + ", " + doc.name;
            } else {
                console.log(doc.name + " doesn't have " + what);
            }
        } else {
            // no more data
            callback(suppliers);
        }
    });
};

exports.insertConsumer = function(name, what, callback) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        insertSupplier(db, name, what, function() {
            db.close();
            callback();
        });
    });
};

exports.insertSupplier = function(name, what, callback) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        insertSupplier(db, name, what, function() {
            db.close();
            callback();
        });
    });
};

exports.findConsumers = function(what, callback) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        findConsumers(db, what, function(consumers) {
            db.close();
            callback(consumers);
        });
    });
};
exports.findSuppliers = function(what, callback) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        findSuppliers(db, what, function(suppliers) {
            db.close();
            callback(suppliers);
        });
    });
};
