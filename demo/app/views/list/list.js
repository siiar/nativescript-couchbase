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

    var push = database.createPushReplication("http://localhost:4984/test-database");
    var pull = database.createPullReplication("http://localhost:4984/test-database");

    push.setContinuous(true);
    pull.setContinuous(true);

    push.start();
    pull.start();

    database.addDatabaseChangeListener(function(changes) {
        var changeIndex;
        for(var i = 0; i < changes.length; i++) {
            changeIndex = indexOfObjectId(changes[i].getDocumentId(), personList);
            var document = database.getDocument(changes[i].getDocumentId());
            if(changeIndex == -1) {
                personList.push(document);
            } else {
                personList.setItem(changeIndex, document);
            }
        }
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

function indexOfObjectId(needle, haystack) {
    for(var i = 0; i < haystack.length; i++) {
        if(haystack.getItem(i) != undefined && haystack.getItem(i).hasOwnProperty("_id")) {
            if(haystack.getItem(i)._id == needle) {
                return i;
            }
        }
    }
    return -1;
}

exports.pageLoaded = pageLoaded;
exports.refresh = refresh;
exports.create = create;
