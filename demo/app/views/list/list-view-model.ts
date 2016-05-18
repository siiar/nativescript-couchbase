import {Couchbase} from 'nativescript-couchbase';
import {Observable} from 'data/observable';
import {ObservableArray} from 'data/observable-array';
import {topmost} from 'ui/frame';

export class ListDemo extends Observable {
  public personList: ObservableArray<any>;
  private database: any;

  constructor() {
    super();
    this.personList = new ObservableArray([]);
    this.database = new Couchbase("test-database");

    this.database.createView("people", "1", (document, emitter) => {
      emitter.emit(JSON.parse(document)._id, document);
    });

    var push = this.database.createPushReplication("http://192.168.57.1:4984/test-database");
    var pull = this.database.createPullReplication("http://192.168.57.1:4984/test-database");

    push.setContinuous(true);
    pull.setContinuous(true);

    push.start();
    pull.start();

    this.database.addDatabaseChangeListener((changes) => {
      console.log(changes);

      var changeIndex;
      for (var i = 0; i < changes.length; i++) {
        var documentId;

        documentId = changes[i].getDocumentId();
        changeIndex = this.indexOfObjectId(documentId, this.personList);
        var document = this.database.getDocument(documentId);

        if (changeIndex == -1) {
          this.personList.push(document);
        } else {
          this.personList.setItem(changeIndex, document);
        }
      }
    });

    this.refresh();
  }

  public create() {
    topmost().navigate({ moduleName: "views/create/create" });
  }

  private refresh() {
    var rows = this.database.executeQuery("people");
    for (var i in rows) {
      if (rows.hasOwnProperty(i)) {
        this.personList.push(JSON.parse(rows[i]));
      }
    }
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
}
