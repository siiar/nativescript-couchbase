import {Injectable} from "@angular/core";
import {Observable} from 'data/observable';
import {ObservableArray} from 'data/observable-array';

var CouchbaseModule = require('nativescript-couchbase');

@Injectable()
export class CreateService {
    public people = new ObservableArray([])
    private database: any;

    constructor(){
        this.database = new CouchbaseModule.Couchbase("test-database");
    }

    save(data: any){
      this.database.createDocument({
        "firstname": data.firstname,
        "lastname": data.lastname
      });
    }
}
