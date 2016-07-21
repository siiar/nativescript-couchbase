import {Couchbase} from 'nativescript-couchbase';

export class CouchbaseInstance {

    private database: any;
    private pull: any;
    private push: any;

    constructor() { }

    init() {
        this.database = new Couchbase("test-database");

        this.database.createView("people", "1", (document, emitter) => {
            emitter.emit(document._id, document);
        });
    }

    getDatabase() {
        return this.database;
    }

    startSync(continuous: boolean) {
        this.push = this.database.createPushReplication("http://192.168.58.1:4984/test-database");
        this.pull = this.database.createPullReplication("http://192.168.58.1:4984/test-database");

        this.push.setContinuous(continuous);
        this.pull.setContinuous(continuous);

        this.push.start();
        this.pull.start();
    }

    stopSync() {
        this.push.stop();
        this.pull.stop();
    }

}
