import {Couchbase} from 'nativescript-couchbase';
import {Observable} from 'data/observable';
import {ObservableArray} from 'data/observable-array';
import {topmost, goBack} from 'ui/frame';

export class CreateDemo extends Observable {
  private database: any;
  private tfFirstName: any;
  private tfLastName: any;

  constructor(page: any) {
    super();
    this.database = new Couchbase("test-database");

    this.tfFirstName = page.getViewById("firstname");
    this.tfLastName = page.getViewById("lastname");
  }

  public save() {
    this.database.createDocument({
      "firstname": this.tfFirstName.text,
      "lastname": this.tfLastName.text
    });
    goBack();
  }
}