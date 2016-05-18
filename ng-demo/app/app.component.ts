import {Component} from "@angular/core";
import {HTTP_PROVIDERS} from "@angular/http";
import {RouteConfig} from "@angular/router-deprecated";
import {NS_ROUTER_DIRECTIVES, NS_ROUTER_PROVIDERS} from "nativescript-angular/router";
import {ListComponent} from "./pages/list/list.component";
import {CreateComponent} from "./pages/create/create.component";

@Component({
  selector: "main",
  directives: [NS_ROUTER_DIRECTIVES],
  providers: [HTTP_PROVIDERS, NS_ROUTER_PROVIDERS],
  template: "<page-router-outlet></page-router-outlet>"
})
@RouteConfig([
  { path: "/List", component: ListComponent, name: "List", useAsDefault:true },
  { path: "/Create", component: CreateComponent, name: "Create"}
])
export class AppComponent {}
