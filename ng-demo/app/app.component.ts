import {Component} from "@angular/core";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";
import {CouchbaseInstance} from './couchbaseinstance';

@Component({
    selector: "my-app",
    directives: [NS_ROUTER_DIRECTIVES],
    template: "<page-router-outlet></page-router-outlet>"
})
export class AppComponent {

    constructor(couchbaseInstance: CouchbaseInstance) {
        couchbaseInstance.init();
    }

}
