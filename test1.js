
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

var insertSupplier = function(db, name, what, callback) {
//    MongoClient.connect(url, function(err, db) {
//        assert.equal(null, err);
        var collection = db.collection('suppliers');
        collection.insertOne( {
          "name" : name,
          "what" : what,
          "when" : new Date()
        }, function(err, result) {
//            assert.equal(err, null);
           if (err == null) { //assert.equal(err, null);
                console.log("no error");
           } else {
                console.log(err);
           }

            console.log("Inserted a document into the supplier collection.");
            callback();
          });
//    })
};

exports.insertSupplier = function(name, what, callback) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        insertSupplier(db, "liam", "budgies", function() {
            db.close();
            callback();
        });
    });
};

var findSuppliers = function(db, what, callback) {
    console.log("start findSuppliers look for " + what);// + MongoClient);
//    MongoClient.connect(url, function(err, db) {
//        assert.equal(null, err);
//        console.log("db is open");

    //  findSuppliers(db, "radishes", function() {
    //  });
    //});
        var collection = db.collection('suppliers');
        console.log("collection " + collection);

        // probably much simpler way to get just the right records
        // but I'm learning here...
        var cursor = collection.find();
        console.log("cursor " + cursor);

        cursor.each(function(err, doc) {
            console.log("look at record");
            //if (err == null) { //assert.equal(err, null);
            //    console.log("no error");
                if (doc != null) {
                    if (doc.what == what) {
                        console.log(doc.name);
                    } else {
                        console.log(doc.name + " has no " + what);
                    }
                } else {
                    // no more data
                    callback();
                }
//            } else {
//                console.log(err);
//            }
        });

//        db.close();
//        console.log("db is closed");
//    });

//   callback();
};

exports.findSuppliers = function(what, callback) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        findSuppliers(db, "radishes", function() {
            db.close();
            callback();
        });
    });
};
//MongoClient.connect(url, function(err, db) {
//  assert.equal(null, err);
//  findSuppliers(db, "radishes", function() {
//      db.close();
//  });
//});
