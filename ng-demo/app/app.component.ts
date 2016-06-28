import {Component} from "@angular/core";
import {RouteConfig} from "@angular/router-deprecated";
import {NS_ROUTER_DIRECTIVES, NS_ROUTER_PROVIDERS} from "nativescript-angular/router";
import {CouchbaseInstance} from './couchbaseinstance';

import {ListComponent} from "./components/list/list.component";
import {CreateComponent} from "./components/create/create.component";

@Component({
    selector: "my-app",
    directives: [NS_ROUTER_DIRECTIVES],
    providers: [NS_ROUTER_PROVIDERS],
    template: "<page-router-outlet></page-router-outlet>"
})
@RouteConfig([
    { path: "/list", component: ListComponent, name: "List", useAsDefault: true },
    { path: "/create", component: CreateComponent, name: "Create" },
])
export class AppComponent {

    constructor(couchbaseInstance: CouchbaseInstance) {
        couchbaseInstance.init();
    }

}
