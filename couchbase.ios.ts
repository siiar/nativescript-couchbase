export class Couchbase {

    private manager: any;
    private database: any;

    constructor(databaseName: String){
        this.manager = CBLManager.sharedInstance();
        if (!this.manager){
            console.log("MANAGER ERROR:Can not create share instance of CBLManager");
        }
        var errorRef = new interop.Reference();

        this.database = this.manager.databaseNamedError(databaseName, errorRef);

        if (!this.database){
          console.log(errorRef.value);
        }
    }
    createDocument(data: Object){
        var doc = this.database.createDocument();

        var documentId = doc.documentID;

        var errorRef = new interop.Reference();
        var revision  = doc.putPropertiesError(data, errorRef);

        if (!errorRef){
            console.log("DOCUMENT ERROR:" + errorRef.value);
        }

        return documentId;
    }

    getDocument(documentId: string){
        var document = this.database.documentWithID(documentId);
        if (document){
          return  JSON.parse(this.mapToJson(document.properties));
        }
        return null;
    }

    updateDocument(documentId: string, data: Object){
      var document = this.database.documentWithID(documentId);

      var errorRef = new interop.Reference();
      var revision  = document.putPropertiesError(data, errorRef);

      if (!errorRef){
        console.error("DOCUMENT ERROR", errorRef.value);
      }
    }

    deleteDocument(documentId){
      var document = this.database.documentWithID(documentId);
      var errorRef = new interop.Reference();

      document.deleteDocument(errorRef);

      if (!errorRef){
        return false;
      }
      return true;
    }

    createView(viewName: string, viewRevision: string, callback: any) {
        var self = this;
        var view = this.database.viewNamed(viewName)
        view.setMapBlockVersion(function(document, emit){
              callback(self.mapToJson(document), {
                  emit : emit
              });
        }, viewRevision);
    }

    executeQuery(viewName: string) {
      var view = this.database.viewNamed(viewName);
      var query = view.createQuery();
      var errorRef = new interop.Reference();
      var resultSet = query.run(errorRef);

      var row = resultSet.nextRow();

      var results = []
      var index = 0;

      while(row){
         results[index++] = row.value;
         row = resultSet.nextRow();
       }

       if (!errorRef){
           console.log(errorRef.value);
       }

       return results;
    }

    createPullReplication(remoteUrl: string) {
        var url = NSURL.URLWithString(remoteUrl);

        var replication = this.database.createPullReplication(url);

        if (!replication){
          console.error("PULL ERROR");
        }

        return new Replicator(replication);
    }

    createPushReplication(remoteUrl: string) {
        var url = NSURL.URLWithString(remoteUrl);

        var replication = this.database.createPushReplication(url);

        if (!replication){
           console.error("PUSH ERROR");
        }

        return new Replicator(replication);;
    }

    addDatabaseChangeListener(callback: any) {
      var self = this;
      NSNotificationCenter.defaultCenter().addObserverForNameObjectQueueUsingBlock(kCBLDatabaseChangeNotification, null,NSOperationQueue.mainQueue(), function(notification){
            var ids = [];
            if (notification.userInfo){
              var changes = notification.userInfo.objectForKey("changes");

              if (changes != null){

                for (var i = 0; i < changes.count; i++){
                    ids.push(changes[i].changes);
                }
                callback(ids);
              }
            }
        });
    }

    destroyDatabase() {
        var errorRef = new interop.Reference();

        this.database.deleteDatabase(errorRef);

        if (!errorRef){
          console.error("DESTROY", errorRef.value);
        }
    }

    mapToJson(properties: Object){
      var errorRef = new interop.Reference();

      var data = NSJSONSerialization.dataWithJSONObjectOptionsError(properties, NSJSONWritingPrettyPrinted, errorRef);

      var jsonString = NSString.alloc().initWithDataEncoding(data, NSUTF8StringEncoding)

      return jsonString;
    }
}

export class Replicator {

    replicator: any;

    constructor(replicator: any) {
        this.replicator = replicator;
    }

    start() {
        this.replicator.start();
    }

    setContinuous(isContinuous: boolean) {
        this.replicator.continuous = isContinuous;
    }

}
