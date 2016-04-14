"use strict";
var applicationModule = require("application");
var Couchbase = (function () {
    function Couchbase(databaseName) {
        this.context = applicationModule.android.context;
        try {
            this.manager = new com.couchbase.lite.Manager(new com.couchbase.lite.android.AndroidContext(this.context), null);
            this.database = this.manager.getDatabase(databaseName);
        }
        catch (exception) {
            console.error("MANAGER ERROR:", exception.message);
        }
    }
    Couchbase.prototype.createDocument = function (data) {
        var document = this.database.createDocument();
        var documentId = document.getId();
        try {
            document.putProperties(this.objectToMap(data));
        }
        catch (exception) {
            console.error("DOCUMENT ERROR:", exception.message);
        }
        return documentId;
    };
    Couchbase.prototype.getDocument = function (documentId) {
        var document = this.database.getDocument(documentId);
        return JSON.parse(this.mapToJson(document.getProperties()));
    };
    Couchbase.prototype.updateDocument = function (documentId, data) {
        var document = this.database.getDocument(documentId);
        try {
            document.putProperties(this.objectToMap(data));
        }
        catch (exception) {
            console.error("DOCUMENT ERROR", exception.message);
        }
    };
    Couchbase.prototype.deleteDocument = function (documentId) {
        var document = this.database.getDocument(documentId);
        try {
            document.delete();
        }
        catch (exception) {
            console.error("DOCUMENT ERROR", exception.message);
        }
        return document.isDeleted();
    };
    Couchbase.prototype.destroyDatabase = function () {
        try {
            this.database.delete();
        }
        catch (exception) {
            console.error("DESTROY", exception.message);
        }
    };
    Couchbase.prototype.createView = function (viewName, viewRevision, callback) {
        var view = this.database.getView(viewName);
        var self = this;
        view.setMap(new com.couchbase.lite.Mapper({
            map: function (document, emitter) {
                callback(self.mapToJson(document), emitter);
            }
        }), viewRevision);
    };
    Couchbase.prototype.executeQuery = function (viewName) {
        var query = this.database.getView(viewName).createQuery();
        var result = query.run();
        var parsedResult = {};
        while (result.hasNext()) {
            var row = result.next();
            parsedResult[row.getKey()] = row.getValue();
        }
        return parsedResult;
    };
    Couchbase.prototype.createPullReplication = function (remoteUrl) {
        var replication;
        try {
            replication = this.database.createPullReplication(new java.net.URL(remoteUrl));
        }
        catch (exception) {
            console.error("PULL ERROR", exception.message);
        }
        return new Replicator(replication);
    };
    Couchbase.prototype.createPushReplication = function (remoteUrl) {
        var replication;
        try {
            replication = this.database.createPushReplication(new java.net.URL(remoteUrl));
        }
        catch (exception) {
            console.error("PUSH ERROR", exception.message);
        }
        return new Replicator(replication);
    };
    Couchbase.prototype.addDatabaseChangeListener = function (callback) {
        try {
            var self = this;
            this.database.addChangeListener(new com.couchbase.lite.Database.ChangeListener({
                changed: function (event) {
                    var changes = event.getChanges().toArray();
                    callback(changes);
                }
            }));
        }
        catch (exception) {
            console.error("DATABASE LISTENER ERROR", exception.message);
        }
    };
    Couchbase.prototype.objectToMap = function (data) {
        var gson = (new com.google.gson.GsonBuilder()).create();
        return gson.fromJson(JSON.stringify(data), (new java.util.HashMap).getClass());
    };
    Couchbase.prototype.mapToJson = function (data) {
        var gson = (new com.google.gson.GsonBuilder()).create();
        return gson.toJson(data);
    };
    Couchbase.prototype.mapToObject = function (data) {
        var gson = (new com.google.gson.GsonBuilder()).create();
        return JSON.parse(gson.toJson(data));
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
        this.replicator.setContinuous(isContinuous);
    };
    return Replicator;
}());
exports.Replicator = Replicator;
