var couchbaseModule = require("nativescript-couchbase");
var observableArrayModule = require("data/observable-array");
var frameModule = require("ui/frame");

var database;
var tfFirstName;
var tfLastName;

function pageLoaded(args) {
    var page = args.object;

    personList = new observableArrayModule.ObservableArray([]);
    database = new couchbaseModule.Couchbase("test-database");

    tfFirstName = page.getViewById("firstname");
    tfLastName = page.getViewById("lastname");

    page.bindingContext = {};
}

function save() {
    database.createDocument({
        "firstname": tfFirstName.text,
        "lastname": tfLastName.text
    });
    frameModule.goBack();
}

exports.pageLoaded = pageLoaded;
exports.save = save;
