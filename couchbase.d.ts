declare module "nativescript-couchbase" {

    export class Couchbase {
        constructor(databaseName: string);
        createDocument(data: Object);
        getDocument(documentId: string);
        updateDocument(documentId: string, data: Object);
        deleteDocument(documentId: string);
        destroyDatabase();
        createView(viewName: string, viewRevision: string, callback: any);
        executeQuery(viewName: string);
        createPullReplication(remoteUrl: string);
        createPushReplication(remoteUrl: string);
        addDatabaseChangeListener(callback: any);
    }

}
