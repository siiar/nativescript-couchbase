var couchbaseModule = require("nativescript-couchbase");
var observableArrayModule = require("data/observable-array");
var frameModule = require("ui/frame");

var database;
var personList;

function pageLoaded(args) {
    var page = args.object;

    personList = new observableArrayModule.ObservableArray([]);
    database = new couchbaseModule.Couchbase("test-database");

    database.createView("people", "1", function(document, emitter) {
        emitter.emit(JSON.parse(document)._id, document);
    });

    var push = database.createPushReplication("http://192.168.57.1:4984/test-database");
    var pull = database.createPullReplication("http://192.168.57.1:4984/test-database");
    push.setContinuous(true);
    pull.setContinuous(true);
    push.start();
    pull.start();

    database.addDatabaseChangeListener(function(event) {
        console.log("CHANGE", JSON.stringify(event));
    });

    refresh();
    page.bindingContext = {personList: personList};
}

function refresh() {
    personList.splice(0);
    var rows = database.executeQuery("people");
    for(var i in rows) {
        if(rows.hasOwnProperty(i)) {
            personList.push(JSON.parse(rows[i]));
        }
    }
}

function create() {
    frameModule.topmost().navigate({moduleName: "views/create/create"});
}

exports.pageLoaded = pageLoaded;
exports.refresh = refresh;
exports.create = create;
