import {Injectable} from "@angular/core";
import {Observable} from 'data/observable';
import {ObservableArray} from 'data/observable-array';

var CouchbaseModule = require('nativescript-couchbase');

@Injectable()
export class ListService {
    public people = new ObservableArray([]);
    private database: any;

    constructor(){
      //this.people = new ObservableArray([]);
      this.database = new CouchbaseModule.Couchbase("test-database");
      this.database.createView("people", "1", (document, emitter) => {
        emitter.emit(JSON.parse(document)._id, document);
      });

      var push = this.database.createPushReplication("http://localhost:4984/test-database");
      var pull = this.database.createPullReplication("http://localhost:4984/test-database");

      push.setContinuous(true);
      pull.setContinuous(true);

      push.start();
      pull.start();

      this.database.addDatabaseChangeListener((changes) => {
          var changeIndex;
          for (var i = 0; i < changes.length; i++) {
            var documentId;

            documentId = changes[i].getDocumentId();
            changeIndex = this.indexOfObjectId(documentId, this.people);
            var document = this.database.getDocument(documentId);

            if (changeIndex == -1) {
              this.people.push(document);
            } else {
              this.people.setItem(changeIndex, document);
            }
          }
        });
    }

    private indexOfObjectId(needle, haystack) {
      for (var i = 0; i < haystack.length; i++) {
        if (haystack.getItem(i) != undefined && haystack.getItem(i).hasOwnProperty("_id")) {
          if (haystack.getItem(i)._id == needle) {
            return i;
          }
        }
      }
      return -1;
    }

    load(){
      var rows = this.database.executeQuery("people");
      for (var i in rows) {
        if (rows.hasOwnProperty(i)) {
          this.people.push(JSON.parse(rows[i]));
        }
      }
    }
}
