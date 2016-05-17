import {Injectable} from "@angular/core";
import {Observable} from 'data/observable';
import {ObservableArray} from 'data/observable-array';

var CouchbaseModule = require('nativescript-couchbase');

@Injectable()
export class ListService {
    public people: Array<any> = [];
    private database: any;

    constructor(){
      //this.personList = new ObservableArray([]);
      this.database = new CouchbaseModule.Couchbase("test-database");
      console.log(this.database);
    }

    load(){

    }
}
