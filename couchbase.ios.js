"use strict";
var Couchbase = (function () {
    function Couchbase(databaseName) {
        this.manager = CBLManager.sharedInstance();
        if (!this.manager) {
            console.log("MANAGER ERROR:Can not create share instance of CBLManager");
        }
        var errorRef = new interop.Reference();
        this.database = this.manager.databaseNamedError(databaseName, errorRef);
        if (!this.database) {
            console.log(errorRef.value);
        }
    }
    Couchbase.prototype.createDocument = function (data) {
        var doc = this.database.createDocument();
        var documentId = doc.documentID;
        var errorRef = new interop.Reference();
        var revision = doc.putPropertiesError(data, errorRef);
        if (!errorRef) {
            console.log("DOCUMENT ERROR:" + errorRef.value);
        }
        return documentId;
    };
    Couchbase.prototype.getDocument = function (documentId) {
        var document = this.database.documentWithID(documentId);
        if (document) {
            return JSON.parse(this.mapToJson(document.properties));
        }
        return null;
    };
    Couchbase.prototype.updateDocument = function (documentId, data) {
        var document = this.database.documentWithID(documentId);
        var errorRef = new interop.Reference();
        var revision = document.putPropertiesError(data, errorRef);
        if (!errorRef) {
            console.error("DOCUMENT ERROR", errorRef.value);
        }
    };
    Couchbase.prototype.deleteDocument = function (documentId) {
        var document = this.database.documentWithID(documentId);
        var errorRef = new interop.Reference();
        document.deleteDocument(errorRef);
        if (!errorRef) {
            return false;
        }
        return true;
    };
    Couchbase.prototype.createView = function (viewName, viewRevision, callback) {
        var self = this;
        var view = this.database.viewNamed(viewName);
        view.setMapBlockVersion(function (document, emit) {
            callback(self.mapToJson(document), {
                emit: emit
            });
        }, viewRevision);
    };
    Couchbase.prototype.executeQuery = function (viewName) {
        var view = this.database.viewNamed(viewName);
        var query = view.createQuery();
        var errorRef = new interop.Reference();
        var resultSet = query.run(errorRef);
        var row = resultSet.nextRow();
        var results = [];
        var index = 0;
        while (row) {
            results[index++] = row.value;
            row = resultSet.nextRow();
        }
        if (!errorRef) {
            console.log(errorRef.value);
        }
        return results;
    };
    Couchbase.prototype.createPullReplication = function (remoteUrl) {
        var url = NSURL.URLWithString(remoteUrl);
        var replication = this.database.createPullReplication(url);
        if (!replication) {
            console.error("PULL ERROR");
        }
        return new Replicator(replication);
    };
    Couchbase.prototype.createPushReplication = function (remoteUrl) {
        var url = NSURL.URLWithString(remoteUrl);
        var replication = this.database.createPushReplication(url);
        if (!replication) {
            console.error("PUSH ERROR");
        }
        return new Replicator(replication);
        ;
    };
    Couchbase.prototype.addDatabaseChangeListener = function (callback) {
        var self = this;
        NSNotificationCenter.defaultCenter().addObserverForNameObjectQueueUsingBlock(kCBLDatabaseChangeNotification, null, NSOperationQueue.mainQueue(), function (notification) {
            var changesList = [];
            if (notification.userInfo) {
                var changes = notification.userInfo.objectForKey("changes");
                if (changes != null) {
                    for (var i = 0; i < changes.count; i++) {
                        changesList.push(new DatabaseChange(changes[i]));
                    }
                    callback(changesList);
                }
            }
        });
    };
    Couchbase.prototype.destroyDatabase = function () {
        var errorRef = new interop.Reference();
        this.database.deleteDatabase(errorRef);
        if (!errorRef) {
            console.error("DESTROY", errorRef.value);
        }
    };
    Couchbase.prototype.mapToJson = function (properties) {
        var errorRef = new interop.Reference();
        var data = NSJSONSerialization.dataWithJSONObjectOptionsError(properties, NSJSONWritingPrettyPrinted, errorRef);
        var jsonString = NSString.alloc().initWithDataEncoding(data, NSUTF8StringEncoding);
        return jsonString;
    };
    return Couchbase;
}());
exports.Couchbase = Couchbase;
var Replicator = (function () {
    function Replicator(replicator) {
        this.replicator = replicator;
    }
    Replicator.prototype.start = function () {
        this.replicator.start();
    };
    Replicator.prototype.setContinuous = function (isContinuous) {
        this.replicator.continuous = isContinuous;
    };
    return Replicator;
}());
exports.Replicator = Replicator;
var DatabaseChange = (function () {
    function DatabaseChange(change) {
        this.change = change;
    }
    DatabaseChange.prototype.getDocumentId = function () {
        return this.change.documentID;
    };
    DatabaseChange.prototype.getRevisionId = function () {
        return this.change.revisionID;
    };
    return DatabaseChange;
}());
exports.DatabaseChange = DatabaseChange;
